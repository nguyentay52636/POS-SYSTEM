"use client"
import { useState, useEffect } from "react"
import type React from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IRole } from "@/apis/roleApi"

interface RoleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (role: Omit<IRole, "roleId"> | IRole) => void
    role?: IRole | null
    mode: "create" | "edit"
}

export function RoleDialog({ open, onOpenChange, onSave, role, mode }: RoleDialogProps) {
    const [formData, setFormData] = useState<Omit<IRole, "roleId">>({
        roleName: role?.roleName || "",
        description: role?.description || "",
    })

    useEffect(() => {
        if (open) {
            if (mode === "edit" && role) {
                setFormData({
                    roleName: role.roleName,
                    description: role.description,
                })
            } else {
                setFormData({
                    roleName: "",
                    description: "",
                })
            }
        }
    }, [open, role, mode])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (mode === "edit" && role) {
            onSave({ ...role, ...formData })
        } else {
            onSave(formData)
        }
        onOpenChange(false)
        setFormData({ roleName: "", description: "" })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">
                            {mode === "create" ? "Thêm vai trò mới" : "Chỉnh sửa vai trò"}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                            {mode === "create" ? "Nhập thông tin cho vai trò mới trong hệ thống" : "Cập nhật thông tin vai trò"}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="roleName" className="text-gray-900">
                                Tên vai trò <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="roleName"
                                value={formData.roleName}
                                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                                placeholder="Ví dụ: Quản lý kho"
                                required
                                className="border-gray-300"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-gray-900">
                                Mô tả <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Mô tả vai trò và trách nhiệm"
                                required
                                rows={3}
                                className="border-gray-300"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300">
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
                            {mode === "create" ? "Thêm vai trò" : "Lưu thay đổi"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
