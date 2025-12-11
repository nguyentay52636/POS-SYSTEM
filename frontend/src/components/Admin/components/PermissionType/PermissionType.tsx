"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, TrendingUp, Award, Loader2 } from "lucide-react"
import { useRoles, usePermissionsData, savePermissions } from "@/hooks/usePermissons"
import { addRole, updateRole, deleteRole, IRole } from "@/apis/roleApi"
import { toast } from "sonner"
import { RoleDialog } from "./components/Dialog/RoleDialog"
import { DeleteRoleDialog } from "./components/Dialog/DeleteRoleDialog"
import { FeaturePermission, type PermissionType } from "@/apis/rolePermissionsApi"
import { PermissionsTab } from "./components/Tabs/PermissionsTab"
import { ProfitTab } from "./components/Tabs/components/ProfitTab/ProfitTab"
import PermissionHeader from "./components/PermissionHeader"
import { PreviewTab } from "./components/Tabs/components/ProfitTab/components/PreviewTab"

export default function PermissionType() {
    const { roles, isLoading: rolesLoading, mutate: mutateRoles } = useRoles()
    const [selectedRole, setSelectedRole] = useState<IRole | null>(null)
    const { featurePermissions, isLoading: permissionsLoading, mutate } = usePermissionsData(selectedRole?.roleId || null)
    const [features, setFeatures] = useState<FeaturePermission[]>([])
    const [isSaving, setIsSaving] = useState(false)

    const [roleDialogOpen, setRoleDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")

    // Auto-select first role when roles are loaded
    useEffect(() => {
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0])
        }
    }, [roles, selectedRole])

    // Sync features state with featurePermissions when they change
    // Reset features when role changes
    useEffect(() => {
        if (selectedRole && featurePermissions.length > 0) {
            // Deep copy để tránh reference issues
            setFeatures(featurePermissions.map(fp => ({
                featureId: fp.featureId,
                featureName: fp.featureName,
                permissions: { ...fp.permissions }
            })))
        } else {
            setFeatures([])
        }
    }, [featurePermissions, selectedRole?.roleId])

    const handlePermissionChange = useCallback((featureId: number, permission: PermissionType, value: boolean) => {
        setFeatures((prev) =>
            prev.map((feature) =>
                feature.featureId === featureId
                    ? {
                        ...feature,
                        permissions: { ...feature.permissions, [permission]: value },
                    }
                    : feature,
            ),
        )
    }, [])

    const handleSelectAll = useCallback((permission: PermissionType, value: boolean) => {
        setFeatures((prev) =>
            prev.map((feature) => ({
                ...feature,
                permissions: { ...feature.permissions, [permission]: value },
            })),
        )
    }, [])

    const handleFeatureSelectAll = useCallback((featureId: number, value: boolean) => {
        setFeatures((prev) =>
            prev.map((feature) =>
                feature.featureId === featureId
                    ? {
                        ...feature,
                        permissions: Object.fromEntries(Object.keys(feature.permissions).map((key) => [key, value])) as {
                            [key in PermissionType]: boolean
                        },
                    }
                    : feature,
            ),
        )
    }, [])

    const handleSaveChanges = async () => {
        if (!selectedRole) {
            toast.error("Vui lòng chọn vai trò trước khi lưu")
            return
        }

        if (features.length === 0) {
            toast.error("Không có dữ liệu phân quyền để lưu")
            return
        }

        // Validate features có đầy đủ thông tin
        const invalidFeatures = features.filter(f => !f.featureId || !f.featureName)
        if (invalidFeatures.length > 0) {
            console.error("Invalid features:", invalidFeatures)
            toast.error("Dữ liệu phân quyền không hợp lệ. Vui lòng tải lại trang.")
            return
        }

        setIsSaving(true)
        try {
            console.log("💾 Saving permissions for role:", selectedRole.roleId)
            console.log("📋 Features to save:", features.length)

            // Gọi API save permissions
            await savePermissions(selectedRole.roleId, features)

            // Refresh data từ API sau khi save thành công
            await mutate()

            // Sync lại features state với data mới từ API
            // mutate() sẽ trigger useEffect để update featurePermissions
            // và useEffect sẽ sync lại features state

            toast.success("Đã lưu thay đổi phân quyền thành công!")
        } catch (error: any) {
            console.error("❌ Error saving permissions:", error)

            // Hiển thị thông báo lỗi chi tiết hơn
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Không thể lưu thay đổi. Vui lòng thử lại."

            toast.error(`Lỗi: ${errorMessage}`)
        } finally {
            setIsSaving(false)
        }
    }

    const handleResetPermissions = useCallback(() => {
        setFeatures((prev) =>
            prev.map((feature) => ({
                ...feature,
                permissions: Object.fromEntries(Object.keys(feature.permissions).map((key) => [key, false])) as {
                    [key in PermissionType]: boolean
                },
            })),
        )
    }, [])

    const handleRoleChange = useCallback((role: IRole | null) => {
        setSelectedRole(role)
        // Reset features khi đổi role
        setFeatures([])
    }, [])

    const handleAddRole = async (roleData: Omit<IRole, "roleId"> | IRole) => {
        try {
            await addRole(roleData as IRole)
            await mutateRoles()
            toast.success("Đã thêm vai trò mới thành công!")
        } catch (error: any) {
            console.error("[v0] Error adding role:", error)
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Không thể thêm vai trò. Vui lòng thử lại."
            toast.error(errorMessage)
        }
    }

    const handleEditRole = async (roleData: Omit<IRole, "roleId"> | IRole) => {
        try {
            if ("roleId" in roleData) {
                await updateRole(roleData.roleId, roleData)
                await mutateRoles()
                toast.success("Đã cập nhật vai trò thành công!")
            }
        } catch (error: any) {
            console.error("[v0] Error updating role:", error)
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Không thể cập nhật vai trò. Vui lòng thử lại."
            toast.error(errorMessage)
        }
    }

    const handleDeleteRole = async () => {
        if (!selectedRole) return

        try {
            await deleteRole(selectedRole.roleId)
            await mutateRoles()
            setSelectedRole(null)
            setFeatures([])
            toast.success("Đã xóa vai trò thành công!")
        } catch (error: any) {
            console.error("[v0] Error deleting role:", error)
            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.message ||
                "Không thể xóa vai trò. Vui lòng thử lại."
            toast.error(errorMessage)
        }
    }

    if (rolesLoading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-green-700 mx-auto mb-4" />
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div>
            <PermissionHeader />

            <div className="p-8">
                <Tabs defaultValue="permissions" className="w-full">
                    <TabsList className="mb-8 bg-white border border-gray-200 shadow-sm p-1">
                        <TabsTrigger
                            value="permissions"
                            className="gap-2 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                        >
                            <Shield className="h-4 w-4" />
                            Phân quyền
                        </TabsTrigger>
                        <TabsTrigger
                            value="profit"
                            className="gap-2 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                        >
                            <TrendingUp className="h-4 w-4" />% Lợi nhuận
                        </TabsTrigger>
                        <TabsTrigger
                            value="points"
                            className="gap-2 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                        >
                            <Award className="h-4 w-4" />
                            Quy đổi điểm KH
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="permissions" className="space-y-6">
                        <PermissionsTab
                            roles={roles}
                            selectedRole={selectedRole}
                            features={features}
                            permissionsLoading={permissionsLoading}
                            isSaving={isSaving}
                            onRoleChange={handleRoleChange}
                            onPermissionChange={handlePermissionChange}
                            onSelectAll={handleSelectAll}
                            onFeatureSelectAll={handleFeatureSelectAll}
                            onSaveChanges={handleSaveChanges}
                            onResetPermissions={handleResetPermissions}
                            onAddRole={() => {
                                setDialogMode("create")
                                setRoleDialogOpen(true)
                            }}
                            onEditRole={() => {
                                if (selectedRole) {
                                    setDialogMode("edit")
                                    setRoleDialogOpen(true)
                                }
                            }}
                            onDeleteRole={() => setDeleteDialogOpen(true)}
                        />
                    </TabsContent>

                    <TabsContent value="profit">
                        <ProfitTab />
                    </TabsContent>

                    <TabsContent value="points">
                        <PreviewTab />
                    </TabsContent>
                </Tabs>
            </div>

            <RoleDialog
                open={roleDialogOpen}
                onOpenChange={setRoleDialogOpen}
                onSave={dialogMode === "create" ? handleAddRole : handleEditRole}
                role={dialogMode === "edit" ? selectedRole : null}
                mode={dialogMode}
            />

            <DeleteRoleDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteRole}
                role={selectedRole}
            />
        </div>
    )
}
