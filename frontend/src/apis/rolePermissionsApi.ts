import baseApi from "./baseApi";

export interface IPermissionsRoles {
    rolePermissionsId: number;
    roleId: number;
    featureId: number;
    featureName: string;
    permissionName: string;
    permissionCode: string;
    isAllowed: boolean;
}
export interface IPermissionsRolesCreate {
    roleId?: number;
    featureId: number;
    isAllowed: boolean;
}
export const getPermissionsRoles = async (roleId: number) => {
    try {
        const { data } = await baseApi.get(`/Roles/${roleId}/permissions`);
        return data;
    } catch (error: any) {
        throw error;
    }
}
export const addPermissionRole = async (roleId: number, permissionRole: IPermissionsRolesCreate) => {
    try {
        const { data } = await baseApi.post(`/Roles/${roleId}/permissions`, permissionRole);
        return data;
    } catch (error: any) {
        throw error;
    }
}
