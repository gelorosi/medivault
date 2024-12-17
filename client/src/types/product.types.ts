export enum Category {
  OTC = "OTC",
  PRESCRIPTION = "PRESCRIPTION",
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: Category;
  quantity: number;
  minStockLevel: number;
  price: number;
  expiryDate: string;
  description?: string;
  supplierId: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateProductDTO = Omit<Product, "id" | "createdAt" | "updatedAt">;
export type UpdateProductDTO = Partial<CreateProductDTO>;
