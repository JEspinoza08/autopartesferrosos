import type { Product } from "@/types";

const img = (q: string) => `https://images.unsplash.com/${q}?w=800&q=70`;

const base = [
  { name: "Bolsa de aire para suspensión W01-358-9781", category: "suspension", subcategory: "Bolsas de aire", brand: "firestone", price: 685, originalPrice: 799, stock: 24, isOffer: true, featured: true, isNew: false, tags: ["neumática","semirremolque"], compat: ["Volvo FH","Scania R","Freightliner Cascadia"], apps: ["Semirremolque plataforma","Cisterna"], img: "photo-1486754735734-325b5831c3ad", desc: "Bolsa de aire de alta durabilidad para suspensión neumática de semirremolques y camiones. Fabricada con caucho reforzado y refuerzos internos." },
  { name: "Cámara de freno tipo 30/30", category: "sistema-de-aire", subcategory: "Cámaras de freno", brand: "haldex", price: 420, stock: 40, featured: true, isNew: false, isOffer: false, tags: ["freno","aire"], compat: ["Camiones 6x4","Semirremolques 3 ejes"], apps: ["Freno de servicio y estacionamiento"], img: "photo-1581092160607-ee22621dd758", desc: "Cámara de freno tipo 30/30 con freno de estacionamiento incorporado, diseñada para condiciones exigentes." },
  { name: "Válvula niveladora de altura", category: "sistema-de-aire", subcategory: "Válvulas", brand: "wabco", price: 315, originalPrice: 380, stock: 18, isOffer: true, featured: true, isNew: false, tags: ["válvula"], compat: ["Semirremolques suspensión neumática"], apps: ["Regulación de altura"], img: "photo-1620714223084-8fcacc6dfd8d", desc: "Válvula niveladora mecánica para mantener la altura constante del chasis en suspensiones neumáticas." },
  { name: "Tambor de freno 16.5 x 7", category: "frenos", subcategory: "Tambores", brand: "fras-le", price: 540, stock: 30, featured: false, isNew: false, isOffer: false, tags: ["freno","tambor"], compat: ["Ejes 12 toneladas","Semirremolques 3 ejes"], apps: ["Freno de servicio"], img: "photo-1632823469850-2f77dd9c5320", desc: "Tambor de freno mecanizado con acabado de precisión, alta resistencia térmica y larga vida útil." },
  { name: "Zapata de freno 4707 con forro", category: "frenos", subcategory: "Zapatas", brand: "fras-le", price: 210, stock: 60, featured: true, isNew: false, isOffer: false, tags: ["freno","zapata"], compat: ["Ejes americanos 16.5\""], apps: ["Freno de servicio"], img: "photo-1632823469850-2f77dd9c5320", desc: "Zapata de freno con forro remachado, ideal para reemplazo en semirremolques y camiones pesados." },
  { name: "Rodamiento cónico HM518445/10", category: "rodamientos", subcategory: "Rodamientos", brand: "skf", price: 165, stock: 80, featured: false, isNew: true, isOffer: false, tags: ["rodamiento"], compat: ["Cubos rueda semirremolque"], apps: ["Cubo de rueda"], img: "photo-1615834099403-bc7fed08b1e2", desc: "Rodamiento cónico de rodillos de alta capacidad de carga para cubos de rueda." },
  { name: "Quinta rueda JSK37CW", category: "quintas-ruedas", subcategory: "Quintas ruedas", brand: "jost", price: 5890, originalPrice: 6490, stock: 6, isOffer: true, featured: true, isNew: false, tags: ["quinta rueda"], compat: ["Tractocamiones 6x4"], apps: ["Acople tractor-semirremolque"], img: "photo-1519003722824-194d4455a60c", desc: "Quinta rueda de fundición esferoidal con mecanismo de bloqueo de doble seguridad." },
  { name: "King pin 3.5\" soldable", category: "enganches", subcategory: "King pins", brand: "jost", price: 480, stock: 22, featured: false, isNew: false, isOffer: false, tags: ["king pin"], compat: ["Semirremolques estándar"], apps: ["Punto de enganche"], img: "photo-1553341640-9b426ee7becb", desc: "King pin de 3.5\" pulgadas, fabricado en acero forjado tratado térmicamente." },
  { name: "Patín de apoyo 28 toneladas", category: "accesorios", subcategory: "Patines de apoyo", brand: "jost", price: 1450, stock: 12, featured: true, isNew: false, isOffer: false, tags: ["patín","landing gear"], compat: ["Semirremolques hasta 28 t"], apps: ["Apoyo estacionario"], img: "photo-1600661653561-629509216228", desc: "Patín de apoyo (landing gear) de dos velocidades para semirremolques de servicio pesado." },
  { name: "Eje BPW 12 toneladas 1820mm", category: "ejes", subcategory: "Ejes completos", brand: "bpw", price: 8990, originalPrice: 9750, stock: 4, isOffer: true, featured: true, isNew: false, tags: ["eje"], compat: ["Semirremolques 3 ejes"], apps: ["Semirremolque plataforma, tolva"], img: "photo-1580273916550-e323be2ae537", desc: "Eje completo BPW de 12 toneladas con vía de 1820mm, incluye tambor y sistema de freno S." },
  { name: "Válvula relé de emergencia", category: "sistema-de-aire", subcategory: "Válvulas", brand: "knorr-bremse", price: 275, stock: 28, featured: false, isNew: false, isOffer: false, tags: ["válvula","relé"], compat: ["Semirremolques neumáticos"], apps: ["Sistema de emergencia"], img: "photo-1620714223084-8fcacc6dfd8d", desc: "Válvula relé de emergencia para el circuito neumático de semirremolques." },
  { name: "Conector eléctrico 7 pines 24V", category: "sistema-electrico", subcategory: "Conectores", brand: "sampa", price: 95, stock: 100, featured: false, isNew: true, isOffer: false, tags: ["conector"], compat: ["Camiones y remolques 24V"], apps: ["Interconexión eléctrica"], img: "photo-1620714223084-8fcacc6dfd8d", desc: "Conector eléctrico normalizado ISO 1185 de 7 pines para 24V." },
  { name: "Faro posterior LED combinado", category: "iluminacion", subcategory: "Faros", brand: "sampa", price: 145, originalPrice: 180, stock: 45, isOffer: true, featured: true, isNew: true, tags: ["led","faro"], compat: ["Semirremolques y camiones"], apps: ["Señalización posterior"], img: "photo-1519834089823-08fb5c012d05", desc: "Faro posterior LED con funciones de freno, giro, posición y retroceso." },
  { name: "Guardafango de polietileno", category: "accesorios", subcategory: "Guardafangos", brand: "sampa", price: 220, stock: 35, featured: false, isNew: false, isOffer: false, tags: ["guardafango"], compat: ["Semirremolques 3 ejes"], apps: ["Protección de rueda"], img: "photo-1600661653561-629509216228", desc: "Guardafango de polietileno de alta densidad con soportes reforzados." },
  { name: "Enganche pintle 40 toneladas", category: "enganches", subcategory: "Enganches", brand: "saf-holland", price: 1980, stock: 8, featured: false, isNew: false, isOffer: false, tags: ["enganche"], compat: ["Camiones remolcadores"], apps: ["Remolque de barra"], img: "photo-1553341640-9b426ee7becb", desc: "Enganche pintle de servicio pesado para 40 toneladas de tiro." },
  { name: "Amortiguador de suspensión neumática", category: "suspension", subcategory: "Amortiguadores", brand: "saf-holland", price: 380, stock: 26, featured: true, isNew: false, isOffer: false, tags: ["amortiguador"], compat: ["Semirremolques neumáticos"], apps: ["Suspensión neumática"], img: "photo-1486754735734-325b5831c3ad", desc: "Amortiguador reforzado para suspensión neumática de alta exigencia." },
  { name: "Kit de reparación quinta rueda", category: "quintas-ruedas", subcategory: "Kits de reparación", brand: "jost", price: 890, originalPrice: 990, stock: 14, isOffer: true, featured: false, isNew: false, tags: ["kit","quinta rueda"], compat: ["Quintas JOST JSK37"], apps: ["Mantenimiento preventivo"], img: "photo-1519003722824-194d4455a60c", desc: "Kit completo de reparación con mordazas, resortes, pernos y accesorios." },
  { name: "Disco de freno ventilado 430mm", category: "frenos", subcategory: "Discos", brand: "meritor", price: 1290, stock: 10, featured: false, isNew: false, isOffer: false, tags: ["disco","freno"], compat: ["Ejes de disco 22.5\""], apps: ["Freno de disco"], img: "photo-1632823469850-2f77dd9c5320", desc: "Disco de freno ventilado de 430mm, alto poder de disipación térmica." },
  { name: "Cruceta transmisión 1810", category: "componentes-de-remolques", subcategory: "Mecánicos", brand: "meritor", price: 320, stock: 20, featured: false, isNew: false, isOffer: false, tags: ["cruceta"], compat: ["Cardanes serie 1810"], apps: ["Transmisión"], img: "photo-1615834099403-bc7fed08b1e2", desc: "Cruceta de alta durabilidad con vasos sellados y engrase permanente." },
  { name: "Retén de rueda 60x90x10", category: "rodamientos", subcategory: "Retenes", brand: "skf", price: 65, stock: 120, featured: false, isNew: false, isOffer: false, tags: ["retén"], compat: ["Cubos de rueda estándar"], apps: ["Sellado del cubo"], img: "photo-1615834099403-bc7fed08b1e2", desc: "Retén de labio doble con resorte, alta hermeticidad." },
  { name: "Manguera de aire espiral 4.5m", category: "sistema-de-aire", subcategory: "Mangueras", brand: "wabco", price: 135, stock: 55, featured: false, isNew: true, isOffer: false, tags: ["manguera"], compat: ["Camiones y remolques"], apps: ["Conexión neumática"], img: "photo-1581092160607-ee22621dd758", desc: "Manguera de aire espiralada de 4.5 metros con acoples metálicos." },
  { name: "Tanque de aire 30 litros", category: "sistema-de-aire", subcategory: "Tanques", brand: "wabco", price: 290, stock: 22, featured: false, isNew: false, isOffer: false, tags: ["tanque","aire"], compat: ["Sistemas neumáticos"], apps: ["Almacenamiento de aire"], img: "photo-1581092160607-ee22621dd758", desc: "Tanque de aire de acero de 30 litros con pintura anticorrosiva." },
  { name: "Sensor ABS con cable 2m", category: "sistema-electrico", subcategory: "Sensores", brand: "wabco", price: 175, originalPrice: 210, stock: 32, isOffer: true, featured: true, isNew: false, tags: ["abs","sensor"], compat: ["Ejes con ABS"], apps: ["Sistema ABS"], img: "photo-1620714223084-8fcacc6dfd8d", desc: "Sensor ABS activo con cable de 2 metros y conector estanco." },
  { name: "Pastillas de freno para eje 22.5\"", category: "frenos", subcategory: "Pastillas", brand: "fras-le", price: 460, stock: 28, featured: false, isNew: false, isOffer: false, tags: ["pastillas","freno"], compat: ["Ejes de disco 22.5\""], apps: ["Freno de disco"], img: "photo-1632823469850-2f77dd9c5320", desc: "Juego de pastillas de freno de alto rendimiento sin asbesto." },
];

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const products: Product[] = base.map((b, i) => {
  const id = i + 1;
  const sku = `AF-${String(id).padStart(4, "0")}`;
  return {
    id,
    slug: slugify(b.name),
    name: b.name,
    shortDescription: b.desc.slice(0, 120),
    description: b.desc,
    sku,
    internalCode: `INT-${1000 + id}`,
    category: b.category,
    subcategory: b.subcategory,
    brand: b.brand,
    price: b.price,
    originalPrice: b.originalPrice,
    stock: b.stock,
    featured: b.featured,
    isNew: b.isNew,
    isOffer: b.isOffer,
    images: [img(b.img), img(b.img)],
    specifications: [
      { label: "Marca", value: b.brand.toUpperCase() },
      { label: "SKU", value: sku },
      { label: "Categoría", value: b.subcategory },
      { label: "Garantía", value: "6 meses" },
      { label: "Origen", value: "Importado" },
    ],
    compatibility: b.compat,
    applications: b.apps,
    tags: b.tags,
    technicalSheet: "#",
  };
});

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}
export function getProductById(id: number) {
  return products.find((p) => p.id === id);
}
