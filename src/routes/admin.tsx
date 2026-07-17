import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Boxes, ClipboardList, ImagePlus, PackagePlus, Pencil, Plus, RefreshCw,
  Trash2, UploadCloud, X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { formatPEN } from '@/lib/format';

const STORAGE_BUCKET = 'images';
const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const statuses = ['received', 'payment_confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
const statusLabels: Record<string, string> = {
  received: 'Pedido recibido', payment_confirmed: 'Pago confirmado', preparing: 'Preparando pedido',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
};

type ProductForm = {
  name: string; slug: string; sku: string; internal_code: string; short_description: string;
  description: string; category_id: string; subcategory_id: string; brand_id: string;
  price: string; original_price: string; stock: string;
  featured: boolean; is_new: boolean; is_offer: boolean; is_active: boolean;
};

const emptyProduct: ProductForm = {
  name: '', slug: '', sku: '', internal_code: '', short_description: '', description: '',
  category_id: '', subcategory_id: '', brand_id: '', price: '', original_price: '', stock: '0',
  featured: false, is_new: false, is_offer: false, is_active: true,
};

const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const safeFileName = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '');

export function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setBusy(true);
    const [o, p, c, s, b] = await Promise.all([
      supabase.from('orders').select('*,order_items(*)').order('created_at', { ascending: false }).limit(100),
      supabase.from('products').select('*').order('name'),
      supabase.from('categories').select('id,name,slug').order('name'),
      supabase.from('subcategories').select('id,name,category_id').order('name'),
      supabase.from('brands').select('id,name,slug').order('name'),
    ]);
    setOrders(o.data ?? []); setProducts(p.data ?? []); setCategories(c.data ?? []);
    setSubcategories(s.data ?? []); setBrands(b.data ?? []); setBusy(false);
  };

  useEffect(() => { if (isAdmin) void load(); }, [isAdmin]);

  useEffect(() => () => {
    imageFiles.forEach((file) => URL.revokeObjectURL((file as File & { preview?: string }).preview ?? ''));
  }, [imageFiles]);

  const filteredSubcategories = useMemo(() => form.category_id
    ? subcategories.filter((item) => String(item.category_id) === String(form.category_id))
    : subcategories, [form.category_id, subcategories]);

  if (loading) return <div className="container-x py-10">Validando acceso...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const status = async (id: string, value: string) => {
    await supabase.from('orders').update({ status: value }).eq('id', id); await load();
  };

  const updateProduct = async (id: number, field: string, value: any) => {
    const { error } = await supabase.from('products').update({ [field]: value }).eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message }); else await load();
  };

  const resetProductModal = () => {
    imageFiles.forEach((file) => URL.revokeObjectURL((file as File & { preview?: string }).preview ?? ''));
    setForm(emptyProduct);
    setExistingImages([]);
    setImageFiles([]);
    setEditingProduct(null);
    setShowProductModal(false);
  };

  const openCreate = () => {
    setMessage(null);
    setEditingProduct(null);
    setForm(emptyProduct);
    setExistingImages([]);
    setImageFiles([]);
    setShowProductModal(true);
  };

  const openEdit = (product: any) => {
    setMessage(null);
    setEditingProduct(product);
    setForm({
      name: product.name ?? '', slug: product.slug ?? '', sku: product.sku ?? '',
      internal_code: product.internal_code ?? '', short_description: product.short_description ?? '',
      description: product.description ?? '', category_id: String(product.category_id ?? ''),
      subcategory_id: String(product.subcategory_id ?? ''), brand_id: String(product.brand_id ?? ''),
      price: String(product.price ?? ''), original_price: product.original_price == null ? '' : String(product.original_price),
      stock: String(product.stock ?? 0), featured: Boolean(product.featured), is_new: Boolean(product.is_new),
      is_offer: Boolean(product.is_offer), is_active: Boolean(product.is_active),
    });
    setExistingImages(Array.isArray(product.images) ? product.images : []);
    setImageFiles([]);
    setShowProductModal(true);
  };

  const chooseImages = (files: FileList | null) => {
    if (!files) return;
    setMessage(null);
    const available = MAX_IMAGES - existingImages.length - imageFiles.length;
    if (available <= 0) {
      setMessage({ type: 'error', text: `Solo puedes guardar hasta ${MAX_IMAGES} imágenes por producto.` });
      return;
    }
    const selected = Array.from(files).slice(0, available);
    const invalid = selected.find((file) => !file.type.startsWith('image/') || file.size > MAX_IMAGE_SIZE);
    if (invalid) {
      setMessage({ type: 'error', text: 'Cada archivo debe ser una imagen y pesar como máximo 5 MB.' });
      return;
    }
    const withPreview = selected.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) }));
    setImageFiles((current) => [...current, ...withPreview]);
  };

  const removeNewImage = (index: number) => {
    setImageFiles((current) => {
      const target = current[index] as File & { preview?: string };
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return current.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const uploadImages = async () => {
    const urls: string[] = [];
    const uploadedPaths: string[] = [];
    for (const [index, file] of imageFiles.entries()) {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const base = safeFileName(file.name.replace(/\.[^/.]+$/, '')) || 'producto';
      const path = `products/${Date.now()}-${index}-${base}.${extension}`;
      const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
        cacheControl: '3600', upsert: false, contentType: file.type,
      });
      if (error) {
        if (uploadedPaths.length) await supabase.storage.from(STORAGE_BUCKET).remove(uploadedPaths);
        throw new Error(`No se pudo subir ${file.name}: ${error.message}`);
      }
      uploadedPaths.push(path);
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return { urls, paths: uploadedPaths };
  };

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage(null);
    if (!form.name.trim() || !form.sku.trim() || !form.price || !form.category_id || !form.brand_id) {
      setMessage({ type: 'error', text: 'Completa nombre, SKU, precio, categoría y marca.' }); return;
    }
    if (!editingProduct && existingImages.length + imageFiles.length === 0) {
      setMessage({ type: 'error', text: 'Selecciona al menos una imagen para el producto.' }); return;
    }
    setSaving(true);
    let uploadedPaths: string[] = [];
    try {
      const uploadResult = await uploadImages();
      uploadedPaths = uploadResult.paths;
      const images = [...existingImages, ...uploadResult.urls];
      const payload = {
        name: form.name.trim(), slug: form.slug.trim() || slugify(form.name), sku: form.sku.trim(),
        internal_code: form.internal_code.trim() || null,
        short_description: form.short_description.trim(), description: form.description.trim(),
        category_id: Number(form.category_id), subcategory_id: form.subcategory_id ? Number(form.subcategory_id) : null,
        brand_id: Number(form.brand_id), price: Number(form.price),
        original_price: form.original_price ? Number(form.original_price) : null, stock: Number(form.stock || 0),
        images, specifications: editingProduct?.specifications ?? [], compatibility: editingProduct?.compatibility ?? [],
        applications: editingProduct?.applications ?? [], tags: editingProduct?.tags ?? [],
        featured: form.featured, is_new: form.is_new, is_offer: form.is_offer, is_active: form.is_active,
      };
      const query = editingProduct
        ? supabase.from('products').update(payload).eq('id', editingProduct.id)
        : supabase.from('products').insert(payload);
      const { error } = await query;
      if (error) {
        if (uploadedPaths.length) await supabase.storage.from(STORAGE_BUCKET).remove(uploadedPaths);
        throw error;
      }
      setMessage({ type: 'ok', text: editingProduct ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.' });
      resetProductModal();
      await load();
    } catch (error: any) {
      setMessage({ type: 'error', text: error?.message ?? 'No se pudo guardar el producto.' });
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: any) => {
    const confirmed = window.confirm(`¿Eliminar definitivamente “${product.name}”? Esta acción no se puede deshacer.`);
    if (!confirmed) return;
    setDeletingId(product.id); setMessage(null);
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    setDeletingId(null);
    if (error) {
      setMessage({ type: 'error', text: `No se pudo eliminar: ${error.message}` });
      return;
    }
    setMessage({ type: 'ok', text: 'Producto eliminado correctamente.' });
    await load();
  };

  return <div className="container-x py-8">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-3xl font-black">Panel administrativo</h1><p className="text-sm text-muted-foreground">Gestiona pedidos, inventario y catálogo desde un solo lugar.</p></div>
      <button className="btn-outline inline-flex items-center gap-2" onClick={load}><RefreshCw className="h-4 w-4" />Actualizar</button>
    </div>
    {message && <div className={`mt-4 rounded-lg border p-3 text-sm ${message.type === 'ok' ? 'border-green-300 bg-green-50 text-green-800' : 'border-red-300 bg-red-50 text-red-800'}`}>{message.text}</div>}
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        <button className={tab === 'orders' ? 'btn-primary inline-flex items-center gap-2' : 'btn-outline inline-flex items-center gap-2'} onClick={() => setTab('orders')}><ClipboardList className="h-4 w-4" />Pedidos</button>
        <button className={tab === 'products' ? 'btn-primary inline-flex items-center gap-2' : 'btn-outline inline-flex items-center gap-2'} onClick={() => setTab('products')}><Boxes className="h-4 w-4" />Productos</button>
      </div>
      {tab === 'products' && <button className="btn-primary inline-flex items-center gap-2" onClick={openCreate}><Plus className="h-4 w-4" />Nuevo producto</button>}
    </div>

    {busy ? <p className="mt-6">Cargando...</p> : tab === 'orders' ?
      <div className="mt-5 overflow-x-auto rounded-lg border"><table className="w-full min-w-[900px] text-sm"><thead className="bg-muted"><tr><Th>Pedido</Th><Th>Cliente</Th><Th>Fecha</Th><Th>Total</Th><Th>Productos</Th><Th>Estado</Th></tr></thead><tbody>{orders.map(o => <tr key={o.id} className="border-t"><Td><b>{o.order_number}</b></Td><Td>{o.customer_first_name} {o.customer_last_name}<br /><span className="text-xs text-muted-foreground">{o.customer_email}</span></Td><Td>{new Date(o.created_at).toLocaleString('es-PE')}</Td><Td>{formatPEN(Number(o.total))}</Td><Td>{o.order_items?.length ?? 0}</Td><Td><select className="input-x min-w-48" value={o.status} onChange={e => status(o.id, e.target.value)}>{statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}</select></Td></tr>)}</tbody></table></div>
      : <div className="mt-5 overflow-x-auto rounded-lg border"><table className="w-full min-w-[1000px] text-sm"><thead className="bg-muted"><tr><Th>Imagen</Th><Th>Producto</Th><Th>SKU</Th><Th>Precio</Th><Th>Stock</Th><Th>Activo</Th><Th>Acciones</Th></tr></thead><tbody>{products.map(p => <tr key={p.id} className="border-t"><Td>{Array.isArray(p.images) && p.images[0] ? <img src={p.images[0]} alt={p.name} className="h-14 w-14 rounded-md border object-cover" /> : <div className="grid h-14 w-14 place-items-center rounded-md border bg-muted text-xs">Sin foto</div>}</Td><Td><b>{p.name}</b><div className="mt-1 text-xs text-muted-foreground">{Array.isArray(p.images) ? `${p.images.length} imagen(es)` : '0 imágenes'}</div></Td><Td>{p.sku}</Td><Td><input className="input-x w-32" type="number" defaultValue={p.price} onBlur={e => updateProduct(p.id, 'price', Number(e.target.value))} /></Td><Td><input className="input-x w-28" type="number" defaultValue={p.stock} onBlur={e => updateProduct(p.id, 'stock', Number(e.target.value))} /></Td><Td><input type="checkbox" checked={p.is_active} onChange={e => updateProduct(p.id, 'is_active', e.target.checked)} /></Td><Td><div className="flex gap-2"><button type="button" className="inline-flex items-center gap-1 rounded-md border px-3 py-2 font-semibold hover:bg-muted" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" />Editar</button><button type="button" disabled={deletingId === p.id} className="inline-flex items-center gap-1 rounded-md border border-red-300 px-3 py-2 font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60" onClick={() => deleteProduct(p)}><Trash2 className="h-4 w-4" />{deletingId === p.id ? 'Eliminando...' : 'Eliminar'}</button></div></Td></tr>)}</tbody></table></div>}

    {showProductModal && <div className="fixed inset-0 z-[200] grid place-items-center bg-black/55 p-3" onMouseDown={resetProductModal}>
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-background shadow-2xl" onMouseDown={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground"><PackagePlus className="h-5 w-5" /></span><div><h2 className="text-xl font-black">{editingProduct ? 'Editar producto' : 'Crear nuevo producto'}</h2><p className="text-xs text-muted-foreground">Los campos con * son obligatorios.</p></div></div><button className="rounded p-2 hover:bg-muted" onClick={resetProductModal}><X className="h-5 w-5" /></button></div>
        <form onSubmit={saveProduct} className="grid gap-5 p-5">
          <div className="grid gap-4 md:grid-cols-2"><AdminField label="Nombre *" value={form.name} onChange={v => setForm({ ...form, name: v, slug: form.slug || slugify(v) })} /><AdminField label="Slug" value={form.slug} onChange={v => setForm({ ...form, slug: slugify(v) })} /><AdminField label="SKU *" value={form.sku} onChange={v => setForm({ ...form, sku: v })} /><AdminField label="Código interno" value={form.internal_code} onChange={v => setForm({ ...form, internal_code: v })} /></div>
          <div className="grid gap-4 md:grid-cols-3"><AdminSelect label="Categoría *" value={form.category_id} options={categories} onChange={v => setForm({ ...form, category_id: v, subcategory_id: '' })} /><AdminSelect label="Subcategoría" value={form.subcategory_id} options={filteredSubcategories} onChange={v => setForm({ ...form, subcategory_id: v })} optional /><AdminSelect label="Marca *" value={form.brand_id} options={brands} onChange={v => setForm({ ...form, brand_id: v })} /></div>
          <div className="grid gap-4 md:grid-cols-3"><AdminField label="Precio (S/) *" type="number" value={form.price} onChange={v => setForm({ ...form, price: v })} /><AdminField label="Precio anterior" type="number" value={form.original_price} onChange={v => setForm({ ...form, original_price: v })} /><AdminField label="Stock *" type="number" value={form.stock} onChange={v => setForm({ ...form, stock: v })} /></div>
          <div><label className="mb-1 block text-xs font-bold uppercase">Descripción corta</label><textarea className="input-x min-h-20" value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })} /></div>
          <div><label className="mb-1 block text-xs font-bold uppercase">Descripción completa</label><textarea className="input-x min-h-28" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase"><ImagePlus className="h-4 w-4" />Imágenes del producto *</label>
            <input ref={fileInputRef} className="hidden" type="file" accept="image/png,image/jpeg,image/webp,image/avif" multiple onChange={e => { chooseImages(e.target.files); e.target.value = ''; }} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 px-5 py-8 text-center transition hover:bg-primary/10">
              <UploadCloud className="mb-2 h-9 w-9 text-primary" />
              <span className="font-bold">Seleccionar una o varias imágenes</span>
              <span className="mt-1 text-xs text-muted-foreground">PNG, JPG, WEBP o AVIF · máximo 5 MB por imagen · hasta {MAX_IMAGES} imágenes</span>
            </button>
            {(existingImages.length > 0 || imageFiles.length > 0) && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {existingImages.map((url, index) => <ImagePreview key={`${url}-${index}`} src={url} label={index === 0 ? 'Principal' : `Imagen ${index + 1}`} onRemove={() => setExistingImages(current => current.filter((_, i) => i !== index))} />)}
              {imageFiles.map((file, index) => <ImagePreview key={`${file.name}-${file.lastModified}-${index}`} src={(file as File & { preview?: string }).preview ?? ''} label="Nueva" onRemove={() => removeNewImage(index)} />)}
            </div>}
            <p className="mt-2 text-xs text-muted-foreground">La primera imagen será la principal del producto.</p>
          </div>

          <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 sm:grid-cols-4">{([['featured','Destacado'],['is_new','Nuevo'],['is_offer','En oferta'],['is_active','Activo']] as const).map(([key,label]) => <label key={key} className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} />{label}</label>)}</div>
          <div className="flex justify-end gap-2 border-t pt-4"><button type="button" className="btn-outline" onClick={resetProductModal}>Cancelar</button><button disabled={saving} className="btn-primary">{saving ? 'Guardando...' : editingProduct ? 'Guardar cambios' : 'Crear producto'}</button></div>
        </form>
      </div>
    </div>}
  </div>;
}

function ImagePreview({ src, label, onRemove }: { src: string; label: string; onRemove: () => void }) {
  return <div className="relative overflow-hidden rounded-lg border bg-muted"><img src={src} alt={label} className="aspect-square w-full object-cover" /><span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-white">{label}</span><button type="button" onClick={onRemove} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-white hover:bg-red-600" aria-label="Quitar imagen"><X className="h-4 w-4" /></button></div>;
}
function AdminField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) { return <div><label className="mb-1 block text-xs font-bold uppercase">{label}</label><input className="input-x" type={type} value={value} min={type === 'number' ? 0 : undefined} step={type === 'number' ? '0.01' : undefined} onChange={e => onChange(e.target.value)} /></div>; }
function AdminSelect({ label, value, options, onChange, optional = false }: { label: string; value: string; options: any[]; onChange: (v: string) => void; optional?: boolean }) { return <div><label className="mb-1 block text-xs font-bold uppercase">{label}</label><select className="input-x" value={value} onChange={e => onChange(e.target.value)}><option value="">{optional ? 'Sin seleccionar' : 'Seleccionar'}</option>{options.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></div>; }
function Th({ children }: { children: React.ReactNode }) { return <th className="px-3 py-3 text-left text-xs uppercase">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="px-3 py-3 align-middle">{children}</td>; }
