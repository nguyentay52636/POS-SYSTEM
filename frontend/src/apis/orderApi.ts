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

  export interface CreateOrderRequest {
    customerId: number;
    userId: number;
    promoId: number;
    promoCode: string;
    orderItems: IProduct[];
    status: string;
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

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderDto {
  customerId: number;
  userId: number;
  promoId: number | null;
  promoCode: string | null;
  orderItems: CreateOrderItemDto[];
  status: string;
}

export const createOrder = async (order: CreateOrderDto): Promise<Order> => {
 try{
  console.log('Sending order to API:', JSON.stringify(order, null, 2))
  const { data } = await baseApi.post("/Order", order);
  console.log('Order created successfully:', data)
  return data;
 }catch (error: any) {
  console.error('Error creating order:', error)
  console.error('Error response:', error?.response?.data)
  console.error('Request payload:', order)
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
  orderItems: Array<{
    orderItemId: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
  }>;
};


// PUT full body – dùng cho đổi trạng thái hoặc sửa items
export const updateOrder = async (
  id: number,
  patch: Partial<Order>
): Promise<Order> => {
  // 1) Lấy bản hiện tại
  const cur = await getOrderById(id);

  // 2) Map sang DTO BE chấp nhận (chỉ các field cần thiết)
  const items = (patch.orderItems ?? cur.orderItems ?? []).map((it) => ({
    orderItemId: it.orderItemId,
    orderId: id,
    productId: it.productId,
    quantity: it.quantity,
    price: it.price,
  }));

  const dto: UpdateOrderDto = {
    customerId: patch.customerId ?? cur.customerId,
    userId: patch.userId ?? cur.userId,
    promoId: patch.promoId ?? cur.promoId,
    orderDate: patch.orderDate ?? cur.orderDate,
    status: uiToApiStatus(patch.status ?? cur.status),
    discountAmount: patch.discountAmount ?? cur.discountAmount ?? 0,
    orderItems: items,
  };

  // 3) PUT đúng endpoint như Swagger
  const res = await baseApi.put(`/Order/${id}`, dto, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Đổi trạng thái (helper): dùng PUT full, KHÔNG gọi /cancel nữa
export const updateOrderStatus = async (id: number, uiStatus: string) => {
  return updateOrder(id, { status: uiStatus });
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
