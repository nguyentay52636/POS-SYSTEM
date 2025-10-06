import { IProduct, ICategory, ISupplier } from "@/types/types"

// Mock Categories
export const mockCategories: ICategory[] = [
  {
    category_id: 1,
    category_name: "Trái cây",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    category_id: 2,
    category_name: "Rau củ",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    category_id: 3,
    category_name: "Thịt",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    category_id: 4,
    category_name: "Hải sản",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    category_id: 5,
    category_name: "Đồ uống",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    category_id: 6,
    category_name: "Gia vị",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    category_id: 7,
    category_name: "Bánh kẹo",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    category_id: 8,
    category_name: "Sữa & trứng",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
]

// Mock Suppliers
export const mockSuppliers: ISupplier[] = [
  {
    supplier_id: 1,
    name: "Công ty TNHH Fresh Import",
    phone: "0901234567",
    email: "contact@freshimport.com",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    description: "Chuyên cung cấp trái cây và rau củ tươi",
    trangThai: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    supplier_id: 2,
    name: "Nhà cung cấp thịt tươi ABC",
    phone: "0912345678",
    email: "info@meatabc.com",
    address: "456 Đường XYZ, Quận 2, TP.HCM",
    description: "Chuyên cung cấp thịt tươi chất lượng cao",
    trangThai: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    supplier_id: 3,
    name: "Hải sản tươi sống DEF",
    phone: "0987654321",
    email: "seafood@def.com",
    address: "789 Đường DEF, Quận 3, TP.HCM",
    description: "Chuyên cung cấp hải sản tươi sống",
    trangThai: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    supplier_id: 4,
    name: "Công ty đồ uống GHI",
    phone: "0923456789",
    email: "beverages@ghi.com",
    address: "321 Đường GHI, Quận 4, TP.HCM",
    description: "Chuyên cung cấp đồ uống các loại",
    trangThai: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    supplier_id: 5,
    name: "Nhà cung cấp gia vị JKL",
    phone: "0934567890",
    email: "spices@jkl.com",
    address: "654 Đường JKL, Quận 5, TP.HCM",
    description: "Chuyên cung cấp gia vị và bánh kẹo",
    trangThai: "inactive",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
]

// Mock Products
export const mockProducts: IProduct[] = [
  {
    product_id: 1,
    category_id: mockCategories[0], // Trái cây
    supplier_id: mockSuppliers[0], // Fresh Import
    product_name: "Táo đỏ New Zealand",
    barcode: "1234567890123",
    price: 85000,
    image: "/images/products/apple-red.jpg",
    unit: 1,
    xuatXu: "New Zealand",
    status: "active",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-06-20T10:15:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 2,
    category_id: mockCategories[0], // Trái cây
    supplier_id: mockSuppliers[0], // Fresh Import
    product_name: "Chuối tiêu",
    barcode: "1234567890124",
    price: 25000,
    image: "/images/products/banana.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-06-21T11:30:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 3,
    category_id: mockCategories[1], // Rau củ
    supplier_id: mockSuppliers[0], // Fresh Import
    product_name: "Cà chua bi",
    barcode: "1234567890125",
    price: 35000,
    image: "/images/products/cherry-tomato.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-17T10:15:00Z",
    updatedAt: "2024-06-22T12:45:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 4,
    category_id: mockCategories[1], // Rau củ
    supplier_id: mockSuppliers[0], // Fresh Import
    product_name: "Rau xà lách",
    barcode: "1234567890126",
    price: 15000,
    image: "/images/products/lettuce.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-18T11:30:00Z",
    updatedAt: "2024-06-23T13:20:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 5,
    category_id: mockCategories[2], // Thịt
    supplier_id: mockSuppliers[1], // Thịt tươi ABC
    product_name: "Thịt bò thăn",
    barcode: "1234567890127",
    price: 450000,
    image: "/images/products/beef-tenderloin.jpg",
    unit: 1,
    xuatXu: "Úc",
    status: "active",
    createdAt: "2024-01-19T12:45:00Z",
    updatedAt: "2024-06-24T14:10:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 6,
    category_id: mockCategories[2], // Thịt
    supplier_id: mockSuppliers[1], // Thịt tươi ABC
    product_name: "Thịt heo ba chỉ",
    barcode: "1234567890128",
    price: 120000,
    image: "/images/products/pork-belly.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-20T13:00:00Z",
    updatedAt: "2024-06-25T15:30:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 7,
    category_id: mockCategories[3], // Hải sản
    supplier_id: mockSuppliers[2], // Hải sản DEF
    product_name: "Tôm sú tươi",
    barcode: "1234567890129",
    price: 180000,
    image: "/images/products/tiger-prawn.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-21T14:15:00Z",
    updatedAt: "2024-06-26T16:45:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 8,
    category_id: mockCategories[3], // Hải sản
    supplier_id: mockSuppliers[2], // Hải sản DEF
    product_name: "Cá hồi fillet",
    barcode: "1234567890130",
    price: 320000,
    image: "/images/products/salmon-fillet.jpg",
    unit: 1,
    xuatXu: "Na Uy",
    status: "active",
    createdAt: "2024-01-22T15:30:00Z",
    updatedAt: "2024-06-27T17:20:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 9,
    category_id: mockCategories[4], // Đồ uống
    supplier_id: mockSuppliers[3], // Đồ uống GHI
    product_name: "Nước suối Lavie",
    barcode: "1234567890131",
    price: 8000,
    image: "/images/products/lavie-water.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-23T16:45:00Z",
    updatedAt: "2024-06-28T18:10:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 10,
    category_id: mockCategories[4], // Đồ uống
    supplier_id: mockSuppliers[3], // Đồ uống GHI
    product_name: "Coca Cola 330ml",
    barcode: "1234567890132",
    price: 12000,
    image: "/images/products/coca-cola.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-24T17:00:00Z",
    updatedAt: "2024-06-29T19:30:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 11,
    category_id: mockCategories[5], // Gia vị
    supplier_id: mockSuppliers[4], // Gia vị JKL
    product_name: "Muối i-ốt",
    barcode: "1234567890133",
    price: 5000,
    image: "/images/products/iodized-salt.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-25T18:15:00Z",
    updatedAt: "2024-06-30T20:45:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 12,
    category_id: mockCategories[5], // Gia vị
    supplier_id: mockSuppliers[4], // Gia vị JKL
    product_name: "Đường trắng",
    barcode: "1234567890134",
    price: 15000,
    image: "/images/products/white-sugar.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-26T19:30:00Z",
    updatedAt: "2024-07-01T21:00:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 13,
    category_id: mockCategories[6], // Bánh kẹo
    supplier_id: mockSuppliers[4], // Gia vị JKL
    product_name: "Bánh quy Oreo",
    barcode: "1234567890135",
    price: 25000,
    image: "/images/products/oreo-cookies.jpg",
    unit: 1,
    xuatXu: "Mỹ",
    status: "active",
    createdAt: "2024-01-27T20:45:00Z",
    updatedAt: "2024-07-02T22:15:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 14,
    category_id: mockCategories[6], // Bánh kẹo
    supplier_id: mockSuppliers[4], // Gia vị JKL
    product_name: "Kẹo dẻo Haribo",
    barcode: "1234567890136",
    price: 18000,
    image: "/images/products/haribo-gummies.jpg",
    unit: 1,
    xuatXu: "Đức",
    status: "active",
    createdAt: "2024-01-28T21:00:00Z",
    updatedAt: "2024-07-03T23:30:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 15,
    category_id: mockCategories[7], // Sữa & trứng
    supplier_id: mockSuppliers[0], // Fresh Import
    product_name: "Sữa tươi Vinamilk",
    barcode: "1234567890137",
    price: 22000,
    image: "/images/products/vinamilk-milk.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-29T22:15:00Z",
    updatedAt: "2024-07-04T00:45:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 16,
    category_id: mockCategories[7], // Sữa & trứng
    supplier_id: mockSuppliers[0], // Fresh Import
    product_name: "Trứng gà tươi",
    barcode: "1234567890138",
    price: 35000,
    image: "/images/products/fresh-eggs.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-01-30T23:30:00Z",
    updatedAt: "2024-07-05T01:00:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 17,
    category_id: mockCategories[0], // Trái cây
    supplier_id: mockSuppliers[0], // Fresh Import
    product_name: "Cam Valencia",
    barcode: "1234567890139",
    price: 45000,
    image: "/images/products/valencia-orange.jpg",
    unit: 1,
    xuatXu: "Tây Ban Nha",
    status: "inactive",
    createdAt: "2024-01-31T00:45:00Z",
    updatedAt: "2024-07-06T02:15:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 18,
    category_id: mockCategories[2], // Thịt
    supplier_id: mockSuppliers[1], // Thịt tươi ABC
    product_name: "Thịt gà nguyên con",
    barcode: "1234567890140",
    price: 85000,
    image: "/images/products/whole-chicken.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "out-of-stock",
    createdAt: "2024-02-01T01:00:00Z",
    updatedAt: "2024-07-07T03:30:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 19,
    category_id: mockCategories[4], // Đồ uống
    supplier_id: mockSuppliers[3], // Đồ uống GHI
    product_name: "Nước cam tươi",
    barcode: "1234567890141",
    price: 18000,
    image: "/images/products/fresh-orange-juice.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-02-02T02:15:00Z",
    updatedAt: "2024-07-08T04:45:00Z",
    hsd: "2024-12-31"
  },
  {
    product_id: 20,
    category_id: mockCategories[1], // Rau củ
    supplier_id: mockSuppliers[0], // Fresh Import
    product_name: "Khoai tây",
    barcode: "1234567890142",
    price: 20000,
    image: "/images/products/potatoes.jpg",
    unit: 1,
    xuatXu: "Việt Nam",
    status: "active",
    createdAt: "2024-02-03T03:30:00Z",
    updatedAt: "2024-07-09T05:00:00Z",
    hsd: "2024-12-31"
  }
]

export default mockProducts
