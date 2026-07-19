import type { Branch } from "@/types";

export const branches: Branch[] = [
  {
    id: 1,
    city: "Lima",
    name: "Sede Central Lima",
    address: "Av. Argentina 3200 (referencial), Cercado de Lima",
    phone: "(01) 000-0000",
    email: "lima@ferrosos.pe",
    hours: "Lun-Vie 8:00-18:00 · Sáb 8:00-13:00",

    mapEmbedUrl:
      "https://www.google.com/maps?q=Av.%20Argentina%203200%2C%20Lima&output=embed",

    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Av.%20Argentina%203200%2C%20Lima",
  },

  {
    id: 2,
    city: "Callao",
    name: "Sucursal Callao",
    address: "Av. Néstor Gambetta km 8 (referencial), Callao",
    phone: "(01) 000-0001",
    email: "callao@ferrosos.pe",
    hours: "Lun-Vie 8:00-18:00",

    mapEmbedUrl:
      "https://www.google.com/maps?q=Av.%20Néstor%20Gambetta%20km%208%2C%20Callao&output=embed",

    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Av.%20Néstor%20Gambetta%20km%208%2C%20Callao",
  },

  {
    id: 3,
    city: "Arequipa",
    name: "Sucursal Arequipa",
    address: "Av. Aviación 500 (referencial), Cerro Colorado",
    phone: "(054) 000-000",
    email: "arequipa@ferrosos.pe",
    hours: "Lun-Vie 8:00-17:30 · Sáb 9:00-13:00",

    mapEmbedUrl:
      "https://www.google.com/maps?q=Av.%20Aviaci%C3%B3n%20500%20Arequipa&output=embed",

    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Av.%20Aviaci%C3%B3n%20500%20Arequipa",
  },

  {
    id: 4,
    city: "Trujillo",
    name: "Sucursal Trujillo",
    address: "Av. América Norte 2400 (referencial), Trujillo",
    phone: "(044) 000-000",
    email: "trujillo@ferrosos.pe",
    hours: "Lun-Vie 8:00-18:00",

    mapEmbedUrl:
      "https://www.google.com/maps?q=Av.%20Am%C3%A9rica%20Norte%202400%20Trujillo&output=embed",

    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Av.%20Am%C3%A9rica%20Norte%202400%20Trujillo",
  },
];