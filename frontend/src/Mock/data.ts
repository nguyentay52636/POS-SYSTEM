import { INhanVien, IUser, role, IOrder, IOrderItems, ICustomer, Order, OrderItem, IProduct, ICategory, ISupplier } from "@/types/types"

export const mockEmployees: INhanVien[] = [
  {
    maNhanVien: "NV001",
    tenNhanVien: "Nguyen Van A",
    gioiTinh: "Nam",
    ngaySinh: "1995-05-12",
    anhDaiDien: "https://example.com/images/nv001.jpg",
    soDienThoai: "0901234567",
    vaiTro: {
      maVaiTro: "VT01",
      role: "QuanLy",
      description: "Quản lý toàn bộ cửa hàng",
    },
    trangThai: "HoatDong",
  },
  {
    maNhanVien: "NV002",
    tenNhanVien: "Tran Thi B",
    gioiTinh: "Nu",
    ngaySinh: "1998-09-20",
    anhDaiDien: "https://example.com/images/nv002.jpg",
    soDienThoai: "0912345678",
    vaiTro: {
      maVaiTro: "VT02",
      role: "NhanVien",
      description: "Nhân viên bán hàng",
    },
    trangThai: "HoatDong",
  },
  {
    maNhanVien: "NV003",
    tenNhanVien: "Le Van C",
    gioiTinh: "Nam",
    ngaySinh: "2000-01-15",
    anhDaiDien: "https://example.com/images/nv003.jpg",
    soDienThoai: "0987654321",
    vaiTro: {
      maVaiTro: "VT03",
      role: "KeToan",
      description: "Kế toán, quản lý thu chi",
    },
    trangThai: "NgungHoatDong",
  },
]

export default mockEmployees

export const mockUsers: IUser[] = [
  {
    user_id: 1,
    username: "admin",
    password: "hashed_password_1",
    full_name: "Admin One",
    role: role.ADMIN,
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-06-15T12:00:00Z",
  },
  {
    user_id: 2,
    username: "john.doe",
    password: "hashed_password_2",
    full_name: "John Doe",
    role: role.USER,
    createdAt: "2024-02-05T09:15:00Z",
    updatedAt: "2024-06-20T10:45:00Z",
  },
  {
    user_id: 3,
    username: "jane.smith",
    password: "hashed_password_3",
    full_name: "Jane Smith",
    role: role.USER,
    createdAt: "2024-03-12T14:00:00Z",
    updatedAt: "2024-07-01T08:20:00Z",
  },
]

export const mockCustomers: ICustomer[] = [
  {
    customer_id: 1,
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "nguyen.van.an@email.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-06-20T14:15:00Z",
  },
  {
    customer_id: 2,
    name: "Trần Thị Bình",
    phone: "0912345678",
    email: "tran.thi.binh@email.com",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    createdAt: "2024-02-20T09:45:00Z",
    updatedAt: "2024-07-01T11:30:00Z",
  },
  {
    customer_id: 3,
    name: "Lê Văn Cường",
    phone: "0987654321",
    email: "le.van.cuong@email.com",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    createdAt: "2024-03-10T16:20:00Z",
    updatedAt: "2024-07-15T08:45:00Z",
  },
]

export const mockOrderItems: IOrderItems[] = [
  {
    order_item_id: 1,
    order_id: 1,
    product_id: 101,
    quantity: 2,
    price: 150000,
    subtotal: 300000,
    createdAt: "2024-06-15T10:30:00Z",
    updatedAt: "2024-06-15T10:30:00Z",
  },
  {
    order_item_id: 2,
    order_id: 1,
    product_id: 102,
    quantity: 1,
    price: 200000,
    subtotal: 200000,
    createdAt: "2024-06-15T10:30:00Z",
    updatedAt: "2024-06-15T10:30:00Z",
  },
  {
    order_item_id: 3,
    order_id: 2,
    product_id: 103,
    quantity: 3,
    price: 120000,
    subtotal: 360000,
    createdAt: "2024-06-20T14:15:00Z",
    updatedAt: "2024-06-20T14:15:00Z",
  },
  {
    order_item_id: 4,
    order_id: 3,
    product_id: 104,
    quantity: 1,
    price: 500000,
    subtotal: 500000,
    createdAt: "2024-07-01T11:30:00Z",
    updatedAt: "2024-07-01T11:30:00Z",
  },
]

