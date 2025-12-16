import baseApi from "./baseApi";
import { IRole } from "./roleApi";
const EMPLOYEE_URL = '/Employee';
export interface IEmployee {
    employeeId?: number
    fullName?: string
    gender?: string
    birthDate?: string | Date
    phone?: string
    rolePosition?: string
    role?: IRole
    status?: string

}
export const changeStatusEmployee = async (id: number, status: string) => {
    try {
        const { data } = await baseApi.put(`${EMPLOYEE_URL}/${id}/status`, { status })
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const getAllEmployeeStatus = async (status: string) => {
    try {
        const { data } = await baseApi.get(`${EMPLOYEE_URL}?status=${status}`)
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.items)) return data.items;
        if (data && Array.isArray(data.content)) return data.content;
        return [];
    } catch (error: any) {
        throw error;
    }
}
export const getAllEmployee = async () => {
    try {
        const { data } = await baseApi.get(`${EMPLOYEE_URL}/all`)
        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.items)) return data.items;
        if (data && Array.isArray(data.content)) return data.content;
        return [];
    } catch (error: any) {
        throw error;
    }
}
export const getEmployeeById = async (id: number) => {
    try {
        const { data } = await baseApi.get(`${EMPLOYEE_URL}/${id}`)
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const createEmployee = async (employee: IEmployee) => {
    try {
        const { data } = await baseApi.post(`${EMPLOYEE_URL}`, employee)
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const updateEmployee = async (id: number, employee: IEmployee) => {
    try {
        const { data } = await baseApi.put(`${EMPLOYEE_URL}/${id}`, employee)
        return data;
    } catch (error: any) {
        throw error;
    }
}

