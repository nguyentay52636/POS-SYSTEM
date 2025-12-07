import useSWR from "swr"
import { useMemo } from "react"
import { getAllRoles, type IRole } from "@/apis/roleApi"
import { getFeatures, type IFeaturePermission } from "@/apis/featuresApi"
import {
    getPermissionsRoles,
    addPermissionRole,
    updateRolePermissionsV2,
    convertPermissionsToFeaturePermissions,
    type IPermissionsRoles,
    type IPermissionsRolesCreate,
} from "@/apis/rolePermissionsApi"
import type { FeaturePermission, PermissionType } from "@/apis/rolePermissionsApi"

// Permission code mapping
const PERMISSION_CODES = {
    view: "VIEW",
    create: "CREATE",
    edit: "EDIT",
    delete: "DELETE",
    print: "PRINT",
    export: "EXPORT",
}

// Convert API permissions to UI format
export const convertToFeaturePermissions = (
    features: IFeaturePermission[],
    permissions: IPermissionsRoles[],
): FeaturePermission[] => {
    return features.map((feature) => {
        const featurePermissions = permissions.filter((p) => p.featureId === feature.featureId)

        const permissionMap: { [key in PermissionType]: boolean } = {
            view: false,
            create: false,
            edit: false,
            delete: false,
            print: false,
            export: false,
        }

        featurePermissions.forEach((p) => {
            const permissionKey = Object.keys(PERMISSION_CODES).find(
                (key) => PERMISSION_CODES[key as PermissionType] === p.permissionCode,
            ) as PermissionType

            if (permissionKey) {
                permissionMap[permissionKey] = p.isAllowed
            }
        })

        return {
            featureId: feature.featureId,
            featureName: feature.featureName,
            permissions: permissionMap,
        }
    })
}

// Stable empty arrays to prevent infinite loops
const EMPTY_ROLES: IRole[] = []
const EMPTY_FEATURES: IFeaturePermission[] = []
const EMPTY_PERMISSIONS: IPermissionsRoles[] = []

export const useRoles = () => {
    const { data, error, isLoading, mutate } = useSWR<IRole[]>("/roles", getAllRoles)

    return {
        roles: data || EMPTY_ROLES,
        isLoading,
        isError: error,
        mutate,
    }
}

export const useFeatures = () => {
    const { data, error, isLoading, mutate } = useSWR<IFeaturePermission[]>("/features", getFeatures)

    return {
        features: data || EMPTY_FEATURES,
        isLoading,
        isError: error,
        mutate,
    }
}

export const useRolePermissions = (roleId: number | null) => {
    const { data, error, isLoading, mutate } = useSWR<IPermissionsRoles[]>(
        roleId ? `/roles/${roleId}/permissions` : null,
        () => (roleId ? getPermissionsRoles(roleId) : Promise.resolve([])),
    )

    return {
        permissions: data || EMPTY_PERMISSIONS,
        isLoading,
        isError: error,
        mutate,
    }
}

export const usePermissionsData = (roleId: number | null) => {
    const { features, isLoading: featuresLoading } = useFeatures()
    const { permissions, isLoading: permissionsLoading, mutate } = useRolePermissions(roleId)

    const featurePermissions = useMemo(
        () => convertToFeaturePermissions(features, permissions),
        [features, permissions]
    )

    return {
        featurePermissions,
        isLoading: featuresLoading || permissionsLoading,
        mutate,
    }
}

/**
 * Lưu permissions cho role sử dụng API mới (updateRolePermissionsV2)
 * API: PUT /api/RolePermissions/role/{roleId}/update
 * @param roleId - ID của role cần cập nhật
 * @param featurePermissions - Mảng các feature permissions với format { featureId, permissions: { view, create, edit, ... } }
 * @returns Promise<void>
 */
export const savePermissions = async (roleId: number, featurePermissions: FeaturePermission[]): Promise<void> => {
    try {
        console.log("💾 Saving permissions for role:", roleId);
        console.log("📋 Feature permissions count:", featurePermissions.length);
        
        // Sử dụng API mới updateRolePermissionsV2
        // API này nhận trực tiếp FeaturePermission[] và convert sang format backend
        await updateRolePermissionsV2(roleId, featurePermissions);
        
        console.log("✅ Permissions saved successfully");
    } catch (error) {
        console.error("❌ Error saving permissions:", error);
        throw error;
    }
}
