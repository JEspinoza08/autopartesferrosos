import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization') ?? '';
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
    const userClient = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } });
    const { data: auth } = await userClient.auth.getUser();
    if (!auth.user) return json({ error: 'Debes iniciar sesión.' }, 401);

    const body = await req.json();
    if (!Array.isArray(body.items) || body.items.length === 0) return json({ error: 'El carrito está vacío.' }, 400);
    if (body.payment_method === 'tarjeta') return json({ error: 'Usa la función de pago Culqi.' }, 400);

    const result = await createOrder(admin, auth.user.id, body, 'pending');
    return json(result);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'Error inesperado.' }, 500);
  }
});

async function createOrder(admin: any, userId: string, body: any, paymentStatus: string, charge?: any) {
  const ids = body.items.map((x: any) => Number(x.product_id));
  const { data: products, error } = await admin.from('products').select('id,name,sku,images,price,stock,is_active').in('id', ids);
  if (error) throw error;
  const map = new Map(products.map((p: any) => [Number(p.id), p]));
  let subtotal = 0;
  for (const line of body.items) {
    const p: any = map.get(Number(line.product_id));
    const qty = Number(line.quantity);
    if (!p || !p.is_active) throw new Error('Uno de los productos ya no está disponible.');
    if (!Number.isInteger(qty) || qty < 1 || qty > p.stock) throw new Error(`Stock insuficiente para ${p.name}.`);
    subtotal += Number(p.price) * qty;
  }

  let discount = 0;
  let shipping = subtotal >= 800 ? 0 : 25;
  const coupon = String(body.coupon_code ?? '').toUpperCase();
  if (coupon) {
    const { data: c } = await admin.from('coupons').select('*').eq('code', coupon).eq('is_active', true).maybeSingle();
    if (c && subtotal >= Number(c.minimum_amount ?? 0)) {
      if (c.discount_type === 'percentage') discount = Math.min(subtotal * Number(c.discount_value) / 100, Number(c.maximum_discount ?? subtotal));
      if (c.discount_type === 'fixed') discount = Number(c.discount_value);
      if (c.discount_type === 'free_shipping') shipping = 0;
    }
  }
  if (body.address?.deliveryType === 'sucursal') shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);
  const { data: number } = await admin.rpc('generate_order_number');

  const orderPayload = {
    order_number: number,
    user_id: userId,
    status: paymentStatus === 'paid' ? 'payment_confirmed' : 'received',
    customer_first_name: body.customer.firstName,
    customer_last_name: body.customer.lastName,
    customer_email: body.customer.email,
    customer_phone: body.customer.phone,
    document_type: body.customer.docType,
    document_number: body.customer.docNumber,
    company_name: body.customer.razonSocial || null,
    delivery_type: body.address.deliveryType,
    department: body.address.department || null,
    province: body.address.province || null,
    district: body.address.district || null,
    shipping_address: body.address.address || null,
    address_reference: body.address.reference || null,
    invoice_type: body.invoice?.invoiceType ?? 'boleta',
    invoice_ruc: body.invoice?.ruc || null,
    invoice_business_name: body.invoice?.razonSocial || null,
    invoice_fiscal_address: body.invoice?.direccion || null,
    payment_method: body.payment_method,
    coupon_code: coupon || null,
    subtotal, discount, shipping_cost: shipping, total,
  };
  const { data: order, error: orderError } = await admin.from('orders').insert(orderPayload).select().single();
  if (orderError) throw orderError;

  const orderItems = body.items.map((line: any) => {
    const p: any = map.get(Number(line.product_id));
    return { order_id: order.id, product_id: p.id, product_name: p.name, sku: p.sku, image_url: p.images?.[0] ?? null, unit_price: p.price, quantity: Number(line.quantity) };
  });
  const { error: itemError } = await admin.from('order_items').insert(orderItems);
  if (itemError) throw itemError;

  for (const line of body.items) {
    const p: any = map.get(Number(line.product_id));
    const next = Number(p.stock) - Number(line.quantity);
    const { error: stockError } = await admin.from('products').update({ stock: next }).eq('id', p.id).eq('stock', p.stock);
    if (stockError) throw stockError;
    await admin.from('inventory_movements').insert({ product_id: p.id, movement_type: 'sale', quantity: -Number(line.quantity), previous_stock: p.stock, new_stock: next, reference_type: 'order', reference_id: order.id, note: `Pedido ${order.order_number}`, created_by: userId });
  }

  await admin.from('payments').insert({ order_id: order.id, provider: charge ? 'culqi' : null, method: body.payment_method, status: paymentStatus, transaction_id: charge?.id ?? null, reference: charge?.reference_code ?? null, amount: total, card_brand: charge?.source?.iin?.card_brand ?? null, card_last4: charge?.source?.card_number?.slice(-4) ?? null, installments: Number(body.installments ?? 1), paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null, raw_response: charge ?? null });
  return { order_id: order.id, order_number: order.order_number, total };
}

export { createOrder };
