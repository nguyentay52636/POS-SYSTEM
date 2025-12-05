import { IProduct } from "@/types/types";
import baseApi from "./baseApi";

export interface OrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  product : IProduct;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: number;
  customerId: number;
  customerName: string;
  userId: number;
  userName: string;
  promoId: number;
  promoCode: string;
  orderDate: string;
  status: string;
  discountAmount: number;
  totalAmount: number;
  orderItems: OrderItem[];
}


export const getOrders = async (): Promise<Order[]> => {
try {
  const { data } = await baseApi.get("/Order");
  return data;
} catch (error) {
  console.error('Error fetching orders:', error)
  throw error
}
};

export const getOrderById = async (id: number): Promise<Order> => {
try {
  const { data } = await baseApi.get(`/Order/${id}`);
  return data;
} catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
};

export interface CreateOrderDto {
  customerId: number;
  userId: number;
  promoId: number;
  orderDate: string;
  status: string;
  discountAmount: number;
  orderItems: IProduct[]
}

export const createOrder = async (order: CreateOrderDto): Promise<Order> => {
 try{
  const { data } = await baseApi.post("/Order", order);
  return data;
 }catch (error) {
  console.error('Error creating order:', error)
  throw error
 }
};


const uiToApiStatus = (s: string) => {
  const k = (s || "").toLowerCase();
  if (k === "dahuy") return "canceled";
  if (k === "daduyet") return "paid";
  if (k === "choduyet") return "pending";
  return s; 
};

export interface UpdateOrderDto {
  customerId: number;
  userId: number;
  promoId: number;
  orderDate: string;
  status: string; // "pending" | "paid" | "canceled"
  discountAmount: number;
  orderItems: IProduct[]
};

// ✅ Tìm kiếm đơn hàng (có query params)
export const searchOrders = async (params: Record<string, any>): Promise<Order[]> => {
  const res = await baseApi.get("/Order/search", { params });
  return res.data;
};

// ✅ Lấy danh sách sản phẩm của 1 đơn hàng
export const getOrderItems = async (id: number): Promise<OrderItem[]> => {
  const res = await baseApi.get(`/Order/${id}/items`);
  return res.data;
};

// ✅ Lấy danh sách thanh toán của 1 đơn hàng
export const getOrderPayments = async (id: number): Promise<any[]> => {
  const res = await baseApi.get(`/Order/${id}/payments`);
  return res.data;
};
