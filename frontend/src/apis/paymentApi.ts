import baseApi from "@/apis/baseApi";
import { Order } from "./orderApi";

export interface IPayment {
  paymentId?: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  orderStatus: string;
  order?: Order
  orderTotalAmount: number;
  customerName: string;
  paymentDate?: string;
}

const PREFIX = "/Payment";

const normalize = (p: Partial<IPayment>) => ({
  ...p,
  paymentDate: p.paymentDate ? new Date(p.paymentDate).toISOString() : undefined,
});

export async function list(): Promise<IPayment[]> {
  try {
    const { data } = await baseApi.get<IPayment[]>(PREFIX);
    return data;
  } catch (error: any) {
    console.error('Error getting payments:', error)
    throw error
  }
}


export interface CreatePaymentDto {
  orderId: number;
  amount: number;
  paymentMethod: string;
  paymentDate?: string;
  orderStatus?: string;
  orderTotalAmount?: number;
  customerName?: string;
}

export async function create(payload: CreatePaymentDto): Promise<IPayment> {
  try {
    const { data } = await baseApi.post<IPayment>(PREFIX, payload);
    return data;
  } catch (error: any) {
    console.error('Error creating payment:', error)
    throw error
  }
}

export async function update(id: number, payload: Partial<Omit<IPayment, "paymentId">>): Promise<IPayment> {
  const { data } = await baseApi.put<IPayment>(`${PREFIX}/${id}`, normalize(payload));
  return data;
}

export async function remove(id: number): Promise<void> {
  await baseApi.delete(`${PREFIX}/${id}`);
}

export default { list, create, update, remove };
