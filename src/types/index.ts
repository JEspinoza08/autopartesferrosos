export interface Product {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  sku: string;
  internalCode: string;
  category: string;
  subcategory: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  featured: boolean;
  isNew: boolean;
  isOffer: boolean;
  images: string[];
  specifications: { label: string; value: string }[];
  compatibility: string[];
  applications: string[];
  tags: string[];
  technicalSheet?: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  image: string;
  subcategories: string[];
}

export interface Brand {
  slug: string;
  name: string;
  description: string;
  logo: string;
  country: string;
}

export interface Branch {
  id: number;
  city: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapHint?: string;
  mapEmbedUrl: string;
  mapUrl: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  items: {
    productId: number;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    docType: string;
    docNumber: string;
    razonSocial?: string;
  };
  address: {
    department: string;
    province: string;
    district: string;
    address: string;
    reference: string;
    deliveryType: "domicilio" | "sucursal";
  };
  invoiceType: "boleta" | "factura";
  paymentMethod: string;
}

export type OrderStatus =
  | "Pedido recibido"
  | "Pago confirmado"
  | "Preparando pedido"
  | "Enviado"
  | "Entregado"
  | "Cancelado";

export interface QuoteItem {
  productId: number;
  quantity: number;
  notes?: string;
}
