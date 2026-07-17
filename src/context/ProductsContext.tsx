import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { products as fallbackProducts } from '@/data/products';
import type { Product } from '@/types';
import { useLocation } from 'react-router-dom';

type ProductsCtx = {
  products: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const Ctx = createContext<ProductsCtx | null>(null);

function mapProduct(row: any): Product {
  return {
    id: Number(row.id),
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? '',
    description: row.description ?? '',
    sku: row.sku,
    internalCode: row.internal_code ?? '',
    category: row.categories?.slug ?? row.categories?.name ?? '',
    subcategory: row.subcategories?.slug ?? row.subcategories?.name ?? '',
    brand: row.brands?.name ?? '',
    price: Number(row.price ?? 0),
    originalPrice: row.original_price == null ? undefined : Number(row.original_price),
    stock: Number(row.stock ?? 0),
    featured: Boolean(row.featured),
    isNew: Boolean(row.is_new),
    isOffer: Boolean(row.is_offer),
    images: Array.isArray(row.images) ? row.images : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    compatibility: Array.isArray(row.compatibility) ? row.compatibility : [],
    applications: Array.isArray(row.applications) ? row.applications : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    technicalSheet: row.technical_sheet_url ?? undefined,
  };
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(slug,name), subcategories(slug,name), brands(name)')
      .eq('is_active', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setProducts(fallbackProducts);
    } else {
      setError(null);
      setProducts((data ?? []).map(mapProduct));
    }
    setLoading(false);
  }, []);

  // Mantiene el catálogo sincronizado al navegar entre páginas dentro de la SPA.
  // Así, al volver al inicio o al catálogo después de comprar, se consulta el stock real.
  useEffect(() => { void refresh(); }, [location.pathname, refresh]);

  // También refresca al regresar a la pestaña del navegador.
  useEffect(() => {
    const handleFocus = () => { void refresh(); };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refresh]);
  const value = useMemo(() => ({ products, loading, error, refresh }), [products, loading, error]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProducts() {
  const value = useContext(Ctx);
  if (!value) throw new Error('ProductsProvider missing');
  return value;
}
