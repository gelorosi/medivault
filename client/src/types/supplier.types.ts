import type { Product } from "./product.types";

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export type CreateSupplierDTO = Omit<
  Supplier,
  "id" | "products" | "createdAt" | "updatedAt"
>;
export type UpdateSupplierDTO = Partial<CreateSupplierDTO>;
