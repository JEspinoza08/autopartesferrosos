export const formatPEN = (n: number) =>
  "S/ " + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const WHATSAPP_NUMBER = "51999000000"; // placeholder editable
export const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
