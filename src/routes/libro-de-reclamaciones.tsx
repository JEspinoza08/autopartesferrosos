import { useState } from 'react';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { BookOpen } from 'lucide-react';

export function Book() {
  const { show } = useToast();
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [form,setForm]=useState({full_name:'',document_number:'',email:'',phone:'',address:'',department:'',type:'reclamo',product_or_service:'',detail:'',consumer_request:''});
  const upd=(k:string,v:string)=>setForm({...form,[k]:v});
  const submit=async(e:React.FormEvent)=>{e.preventDefault(); const number=`REC-${Date.now().toString().slice(-9)}`; const {error}=await supabase.from('complaints').insert({...form,complaint_number:number,user_id:user?.id??null}); if(error)return show({type:'error',message:error.message}); setSent(true); show({type:'success',message:`Reclamo ${number} registrado`});};
  return <div className="container-x py-6"><Breadcrumbs items={[{label:'Inicio',to:'/'},{label:'Libro de reclamaciones'}]}/><div className="mt-4 flex items-center gap-3"><BookOpen className="h-8 w-8 text-primary"/><h1 className="text-3xl font-black">Libro de reclamaciones</h1></div><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Conforme al Código de Protección y Defensa del Consumidor. El contenido legal debe ser validado por la empresa.</p>{sent?<div className="mt-6 rounded border border-green-200 bg-green-50 p-4 text-sm text-green-800">Tu reclamo fue registrado correctamente.</div>:<form onSubmit={submit} className="mt-6 grid gap-3 rounded-lg border border-border bg-card p-5 sm:grid-cols-2"><Input l="Nombres y apellidos *" v={form.full_name} c={v=>upd('full_name',v)} req/><Input l="DNI / RUC *" v={form.document_number} c={v=>upd('document_number',v)} req/><Input l="Correo *" v={form.email} c={v=>upd('email',v)} type="email" req/><Input l="Celular *" v={form.phone} c={v=>upd('phone',v)} req/><Input l="Dirección" v={form.address} c={v=>upd('address',v)}/><Input l="Departamento" v={form.department} c={v=>upd('department',v)}/><div><Label>Tipo</Label><select className="input-x" value={form.type} onChange={e=>upd('type',e.target.value)}><option value="reclamo">Reclamo</option><option value="queja">Queja</option></select></div><Input l="Producto o servicio" v={form.product_or_service} c={v=>upd('product_or_service',v)}/><div className="sm:col-span-2"><Label>Detalle *</Label><textarea required rows={5} className="input-x" value={form.detail} onChange={e=>upd('detail',e.target.value)}/></div><div className="sm:col-span-2"><Label>Pedido del consumidor</Label><textarea rows={3} className="input-x" value={form.consumer_request} onChange={e=>upd('consumer_request',e.target.value)}/></div><button className="btn-primary sm:col-span-2">Enviar reclamo</button></form>}</div>;
}
function Label({children}:{children:React.ReactNode}){return <label className="mb-1 block text-xs font-semibold uppercase">{children}</label>}
function Input({l,v,c,type='text',req=false}:{l:string;v:string;c:(v:string)=>void;type?:string;req?:boolean}){return <div><Label>{l}</Label><input required={req} type={type} className="input-x" value={v} onChange={e=>c(e.target.value)}/></div>}
