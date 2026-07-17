# Cambios realizados

- Panel administrativo: botón **Nuevo producto** y formulario completo conectado a Supabase.
- El formulario carga categorías, subcategorías y marcas desde la base de datos.
- Mis pedidos: ahora muestra los productos comprados, imagen, SKU, cantidad, precio unitario, subtotal por producto, entrega, pago y una línea de estados más clara.
- Checkout simplificado a cuatro pasos: Cliente, Dirección, Pago y Confirmación.
- El comprobante quedó oculto temporalmente; internamente las órdenes se registran como boleta para conservar compatibilidad con la estructura actual.
- Edge Functions ajustadas para aceptar pedidos sin datos explícitos de comprobante.
- Proyecto validado con `npm run build` correctamente.
