import baseApi from "./baseApi";

export interface IRole {
    roleId: number;
    roleName: string;
    description: string;
}
export const getAllRoles = async () => {
    try {
        const { data } = await baseApi.get('/Roles');
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const addRole = async (role: IRole) => {
    try {
        const { data } = await baseApi.post('/Roles', role);
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const getRoleById = async (roleId: number) => {
    try {
        const { data } = await baseApi.get(`/Roles/${roleId}`);
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const updateRole = async (roleId: number, role: IRole) => {
    try {
        const { data } = await baseApi.put(`/Roles/${roleId}`, role);
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const deleteRole = async (roleId: number) => {
    try {
        const { data } = await baseApi.delete(`/Roles/${roleId}`);
        return data;
    } catch (error: any) {
        throw error;
    }
}