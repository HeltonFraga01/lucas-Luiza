export type GiftCategory =
  | "Cozinha"
  | "Quarto e Banho"
  | "Aventuras"
  | "Casa"
  | "Fundo de Experiência"
  | "Outros";

export type PaymentMethod = "pix" | "paypal" | "manual";

export interface GiftFilters {
  category?: GiftCategory | "Todos";
  maxPrice?: number;
  minPrice?: number;
  showPurchased?: boolean;
  onlyMostWanted?: boolean;
}
