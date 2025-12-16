"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, RefreshCw, Trash2 } from "lucide-react"
import { IRole } from '@/apis/roleApi'

interface CardRoleTabProps {
    onAddRole: () => void
    onEditRole: () => void
    onResetPermissions: () => void
    onDeleteRole: () => void
    selectedRole: IRole | null
}

export default function CardRoleTab({
    onAddRole,
    onEditRole,
    onResetPermissions,
    onDeleteRole,
    selectedRole
}: CardRoleTabProps) {
    return (
        <>
            <Card className="border-gray-200 shadow-md">
                <CardHeader className="pb-4 border-b border-gray-100">
                    <CardTitle className="text-base font-semibold text-gray-900">Thao tác</CardTitle>
                    <CardDescription className="text-xs text-gray-600">
                        Quản lý vai trò trong hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-2.5">
                    <Button
                        size="sm"
                        onClick={onAddRole}
                        className="w-full bg-green-700 hover:bg-green-800 text-white shadow-sm h-9"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm vai trò
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onEditRole}
                        disabled={!selectedRole}
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-9 bg-transparent disabled:opacity-50"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Sửa vai trò
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onResetPermissions}
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-9 bg-transparent"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Đặt lại quyền
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onDeleteRole}
                        disabled={!selectedRole}
                        className="w-full border-red-300 text-red-700 hover:bg-red-50 h-9 bg-transparent disabled:opacity-50"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa vai trò
                    </Button>
                </CardContent>
            </Card>
        </>
    )
}
