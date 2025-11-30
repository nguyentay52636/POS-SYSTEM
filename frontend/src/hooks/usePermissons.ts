import useSWR from "swr"
import { useMemo } from "react"
import { getAllRoles, type IRole } from "@/apis/roleApi"
import { getFeatures, type IFeaturePermission } from "@/apis/featuresApi"
import {
    getPermissionsRoles,
    addPermissionRole,
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

// Save permissions function
export const savePermissions = async (roleId: number, featurePermissions: FeaturePermission[]): Promise<void> => {
    const permissionsToCreate: IPermissionsRolesCreate[] = []

    featurePermissions.forEach((feature) => {
        Object.entries(feature.permissions).forEach(([permission, isAllowed]) => {
            permissionsToCreate.push({
                roleId,
                featureId: feature.featureId,
                isAllowed,
            })
        })
    })

    // Send all permission updates
    await Promise.all(permissionsToCreate.map((permission) => addPermissionRole(roleId, permission)))
}
