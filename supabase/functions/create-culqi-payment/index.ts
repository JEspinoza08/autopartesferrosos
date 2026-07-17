import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const culqiSecret = Deno.env.get('CULQI_SECRET_KEY');
    if (!culqiSecret) return json({ error: 'Falta configurar CULQI_SECRET_KEY en Supabase Secrets.' }, 500);

    const authHeader = req.headers.get('Authorization') ?? '';
    const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } });
    const { data: auth } = await userClient.auth.getUser();
    if (!auth.user) return json({ error: 'Debes iniciar sesión.' }, 401);
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const body = await req.json();
    if (!body.token_id) return json({ error: 'No se recibió el token de Culqi.' }, 400);

    const ids = body.items.map((x: any) => Number(x.product_id));
    const { data: dbProducts, error: productsError } = await admin.from('products').select('id,name,price,stock,is_active').in('id', ids);
    if (productsError) throw productsError;
    let subtotal = 0;
    for (const line of body.items) {
      const p = dbProducts.find((x: any) => Number(x.id) === Number(line.product_id));
      if (!p || !p.is_active || Number(line.quantity) > Number(p.stock)) throw new Error(`Stock insuficiente para ${p?.name ?? 'un producto'}.`);
      subtotal += Number(p.price) * Number(line.quantity);
    }
    let discount = 0;
    let shipping = body.address?.deliveryType === 'sucursal' || subtotal >= 800 ? 0 : 25;
    const coupon = String(body.coupon_code ?? '').toUpperCase();
    if (coupon) {
      const { data: c } = await admin.from('coupons').select('*').eq('code', coupon).eq('is_active', true).maybeSingle();
      if (c && subtotal >= Number(c.minimum_amount ?? 0)) {
        if (c.discount_type === 'percentage') discount = Math.min(subtotal * Number(c.discount_value) / 100, Number(c.maximum_discount ?? subtotal));
        if (c.discount_type === 'fixed') discount = Number(c.discount_value);
        if (c.discount_type === 'free_shipping') shipping = 0;
      }
    }
    const total = Math.max(0, subtotal - discount + shipping);

    const chargeResponse = await fetch('https://api.culqi.com/v2/charges', {
      method: 'POST',
      headers: { Authorization: `Bearer ${culqiSecret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(total * 100), currency_code: 'PEN', email: body.token_email || body.customer.email,
        source_id: body.token_id, capture: true, description: 'Compra Autopartes Ferrosos',
        installments: Number(body.installments ?? 1),
        antifraud_details: {
          address: body.address.address || 'Recojo en sucursal', address_city: body.address.district || body.address.province || 'Lima', country_code: 'PE',
          first_name: body.customer.firstName, last_name: body.customer.lastName, phone_number: body.customer.phone,
        },
        metadata: { user_id: auth.user.id, document_number: body.customer.docNumber },
      }),
    });
    const charge = await chargeResponse.json();
    if (!chargeResponse.ok || charge.object === 'error') {
      const message = charge.user_message || charge.merchant_message || 'Culqi rechazó el pago.';
      return json({ error: message, culqi: charge }, 402);
    }

    // Importar lógica compartida no es fiable entre funciones desplegadas; se crea el pedido aquí.
    const { data: number } = await admin.rpc('generate_order_number');
    const { data: order, error: orderError } = await admin.from('orders').insert({
      order_number: number, user_id: auth.user.id, status: 'payment_confirmed',
      customer_first_name: body.customer.firstName, customer_last_name: body.customer.lastName, customer_email: body.customer.email,
      customer_phone: body.customer.phone, document_type: body.customer.docType, document_number: body.customer.docNumber,
      company_name: body.customer.razonSocial || null, delivery_type: body.address.deliveryType,
      department: body.address.department || null, province: body.address.province || null, district: body.address.district || null,
      shipping_address: body.address.address || null, address_reference: body.address.reference || null,
      invoice_type: body.invoice?.invoiceType ?? 'boleta', invoice_ruc: body.invoice?.ruc || null, invoice_business_name: body.invoice?.razonSocial || null,
      invoice_fiscal_address: body.invoice?.direccion || null, payment_method: 'tarjeta', coupon_code: coupon || null,
      subtotal, discount, shipping_cost: shipping, total,
    }).select().single();
    if (orderError) throw orderError;

    const fullProducts = await admin.from('products').select('id,name,sku,images,price,stock').in('id', ids);
    const pm = new Map(fullProducts.data.map((p: any) => [Number(p.id), p]));
    await admin.from('order_items').insert(body.items.map((line: any) => { const p: any = pm.get(Number(line.product_id)); return { order_id: order.id, product_id: p.id, product_name: p.name, sku: p.sku, image_url: p.images?.[0] ?? null, unit_price: p.price, quantity: Number(line.quantity) }; }));
    for (const line of body.items) {
      const p: any = pm.get(Number(line.product_id)); const next = Number(p.stock) - Number(line.quantity);
      await admin.from('products').update({ stock: next }).eq('id', p.id).eq('stock', p.stock);
      await admin.from('inventory_movements').insert({ product_id: p.id, movement_type: 'sale', quantity: -Number(line.quantity), previous_stock: p.stock, new_stock: next, reference_type: 'order', reference_id: order.id, note: `Pedido ${order.order_number}`, created_by: auth.user.id });
    }
    await admin.from('payments').insert({ order_id: order.id, provider: 'culqi', method: 'tarjeta', status: 'paid', transaction_id: charge.id, reference: charge.reference_code ?? null, amount: total, card_brand: charge.source?.iin?.card_brand ?? null, card_last4: charge.source?.card_number?.slice(-4) ?? null, installments: Number(body.installments ?? 1), paid_at: new Date().toISOString(), raw_response: charge });
    return json({ order_id: order.id, order_number: order.order_number, total, transaction_id: charge.id });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'Error inesperado.' }, 500);
  }
});