export const mockOrders: IOrder[] = [
  {
    order_id: 1,
    customer_id: 1,
    user_id: 2,
    promo_id: 0,
    order_date: "2024-06-15T10:30:00Z",
    total_amount: 500000,
    status: "ChoDuyet",
    createdAt: "2024-06-15T10:30:00Z",
    updatedAt: "2024-06-15T10:30:00Z",
  },
  {
    order_id: 2,
    customer_id: 2,
    user_id: 2,
    promo_id: 0,
    order_date: "2024-06-20T14:15:00Z",
    total_amount: 360000,
    status: "DaDuyet",
    createdAt: "2024-06-20T14:15:00Z",
    updatedAt: "2024-06-20T14:15:00Z",
  },
  {
    order_id: 3,
    customer_id: 3,
    user_id: 3,
    promo_id: 0,
    order_date: "2024-07-01T11:30:00Z",
    total_amount: 500000,
    status: "DaHuy",
    createdAt: "2024-07-01T11:30:00Z",
    updatedAt: "2024-07-01T11:30:00Z",
  },
]

// Extended orders for UI with related data
export const mockOrdersExtended: Order[] = [
  {
    id: 1,
    customer_id: 1,
    user_id: 2,
    promo_id: 0,
    order_date: "2024-06-15T10:30:00Z",
    total_amount: 500000,
    status: "ChoDuyet",
    createdAt: "2024-06-15T10:30:00Z",
    updatedAt: "2024-06-15T10:30:00Z",
    orderItems: [
      {
        productId: 101,
        quantity: 2,
        price: 150000,
        product: {
          name: "Cà phê đen",
          image: "/images/coffee-black.jpg"
        }
      },
      {
        productId: 102,
        quantity: 1,
        price: 200000,
        product: {
          name: "Bánh mì thịt nướng",
          image: "/images/banh-mi.jpg"
        }
      }
    ],
    user: {
      email: "john.doe@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      fullName: "John Doe"
    },
    customer: {
      name: "Nguyễn Văn An",
      email: "nguyen.van.an@email.com",
      phone: "0901234567"
    }
  },
  {
    id: 2,
    customer_id: 2,
    user_id: 2,
    promo_id: 0,
    order_date: "2024-06-20T14:15:00Z",
    total_amount: 360000,
    status: "DaDuyet",
    createdAt: "2024-06-20T14:15:00Z",
    updatedAt: "2024-06-20T14:15:00Z",
    orderItems: [
      {
        productId: 103,
        quantity: 3,
        price: 120000,
        product: {
          name: "Trà sữa trân châu",
          image: "/images/milk-tea.jpg"
        }
      }
    ],
    user: {
      email: "john.doe@email.com",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      fullName: "John Doe"
    },
    customer: {
      name: "Trần Thị Bình",
      email: "tran.thi.binh@email.com",
      phone: "0912345678"
    }
  },
  {
    id: 3,
    customer_id: 3,
    user_id: 3,
    promo_id: 0,
    order_date: "2024-07-01T11:30:00Z",
    total_amount: 500000,
    status: "DaHuy",
    createdAt: "2024-07-01T11:30:00Z",
    updatedAt: "2024-07-01T11:30:00Z",
    orderItems: [
      {
        productId: 104,
        quantity: 1,
        price: 500000,
        product: {
          name: "Combo đặc biệt",
          image: "/images/combo.jpg"
        }
      }
    ],
    user: {
      email: "jane.smith@email.com",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      fullName: "Jane Smith"
    },
    customer: {
      name: "Lê Văn Cường",
      email: "le.van.cuong@email.com",
      phone: "0987654321"
    }
  }
]

// Import product mock data
export { mockProducts, mockCategories, mockSuppliers } from "@/components/Admin/components/Products/mock/data"