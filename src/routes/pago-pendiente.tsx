import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
export function PendingPage() { return <div className="container-x py-16 text-center"><Clock className="mx-auto h-14 w-14 text-yellow-600"/><h1 className="mt-4 text-3xl font-black">Tu pago está en revisión</h1><p className="mt-2 text-muted-foreground">Te notificaremos apenas se confirme.</p><Link to="/" className="btn-primary mt-6 inline-flex">Volver al inicio</Link></div>; }
