// frontend/src/apis/customerApi.ts
import baseApi from "./baseApi";

/** Model dùng trong UI */
export type Customer = {
  customerId: number;   // map từ customer_id
  name: string;
  phone: string;
  email: string;
  address: string;
};

/** Payload gửi lên khi tạo/sửa */
export type CustomerInput = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

/** Map mọi kiểu key có thể (snake/camel) => Customer chuẩn cho UI */
function mapCustomer(raw: any): Customer {
  const id =
    raw?.customer_id ??
    raw?.customerId ??
    raw?.customerid ??
    raw?.id;

  return {
    customerId: Number(id ?? 0),
    name: String(raw?.name ?? ""),
    phone: String(raw?.phone ?? ""),
    email: String(raw?.email ?? ""),
    address: String(raw?.address ?? ""),
  };
}

/** Lấy danh sách */
export async function getCustomers() {
  const res = await baseApi.get("/Customer");
  const data = Array.isArray(res.data) ? res.data.map(mapCustomer) : [];
  return { data };
}

/** Lấy 1 khách hàng (nếu cần) */
export async function getCustomer(id: number) {
  const res = await baseApi.get(`/Customer/${id}`);
  return mapCustomer(res.data);
}

/** Tạo mới */
export async function createCustomer(payload: CustomerInput) {
  // Backend nhận name/phone/email/address → POST /Customer
  return baseApi.post("/Customer", payload);
}

/** Cập nhật */
export async function updateCustomer(id: number, payload: CustomerInput) {
  // PUT /Customer/{id}
  return baseApi.put(`/Customer/${id}`, payload);
}

/** Xoá */
export async function deleteCustomer(id: number) {
  // DELETE /Customer/{id}
  return baseApi.delete(`/Customer/${id}`);
}
