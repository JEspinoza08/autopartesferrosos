import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type Ctx = {
  ids: number[];
  toggle: (id: number) => Promise<void>;
  has: (id: number) => boolean;
  remove: (id: number) => Promise<void>;
  clear: () => Promise<void>;
};
const FavCtx = createContext<Ctx | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<number[]>('af_favs', []);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    supabase.from('favorites').select('product_id').eq('user_id', user.id).then(({ data }) => {
      if (data) setIds(data.map((x) => Number(x.product_id)));
    });
  }, [user?.id]);

  const toggle = async (id: number) => {
    const exists = ids.includes(id);
    setIds((prev) => exists ? prev.filter((x) => x !== id) : [...prev, id]);
    if (!user) return;
    if (exists) await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', id);
    else await supabase.from('favorites').upsert({ user_id: user.id, product_id: id });
  };
  const remove = async (id: number) => {
    setIds((prev) => prev.filter((x) => x !== id));
    if (user) await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', id);
  };
  const clear = async () => {
    setIds([]);
    if (user) await supabase.from('favorites').delete().eq('user_id', user.id);
  };
  return <FavCtx.Provider value={{ ids, toggle, has: (id) => ids.includes(id), remove, clear }}>{children}</FavCtx.Provider>;
}
export const useFavorites = () => {
  const c = useContext(FavCtx);
  if (!c) throw new Error('FavoritesProvider missing');
  return c;
};
