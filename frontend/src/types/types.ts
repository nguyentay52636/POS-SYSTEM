export interface INhanVien {
    maNhanVien: string;
    tenNhanVien: string;
    gioiTinh: string;
    ngaySinh: string;
    anhDaiDien: string;
    soDienThoai: string;
    vaiTro: IVaiTro;
    trangThai: string;
}
export interface IVaiTro {
    maVaiTro: string,
    role: string,
    description: string
}
export interface SanPham  {
    maSanPham: string;
    tenSanPham: string;
    donVi: string;
    soLuongTon: number;
    maThuongHieu: string;
    maDanhMuc: string;
    maLoai: string;
    moTa: string;
    giaBan: number;
    // Optional nhập price for supplier/inventory contexts
    giaNhap?: number;
    hinhAnh: string;
    xuatXu: string;
    hsd: string; 
    trangThai: "active" | "inactive" | "out-of-stock";
    categoryName?: string;
    brandName?: string;
    typeName?: string;
    createdAt?: string;
    updatedAt?: string;
  };


  //create  type models

export interface IOrderItems { 
order_item_id : number
order_id : number
product_id : number
quantity : number
price : number
subtotal : number
createdAt : string
updatedAt : string
  }
  export interface IOrder { 
    order_id : number
    customer_id : number
    user_id : number
    promo_id : number
    order_date : string
    total_amount : number
    status : string
    createdAt : string
    updatedAt : string
  }

// Extended Order interface for UI with related data
export interface Order {
    id: number;
    customer_id: number;
    user_id: number;
    promo_id: number;
    order_date: string;
    total_amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
    user?: {
        email: string;
        address: string;
        fullName: string;
    };
    customer?: {
        name: string;
        email: string;
        phone: string;
    };
}

export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
    product?: {
        name: string;
        image: string;
    };
}
  export interface IPayment { 
    payment_id : number
    order_id : number
    payment_method : string
    amount : number
    status : string
    createdAt : string
    updatedAt : string
  }
  export interface IIventory { 
    inventory_id : number
    product_id : number
    quantity : number
    createdAt : string
    updatedAt : string
  } 
  export interface IProduct {  
    product_id : number
    category_id : number
    supplier_id : number
    product_name : string
    barcode : string
    price: number
    unit : string
    createdAt : string
    updatedAt : string
  } 
  export interface ICustomer {
    customer_id : number
    name : string
    phone : string
    email : string
    address : string
    createdAt : string
    updatedAt : string

  }
  export interface ICategory {
    category_id : number
    category_name : string
    createdAt : string
    updatedAt : string
  
  }
  export interface IPromotion { 
    promo_id : number
    promo_code : string
    description : string
    discount_type : string
  } 
export interface IUser { 
    user_id : number
    username : string
    password : string
    full_name : string
    role : role 
    createdAt : string
    updatedAt : string
}  
export enum role {
    ADMIN = "admin",
    USER = "user"
    
}
export interface ISupplier {
supplier_id : number
name : string
phone : string
email : string
address : string
createdAt : string
updatedAt : string
}
