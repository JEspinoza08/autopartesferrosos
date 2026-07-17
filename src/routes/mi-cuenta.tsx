import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User, Package, MapPin, Heart, LogOut, ChevronRight, CheckCircle2, Clock3, Truck, PackageCheck, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { EmptyState } from '@/components/common/EmptyState';
import { formatPEN } from '@/lib/format';
import { getMyOrders } from '@/services/orders';
import { useFavorites } from '@/context/FavoritesContext';

const labels: Record<string, string> = { received: 'Pedido recibido', payment_confirmed: 'Pago confirmado', preparing: 'Preparando pedido', shipped: 'Pedido enviado', delivered: 'Pedido entregado', cancelled: 'Pedido cancelado' };
const statusOrder = ['received', 'payment_confirmed', 'preparing', 'shipped', 'delivered'];
const statusHelp: Record<string, string> = {
  received: 'Recibimos tu pedido y estamos validando la información.', payment_confirmed: 'El pago fue confirmado correctamente.',
  preparing: 'Estamos alistando y verificando tus productos.', shipped: 'Tu pedido ya salió rumbo a la dirección indicada.',
  delivered: 'La entrega fue completada.', cancelled: 'Este pedido fue cancelado.',
};
const icons = [Clock3, CreditCard, Package, Truck, PackageCheck];

export function Account() {
  const { user, profile, logout, loading } = useAuth();
  const { ids } = useFavorites(); const nav = useNavigate();
  const [tab, setTab] = useState<'resumen' | 'datos' | 'pedidos' | 'direcciones' | 'favoritos'>('resumen');
  const [orders, setOrders] = useState<any[]>([]); const [ordersLoading, setOrdersLoading] = useState(true);
  useEffect(() => { if (!loading && !user) nav('/login'); }, [user, loading, nav]);
  useEffect(() => { if (user) getMyOrders().then(setOrders).finally(() => setOrdersLoading(false)); }, [user?.id]);
  if (loading || !user) return null;
  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Cliente';

  return <div className="container-x py-6"><Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Mi cuenta' }]} /><h1 className="mt-4 text-3xl font-black">Hola, {displayName.split(' ')[0]}</h1>
    <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]"><aside className="h-fit rounded-lg border border-border bg-card p-3">{([
      ['resumen', 'Resumen', User], ['datos', 'Mis datos', User], ['pedidos', 'Mis pedidos', Package], ['direcciones', 'Direcciones', MapPin], ['favoritos', 'Favoritos', Heart],
    ] as const).map(([k, label, Icon]) => <button key={k} onClick={() => setTab(k)} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-semibold ${tab === k ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}><Icon className="h-4 w-4" />{label}</button>)}
      <button onClick={async () => { await logout(); nav('/'); }} className="mt-2 flex w-full items-center gap-2 rounded px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" />Cerrar sesión</button></aside>
      <section className="min-w-0 rounded-lg border border-border bg-card p-4 sm:p-5">
        {tab === 'resumen' && <div><h2 className="text-lg font-bold">Resumen</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><Stat label="Pedidos" value={String(orders.length)} /><Stat label="Favoritos" value={String(ids.length)} /><Stat label="Correo" value={user.email ?? '—'} /></div></div>}
        {tab === 'datos' && <div><h2 className="text-lg font-bold">Mis datos</h2><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Info l="Nombre" v={displayName} /><Info l="Correo" v={user.email ?? '—'} /><Info l="Celular" v={profile?.phone ?? '—'} /><Info l="Rol" v={profile?.role ?? 'customer'} /></dl></div>}
        {tab === 'pedidos' && <div><div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-xl font-black">Mis pedidos</h2><p className="text-sm text-muted-foreground">Revisa productos, importes y avance de cada compra.</p></div></div>{ordersLoading ? <p className="mt-4 text-sm text-muted-foreground">Cargando pedidos...</p> : orders.length === 0 ? <div className="mt-4"><EmptyState icon={Package} title="Aún no tienes pedidos" description="Cuando realices una compra aparecerá aquí." action={<Link to="/productos" className="btn-primary mt-2">Ir al catálogo</Link>} /></div> : <div className="mt-5 space-y-5">{orders.map(o => <OrderCard key={o.id} order={o} />)}</div>}</div>}
        {tab === 'direcciones' && <div><h2 className="text-lg font-bold">Direcciones</h2><p className="mt-2 text-sm text-muted-foreground">Las direcciones usadas en tus pedidos se almacenan de forma segura en Supabase.</p></div>}
        {tab === 'favoritos' && <div><h2 className="text-lg font-bold">Favoritos</h2><Link to="/favoritos" className="mt-2 inline-flex items-center gap-1 text-sm text-primary">Ver todos <ChevronRight className="h-4 w-4" /></Link></div>}
      </section></div></div>;
}

