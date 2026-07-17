# Autopartes Ferrosos — Supabase + Culqi

## 1. Variables del frontend
Copia `.env.example` como `.env` y completa:

```env
VITE_SUPABASE_URL=https://aiaycpmlmmvfciuvqalx.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_CULQI_PUBLIC_KEY=pk_test_o_pk_live
```

La `service_role` y la llave secreta de Culqi nunca deben ir en Vite.

## 2. Instalar y ejecutar

```bash
npm install
npm run dev
```

## 3. Desplegar Edge Functions
Instala Supabase CLI, inicia sesión y vincula el proyecto:

```bash
npx supabase login
npx supabase link --project-ref aiaycpmlmmvfciuvqalx
npx supabase functions deploy create-order
npx supabase functions deploy create-culqi-payment
```

Configura la llave secreta de Culqi:

```bash
npx supabase secrets set CULQI_SECRET_KEY=sk_test_TU_LLAVE
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` son proporcionadas automáticamente a las funciones desplegadas.

## 4. Funcionalidades conectadas
- Supabase Auth: registro, login, sesión y recuperación.
- Perfil y roles desde `profiles`.
- Productos leídos desde Supabase, con fallback local si faltan variables.
- Favoritos sincronizados por usuario.
- Contacto y Libro de Reclamaciones guardados en Supabase.
- Pedidos, items, pagos, historial e inventario.
- Culqi Checkout v4 para tokenización segura.
- Cargo Culqi desde Edge Function con llave secreta.
- Panel `/admin` restringido al rol `admin`.

## 5. Producción
Reemplaza llaves `test` por llaves `live`, configura los dominios permitidos en Supabase Auth y CulqiPanel, y prueba compras reales de monto pequeño antes del lanzamiento.
