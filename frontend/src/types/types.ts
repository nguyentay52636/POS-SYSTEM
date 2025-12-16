export interface INhanVien {
  maNhanVien: string;
  tenNhanVien: string;
  gioiTinh: string;
  ngaySinh: string;
  anhDaiDien: string;
  soDienThoai: string;
  vaiTro: IRole;
  trangThai: string;
}
export interface IRole {
  maVaiTro: string;
  role: string;
  description: string;
}



export interface IPayment {
  payment_id: number;
  order_id: number;
  payment_method: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
export interface IInventory {
  inventoryId: number;
  productId: number;
  quantity: number;
  product?: IProduct;
  productName?: string;
  updatedAt: string;

}
export interface IProduct {
  productId?: number;
  productName: string;
  imageUrl: string;
  price: number;
  unit: number;
  categoryId?: number;
  category: ICategory
  supplierId?: number;
  supplier: ISupplier;
  barcode?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface ICustomer {
  customerId: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  customerPoint: number;
  createdAt: string;
  updatedAt: string;
}
export interface ICategory {
  categoryId?: number;
  categoryName?: string;
  createdAt: string;
  updatedAt: string;
}
export interface IPromotion {
  promo_id: number;
  promo_code: string;
  description: string;
  discount_type: string;
}
export interface IUser {
  userId: number; // Changed from user_id to match API
  username: string;
  password?: string;
  fullName: string; // Changed from full_name to match API
  employeeId?: number;
  employeeName?: string;
  roleId?: number;
  role: string | number; // API returns number 1
  roleName?: string; // API returns "admin"
  status: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  // Legacy support or alias if needed, but better to migrate
  // user_id?: number; 
  // full_name?: string;
}
export enum role {
  ADMIN = "admin",
  USER = "user",
  STAFF = "staff",
}
export interface ISupplier {
  supplierId?: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  description?: string;
  trangThai?: "active" | "inactive";
  createdAt?: string;
  updatedAt: string;
}
export interface IImportReceipt {
  importId: number;
  supplierId: number;
  supplierName?: string;
  userId: number;
  userName?: string;
  importDate: string;
  totalAmount: number;
  status: string;
  note?: string;
  supplier?: ISupplier;
  user?: IUser;
  importItems?: IImportItem[];
}
export interface IImportItem {
  importItemId: number;
  importId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product?: IProduct;
  import_item_id?: number;
  import_id?: number;
  product_id?: number;
  unit_price?: number;
}