function OrderCard({ order: o }: { order: any }) {
  const cancelled = o.status === 'cancelled'; const idx = statusOrder.indexOf(o.status);
  return <article className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
    <header className="flex flex-wrap items-start justify-between gap-3 border-b bg-muted/35 p-4"><div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pedido</p><p className="font-black">{o.order_number}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString('es-PE')}</p></div><div className="text-right"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${cancelled ? 'bg-red-100 text-red-700' : 'bg-primary/15 text-foreground'}`}>{labels[o.status] ?? o.status}</span><p className="mt-2 text-xl font-black text-primary">{formatPEN(Number(o.total))}</p></div></header>
    <div className="p-4"><div className="space-y-3">{(o.order_items ?? []).map((item: any) => <div key={item.id} className="flex gap-3 rounded-lg border bg-card p-3"><div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">{item.image_url ? <img src={item.image_url} alt={item.product_name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><Package className="h-6 w-6 text-muted-foreground" /></div>}</div><div className="min-w-0 flex-1"><p className="font-bold leading-snug">{item.product_name}</p><p className="mt-1 text-xs text-muted-foreground">SKU: {item.sku || '—'}</p><div className="mt-2 flex flex-wrap justify-between gap-2 text-sm"><span>Cantidad: <b>{item.quantity}</b></span><span>{formatPEN(Number(item.unit_price))} c/u</span><b>{formatPEN(Number(item.unit_price) * Number(item.quantity))}</b></div></div></div>)}</div>
      {!cancelled && <div className="mt-5 overflow-x-auto pb-1"><div className="flex min-w-[570px] items-start">{statusOrder.map((s, i) => { const Icon = icons[i]; const done = i <= idx; return <div key={s} className="flex flex-1 items-start"><div className="flex w-full flex-col items-center text-center"><div className={`grid h-9 w-9 place-items-center rounded-full border-2 ${done ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'}`}>{done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}</div><span className={`mt-2 text-[11px] font-semibold ${done ? 'text-foreground' : 'text-muted-foreground'}`}>{labels[s]}</span></div>{i < statusOrder.length - 1 && <div className={`mt-4 h-1 flex-1 rounded ${i < idx ? 'bg-primary' : 'bg-muted'}`} />}</div>; })}</div></div>}
      <div className={`mt-5 rounded-lg p-3 text-sm ${cancelled ? 'bg-red-50 text-red-800' : 'bg-muted/60'}`}><b>{labels[o.status] ?? o.status}.</b> {statusHelp[o.status]}</div>
      <div className="mt-4 grid gap-2 border-t pt-4 text-sm sm:grid-cols-2"><p><span className="text-muted-foreground">Entrega:</span> <b>{o.delivery_type === 'sucursal' ? 'Recojo en sucursal' : `${o.shipping_address || ''}${o.district ? `, ${o.district}` : ''}`}</b></p><p className="sm:text-right"><span className="text-muted-foreground">Método de pago:</span> <b>{String(o.payment_method || '—').replace('-', ' ')}</b></p></div>
    </div></article>;
}
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-md border bg-muted/40 p-4"><p className="text-xs uppercase text-muted-foreground">{label}</p><p className="mt-1 truncate font-bold">{value}</p></div>; }
function Info({ l, v }: { l: string; v: string }) { return <div><dt className="text-muted-foreground">{l}</dt><dd className="font-semibold">{v}</dd></div>; }
