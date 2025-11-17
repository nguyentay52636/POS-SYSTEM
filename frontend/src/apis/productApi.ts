import { ICategory, ISupplier } from "@/types/types";

export interface IProduct {
    product_id: number;
    category_id: ICategory;
    supplier_id: ISupplier;
    product_name: string;
    barcode: string;
    price: number;
    image: string;
    unit: number;
    xuatXu: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    hsd: string;
  }