import baseApi from "@/apis/baseApi";

// DTO dùng xuyên suốt FE (trùng Swagger của bạn)
export interface IPayment {
  paymentId?: number;           // id có thể thiếu khi tạo
  orderId: number;
  amount: number;
  paymentMethod: string;
  paymentDate: string;          // ISO string
}

const PREFIX = "/Payment";

// Chuẩn hoá ngày về ISO trước khi gửi
const normalize = (p: Partial<IPayment>) => ({
  ...p,
  paymentDate: p.paymentDate ? new Date(p.paymentDate).toISOString() : undefined,
});

export async function list(): Promise<IPayment[]> {
  const { data } = await baseApi.get<IPayment[]>(PREFIX);
  // Backend đã camelCase -> trả thẳng
  return Array.isArray(data) ? data : [];
}

export async function create(payload: Omit<IPayment, "paymentId">): Promise<IPayment> {
  const { data } = await baseApi.post<IPayment>(PREFIX, normalize(payload));
  return data;
}

export async function update(id: number, payload: Partial<Omit<IPayment, "paymentId">>): Promise<IPayment> {
  const { data } = await baseApi.put<IPayment>(`${PREFIX}/${id}`, normalize(payload));
  return data;
}

export async function remove(id: number): Promise<void> {
  await baseApi.delete(`${PREFIX}/${id}`);
}

export default { list, create, update, remove };
