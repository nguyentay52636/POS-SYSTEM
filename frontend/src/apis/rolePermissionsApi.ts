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
export type PermissionType = "view" | "create" | "edit" | "delete" | "print" | "export"

export interface FeaturePermission {
  featureId: number
  featureName: string
  permissions: {
    [key in PermissionType]: boolean
  }
}
export const permissionTypes = [
    { code: "view", name: "Xem" },
    { code: "create", name: "Thêm" },
    { code: "edit", name: "Sửa" },
    { code: "delete", name: "Xóa" },
    { code: "print", name: "In" },
    { code: "export", name: "Xuất Excel" },
] as const

// export type PermissionType = typeof permissionTypes[number]["code"]

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
