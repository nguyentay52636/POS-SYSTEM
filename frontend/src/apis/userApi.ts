import baseApi from "./baseApi";
import { IUser, role } from "@/types/types";

export interface User {
  userId: number;
  username: string;
  fullName?: string;
  employeeId?: number;
  employeeName?: string;
  roleId?: number;
  role?: string | number;
  roleName?: string;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}


export interface CreateUserRequest {
  username: string;
  password: string;
  fullName: string;
  employeeId: number;
  roleId: number;

}




export interface UpdateUserRequest {
  password: string,
}
const USER_URL = '/User';

export const changeStatusUser = async (id: number, status: string) => {
  try {
    const { data } = await baseApi.put(`${USER_URL}/${id}/status`, { status })
    return data;
  } catch (error: any) {
    throw error;
  }
}
export const getAllUserStatus = async (status: string) => {
  try {
    const { data } = await baseApi.get(`${USER_URL}?status=${status}`)
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.items)) return data.items;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  } catch (error: any) {
    throw error;
  }
}
export const getAllUser = async () => {
  try {
    const { data } = await baseApi.get(`${USER_URL}/all`)
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data.items)) return data.items;
    if (data && Array.isArray(data.content)) return data.content;
    return [];
  } catch (error: any) {
    throw error;
  }
}
export const getUserById = async (id: number) => {
  try {
    const { data } = await baseApi.get(`${USER_URL}/${id}`)
    return data;
  } catch (error: any) {
    throw error;
  }
}
export const createUser = async (user: CreateUserRequest) => {
  try {
    const { data } = await baseApi.post(`${USER_URL}`, user)
    return data;
  } catch (error: any) {
    throw error;
  }
}
export const updateUser = async (id: number, user: UpdateUserRequest) => {
  try {
    const { data } = await baseApi.put(`${USER_URL}/${id}`, user)
    return data;
  } catch (error: any) {
    throw error;
  }
}


