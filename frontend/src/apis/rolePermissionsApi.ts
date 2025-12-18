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

export interface IUpdateRolePermissionsRequest {
    permissions: IPermissionsRolesCreate[];
}

export type PermissionType = "view" | "create" | "edit" | "delete" | "print" | "export"

export interface FeaturePermission {
    featureId: number
    featureName: string
    permissions: {
        [key in PermissionType]: boolean
    }
}

// Interface mới cho API update
export interface IUpdateRolePermissionsDto {
    featurePermissions: {
        featureId: number;
        permissionTypeIds: number[];
    }[];
}

// Mapping PermissionType code sang PermissionTypeId
const permissionTypeToIdMap: Record<PermissionType, number> = {
    "view": 1,
    "create": 2,
    "edit": 3,
    "delete": 4,
    "print": 5,
    "export": 6,
};

export const permissionTypes = [
    { code: "view", name: "Xem", id: 1 },
    { code: "create", name: "Thêm", id: 2 },
    { code: "edit", name: "Sửa", id: 3 },
    { code: "delete", name: "Xóa", id: 4 },
    { code: "print", name: "In", id: 5 },
    { code: "export", name: "Xuất Excel", id: 6 },
] as const

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

/**
 * Cập nhật tất cả permissions của một role cùng lúc (batch update)
 * @param roleId - ID của role cần cập nhật
 * @param permissions - Mảng các permissions cần cập nhật
 * @returns Promise với dữ liệu response từ API
 */
export const updateRolePermissions = async (
    roleId: number,
    permissions: IPermissionsRolesCreate[]
): Promise<any> => {
    try {
        const requestData: IUpdateRolePermissionsRequest = {
            permissions: permissions.map(p => ({
                featureId: p.featureId,
                isAllowed: p.isAllowed,
            }))
        };

        console.log("📤 Updating role permissions:", {
            roleId,
            permissionsCount: permissions.length,
            requestData
        });

        const { data } = await baseApi.put(`/Roles/${roleId}/permissions`, requestData);
        console.log("✅ Role permissions updated successfully:", data);
        return data;
    } catch (error: any) {
        console.error("❌ Error updating role permissions:", error);
        console.error("Request data:", {
            roleId,
            permissionsCount: permissions.length
        });
        throw error;
    }
}

/**
 * Cập nhật permissions cho role với format mới (sử dụng FeaturePermission)
 * API: PUT /api/RolePermissions/role/{roleId}/update
 * @param roleId - ID của role cần cập nhật
 * @param featurePermissions - Mảng các feature permissions với format { featureId, permissions: { view, create, edit, ... } }
 * @returns Promise với danh sách permissions sau khi cập nhật
 */
export const updateRolePermissionsV2 = async (
    roleId: number,
    featurePermissions: FeaturePermission[]
): Promise<IPermissionsRoles[]> => {
    try {
        // Convert từ format frontend sang format backend
        const requestData: IUpdateRolePermissionsDto = {
            featurePermissions: featurePermissions.map(fp => {
                // Lấy danh sách permissionTypeIds từ permissions object
                const permissionTypeIds: number[] = [];

                (Object.keys(fp.permissions) as PermissionType[]).forEach(permissionType => {
                    if (fp.permissions[permissionType]) {
                        const permissionTypeId = permissionTypeToIdMap[permissionType];
                        if (permissionTypeId) {
                            permissionTypeIds.push(permissionTypeId);
                        }
                    }
                });

                return {
                    featureId: fp.featureId,
                    permissionTypeIds: permissionTypeIds
                };
            })
        };

        console.log("📤 Updating role permissions (V2):", {
            roleId,
            featureCount: featurePermissions.length,
            requestData
        });

        const { data } = await baseApi.put(`/RolePermissions/role/${roleId}/update`, requestData);

        console.log("✅ Role permissions updated successfully:", data);
        return data;
    } catch (error: any) {
        console.error("❌ Error updating role permissions:", error);
        console.error("Request data:", {
            roleId,
            featureCount: featurePermissions.length
        });
        throw error;
    }
}

/**
 * Helper function: Convert từ danh sách permissions hiện tại sang format FeaturePermission
 * @param permissions - Danh sách permissions từ API
 * @returns Mảng FeaturePermission được group theo featureId
 */
export const convertPermissionsToFeaturePermissions = (
    permissions: IPermissionsRoles[]
): FeaturePermission[] => {
    // Group permissions theo featureId
    const featureMap = new Map<number, FeaturePermission>();

    permissions.forEach(perm => {
        if (!featureMap.has(perm.featureId)) {
            featureMap.set(perm.featureId, {
                featureId: perm.featureId,
                featureName: perm.featureName,
                permissions: {
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                    print: false,
                    export: false,
                }
            });
        }

        const feature = featureMap.get(perm.featureId)!;

        // Map permissionCode sang PermissionType và set true nếu isAllowed
        const permissionType = perm.permissionCode.toLowerCase() as PermissionType;
        if (permissionType in feature.permissions && perm.isAllowed) {
            feature.permissions[permissionType] = true;
        }
    });

    return Array.from(featureMap.values());
}