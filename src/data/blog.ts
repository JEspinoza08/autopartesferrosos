import type { BlogPost } from "@/types";
import blog1 from "@/assets/posts/frenos.webp";
import blog2 from "@/assets/posts/desgastesuspension.webp";
import blog4 from "@/assets/posts/bolsa_de_aire.webp";
import blog3 from "@/assets/posts/mantenimiento.webp";

const c = (t: string) =>
  `<p>${t}</p><p>El mantenimiento preventivo y la elección de componentes originales o de marcas reconocidas es clave para garantizar la vida útil y seguridad de las unidades de transporte pesado.</p><h2>Puntos clave</h2><ul><li>Inspección periódica de componentes críticos.</li><li>Uso de repuestos certificados y compatibles con el fabricante.</li><li>Registro y trazabilidad de cambios y mantenimientos.</li></ul><p>En Autopartes Ferrosos ofrecemos asesoría técnica y stock especializado para atender las necesidades de flotas, talleres y transportistas.</p>`;

export const posts: BlogPost[] = [
  {
    slug: "como-elegir-repuestos-sistema-de-frenos",
    title: "Cómo elegir repuestos para un sistema de frenos",
    excerpt:
      "Criterios técnicos para escoger zapatas, tambores, discos y pastillas adecuados para tu unidad.",
    content: c(
      "Elegir correctamente los repuestos del sistema de frenos impacta directamente en la seguridad, el frenado efectivo y la vida útil de los componentes.",
    ),
    image: blog1,
    author: "Equipo técnico Ferrosos",
    date: "2025-04-12",
    readingTime: "5 min",
    category: "Frenos",
    tags: ["frenos", "mantenimiento"],
  },
  {
    slug: "senales-de-desgaste-en-la-suspension",
    title: "Señales de desgaste en la suspensión",
    excerpt:
      "Reconoce a tiempo los síntomas de una suspensión desgastada en camiones y semirremolques.",
    content: c(
      "Vibraciones anormales, desgaste irregular de neumáticos y una carrocería inestable son indicios claros de que la suspensión requiere atención.",
    ),
    image: blog2,
    author: "Equipo técnico Ferrosos",
    date: "2025-05-02",
    readingTime: "6 min",
    category: "Suspensión",
    tags: ["suspensión", "mantenimiento"],
  },
  {
    slug: "cuando-cambiar-una-bolsa-de-aire",
    title: "¿Cuándo cambiar una bolsa de aire?",
    excerpt:
      "Vida útil, fugas y señales visibles que indican reemplazo en la suspensión neumática.",
    content: c(
      "La bolsa de aire es un componente crítico de la suspensión neumática. Su reemplazo oportuno evita fallas mayores y reduce costos operativos.",
    ),
    image: blog3,
    author: "Equipo técnico Ferrosos",
    date: "2025-05-20",
    readingTime: "4 min",
    category: "Suspensión",
    tags: ["bolsa de aire", "neumática"],
  },
  {
    slug: "mantenimiento-preventivo-para-semirremolques",
    title: "Mantenimiento preventivo para semirremolques",
    excerpt: "Checklist recomendado por kilometraje y tiempo para evitar paradas imprevistas.",
    content: c(
      "Un programa de mantenimiento preventivo bien estructurado reduce costos, aumenta la disponibilidad de la unidad y mejora la seguridad vial.",
    ),
    image: blog4,
    author: "Equipo técnico Ferrosos",
    date: "2025-06-10",
    readingTime: "7 min",
    category: "Mantenimiento",
    tags: ["preventivo", "semirremolque"],
  },
  {
    slug: "suspension-mecanica-vs-neumatica",
    title: "Diferencias entre suspensión mecánica y neumática",
    excerpt: "Ventajas y desventajas de cada sistema para operaciones de transporte pesado.",
    content: c(
      "La elección entre suspensión mecánica y neumática depende del tipo de carga, ruta y presupuesto operativo de la flota.",
    ),
    image: blog2,
    author: "Equipo técnico Ferrosos",
    date: "2025-06-25",
    readingTime: "5 min",
    category: "Suspensión",
    tags: ["comparativa"],
  },
  {
    slug: "seguridad-en-camiones-de-carga",
    title: "Seguridad en camiones de carga: buenas prácticas",
    excerpt: "Recomendaciones para mantener la operación segura y minimizar riesgos.",
    content: c(
      "La seguridad en operaciones de carga pesada combina buenos hábitos de conducción, mantenimiento riguroso y componentes de calidad.",
    ),
    image: blog4,
    author: "Equipo técnico Ferrosos",
    date: "2025-07-05",
    readingTime: "6 min",
    category: "Seguridad",
    tags: ["seguridad", "operación"],
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((p) => p.slug === slug);
}
