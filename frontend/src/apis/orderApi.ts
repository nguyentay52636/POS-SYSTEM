import baseApi from "./baseApi";

// =============================
// 🧩 INTERFACES
// =============================
export interface OrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  productName: string;
  barcode: string;
  quantity: number;
  price: number;
  subtotal: number;
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

// ✅ Tạo mới đơn hàng
export const createOrder = async (order: Order): Promise<Order> => {
 try{
  const { data } = await baseApi.post("/Order", order);
  return data;
 }catch (error) {
  console.error('Error creating order:', error)
  throw error
 }
};

// ✅ Cập nhật đơn hàng (PUT full body)
// export const updateOrder = async (id: number, patch: Partial<Order>): Promise<Order> => {
//   // 1. Lấy bản hiện tại từ API
//   const current = await getOrderById(id);

//   // 2. Merge dữ liệu mới với dữ liệu hiện tại
//   const merged: Order = {
//     ...current,
//     ...patch,
//     orderId: id,
//     orderItems: (patch.orderItems ?? current.orderItems ?? []).map((it) => ({
//       ...it,
//       orderId: id,
//       subtotal: it.quantity * it.price,
//     })),
//   };

//   // 3. Tính lại tổng tiền
//   const itemsTotal = merged.orderItems.reduce((s, i) => s + i.subtotal, 0);
//   merged.totalAmount = itemsTotal - (merged.discountAmount || 0);

//   // 4. Gửi PUT (endpoint đúng theo Swagger: /Order/{id})
//   const res = await baseApi.put(`/Order/${id}`, merged, {
//     headers: { "Content-Type": "application/json" },
//   });
//   return res.data;
// };
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
