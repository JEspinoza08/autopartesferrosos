import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ScrollToTop from "@/components/common/ScrollToTop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Account } from "./routes/mi-cuenta";
import { BlogIndex } from "./routes/blog.index";
import { Book } from "./routes/libro-de-reclamaciones";
import { BrandDetail } from "./routes/marcas.$slug";
import { BrandsList } from "./routes/marcas.index";
import { CartPage } from "./routes/carrito";
import { CatDetail } from "./routes/categorias.$slug";
import { CatList } from "./routes/categorias.index";
import { Checkout } from "./routes/checkout";
import { Contacto } from "./routes/contacto";
import { Favs } from "./routes/favoritos";
import { HomePage } from "./routes/index";
import { LoginPage } from "./routes/login";
import { Nosotros } from "./routes/nosotros";
import { Ofertas } from "./routes/ofertas";
import { PostView } from "./routes/blog.$slug";
import { ProductDetail } from "./routes/productos.$slug";
import { CatalogPage } from "./routes/productos.index";
import { RegisterPage } from "./routes/registro";
import { Success } from "./routes/pago-exitoso";
import { Sucursales } from "./routes/sucursales";
import { MisPedidosPage } from "./routes/mis-pedidos";
import { PendingPage } from "./routes/pago-pendiente";
import { ShippingPolicyPage } from "./routes/politica-de-envios";
import { PrivacyPage } from "./routes/politica-de-privacidad";
import { RecoverPage } from "./routes/recuperar-contrasena";
import { TermsPage } from "./routes/terminos-y-condiciones";
import { ReturnsPage } from "./routes/cambios-y-devoluciones";
import { AdminPage } from "./routes/admin";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import { QuoteProvider } from "@/context/QuoteContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

const queryClient = new QueryClient();
function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl font-black text-primary">404</h1>
        <h2 className="mt-4 text-xl font-bold">Página no encontrada</h2>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
export default function App() {
  return (
    <BrowserRouter>
    <ScrollToTop />
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <ProductsProvider>
              <FavoritesProvider>
                <QuoteProvider>
                  <CartProvider>
                    <div className="flex min-h-screen flex-col">
                      <Header />
                      <main className="flex-1 pb-16 md:pb-0">
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/productos" element={<CatalogPage />} />
                          <Route path="/productos/:slug" element={<ProductDetail />} />
                          <Route path="/categorias" element={<CatList />} />
                          <Route path="/categorias/:slug" element={<CatDetail />} />
                          <Route path="/marcas" element={<BrandsList />} />
                          <Route path="/marcas/:slug" element={<BrandDetail />} />
                          <Route path="/blog" element={<BlogIndex />} />
                          <Route path="/blog/:slug" element={<PostView />} />
                          <Route path="/carrito" element={<CartPage />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/contacto" element={<Contacto />} />
                          <Route path="/favoritos" element={<Favs />} />
                          <Route path="/libro-de-reclamaciones" element={<Book />} />
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/mi-cuenta" element={<Account />} />
                          <Route path="/mis-pedidos" element={<MisPedidosPage />} />
                          <Route path="/nosotros" element={<Nosotros />} />
                          <Route path="/ofertas" element={<Ofertas />} />
                          <Route path="/pago-exitoso" element={<Success />} />
                          <Route path="/pago-pendiente" element={<PendingPage />} />
                          <Route path="/politica-de-envios" element={<ShippingPolicyPage />} />
                          <Route path="/politica-de-privacidad" element={<PrivacyPage />} />
                          <Route path="/recuperar-contrasena" element={<RecoverPage />} />
                          <Route path="/registro" element={<RegisterPage />} />
                          <Route path="/sucursales" element={<Sucursales />} />
                          <Route path="/terminos-y-condiciones" element={<TermsPage />} />
                          <Route path="/cambios-y-devoluciones" element={<ReturnsPage />} />
                          <Route path="/admin" element={<AdminPage />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                      <Footer />
                      <WhatsAppButton />
                      <MobileBottomNav />
                    </div>
                  </CartProvider>
                </QuoteProvider>
              </FavoritesProvider>
            </ProductsProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
