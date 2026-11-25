export interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface SaleInput {
  customerName: string;
  customerPhone: string;
  products: readonly ProductItem[];
}

export interface MessageSettings {
  greeting: string;
  farewell: string;
}

export interface ProductError {
  name?: string;
  quantity?: string;
  unitPrice?: string;
}

export interface SaleValidationErrors {
  customerName?: string;
  customerPhone?: string;
  products?: string;
  productItems: Record<string, ProductError>;
}
