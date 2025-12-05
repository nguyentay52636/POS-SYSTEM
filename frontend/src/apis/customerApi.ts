// frontend/src/apis/customerApi.ts
import { ICustomer } from "@/types/types";
import baseApi from "./baseApi";

// Type definitions
export type Customer = ICustomer;

export interface CustomerInput {
    name: string;
    phone: string;
    email: string;
    address: string;
    customerPoint: number;
}



export async function getCustomers() {
   try {
const {data} = await baseApi.get('/Customer')
return data
   }catch(error :any) {
    console.error('Error getting customers:', error)
    throw error
   }
}

export async function getCustomerById (id: number) {
 try {
  const {data} = await baseApi.get(`/Customer/${id}`)
  return data
 }catch(error :any) {
  console.error('Error getting customer:', error)
  throw error
 }
}

/** Tạo mới */
export async function createCustomer(customer: CustomerInput) {
try {
  const {data} = await baseApi.post('/Customer', customer)
  return data
}catch(error :any) {
    console.error('Error creating customer:', error)
    throw error
 }
}

/** Cập nhật */
export async function updateCustomer(id: number, customer: CustomerInput) {
try {
  const {data} = await baseApi.put(`/Customer/${id}`, customer)
  return data
 }catch(error :any) {
  console.error('Error updating customer:', error)
  throw error
 }
}

/** Xoá */
export async function deleteCustomer(id: number) {
try {
  const {data} = await baseApi.delete(`/Customer/${id}`)
  return data
 }catch(error :any) {
  console.error('Error deleting customer:', error)
  throw error
 }
}
export interface AddPointsToCustomerRequest {
  points: number;
}
export async function addPointsToCustomer(customerId: number, request: AddPointsToCustomerRequest) {
    try {
        console.log(`[API] Adding points to customer ${customerId}:`, request)
        const { data } = await baseApi.post(`/Customer/${customerId}/points`, request)
        console.log(`[API] Response from add points:`, data)
        return data
    } catch (error: any) {
        console.error('[API] Error adding points to customer:', error)
        console.error('[API] Error response:', error?.response?.data)
        throw error
    }
}