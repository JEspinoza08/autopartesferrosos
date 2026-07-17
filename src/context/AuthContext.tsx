import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'customer' | 'sales' | 'warehouse' | 'admin';
  is_active: boolean;
};

type Ctx = {
  user: SupabaseUser | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ ok: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId?: string) => {
    const id = userId ?? session?.user.id;
    if (!id) { setProfile(null); return; }
    const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
    setProfile((data as Profile | null) ?? null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user.id) await loadProfile(data.session.user.id);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadProfile(nextSession?.user.id);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { ok: false, message: error.message } : { ok: true, message: 'Sesión iniciada' };
  };

  const register = async ({ name, email, phone, password }: { name: string; email: string; phone: string; password: string }) => {
    const parts = name.trim().split(/\s+/);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim(), first_name: parts[0] ?? '', last_name: parts.slice(1).join(' '), phone } },
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: 'Cuenta creada. Revisa tu correo si la confirmación está activada.' };
  };

  const logout = async () => { await supabase.auth.signOut(); };
  const value = useMemo(() => ({
    user: session?.user ?? null,
    session,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    login,
    register,
    logout,
    refreshProfile: () => loadProfile(),
  }), [session, profile, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error('AuthProvider missing');
  return c;
};
