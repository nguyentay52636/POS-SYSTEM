"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Save, RefreshCw, Loader2, Edit } from "lucide-react"
import { IRole } from "@/apis/roleApi"
import { RoleSelector } from "../RoleSelector"
import { FeaturePermission, type PermissionType } from "@/apis/rolePermissionsApi"
import CardRoleTab from "./components/CardRoleTab"
import { PermissionsTable } from "../PermisstionTable"

interface PermissionsTabProps {
    roles: IRole[]
    selectedRole: IRole | null
    features: FeaturePermission[]
    permissionsLoading: boolean
    isSaving: boolean
    onRoleChange: (role: IRole | null) => void
    onPermissionChange: (featureId: number, permission: PermissionType, value: boolean) => void
    onSelectAll: (permission: PermissionType, value: boolean) => void
    onFeatureSelectAll: (featureId: number, value: boolean) => void
    onSaveChanges: () => void
    onResetPermissions: () => void
    onAddRole: () => void
    onEditRole: () => void
    onDeleteRole: () => void
}

export function PermissionsTab({
    roles,
    selectedRole,
    features,
    permissionsLoading,
    isSaving,
    onRoleChange,
    onPermissionChange,
    onSelectAll,
    onFeatureSelectAll,
    onSaveChanges,
    onResetPermissions,
    onAddRole,
    onEditRole,
    onDeleteRole,
}: PermissionsTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-[320px_1fr] gap-6">
                <div className="space-y-6">
                    <Card className="border-gray-200 shadow-md">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <CardTitle className="text-base font-semibold dark:text-white">Vai trò</CardTitle>
                            <CardDescription className="text-xs dark:text-white">
                                Chọn vai trò để cấu hình phân quyền
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <RoleSelector roles={roles} selectedRole={selectedRole} onRoleChange={onRoleChange} />

                            {selectedRole && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="text-xs font-medium dark:text-green-900 mb-1">Đã chọn</div>
                                        <div className="text-sm dark:text-green-800 font-semibold">{selectedRole.roleName}</div>
                                        <div className="text-xs dark:text-green-700 mt-1">{selectedRole.description}</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <CardRoleTab
                        onAddRole={onAddRole}
                        onEditRole={onEditRole}
                        onResetPermissions={onResetPermissions}
                        onDeleteRole={onDeleteRole}
                        selectedRole={selectedRole}
                    />
                </div>

                <div className="space-y-6">
                    <Card className="border-gray-200 shadow-md">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-semibold dark:text-white">
                                        Chi tiết phân quyền - {selectedRole?.roleName || "Chưa chọn"}
                                    </CardTitle>
                                    <CardDescription className="text-sm dark:text-white ">
                                        Cấu hình chi tiết quyền truy cập cho từng chức năng trong hệ thống
                                    </CardDescription>
                                </div>
                                <Button
                                    onClick={onSaveChanges}
                                    disabled={isSaving || !selectedRole}
                                    className="bg-green-700 hover:bg-green-800 text-white shadow-md h-10 px-5 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Lưu thay đổi
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {permissionsLoading ? (
                                <div className="text-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-green-700 mx-auto mb-4" />
                                    <p className="text-gray-600">Đang tải phân quyền...</p>
                                </div>
                            ) : (
                                <PermissionsTable
                                    features={features}
                                    onPermissionChange={onPermissionChange}
                                    onSelectAll={onSelectAll}
                                    onFeatureSelectAll={onFeatureSelectAll}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

