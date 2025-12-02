import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"

import { createUser, CreateUserRequest } from "@/apis/userApi"
import { IUser } from "@/types/types"
import type { IRole } from "@/apis/roleApi"

interface DialogAddUserProps {
    isAddDialogOpen: boolean
    setIsAddDialogOpen: (open: boolean) => void
    onUserAdded: (user: IUser) => void
    roles: IRole[]
    loadingRoles?: boolean
    errorRoles?: string | null
}

export default function DialogAddUser({
    isAddDialogOpen,
    setIsAddDialogOpen,
    onUserAdded,
    roles,
    loadingRoles,
    errorRoles
}: DialogAddUserProps) {
    const [user, setUser] = useState({
        username: "",
        password: "",
        full_name: "",
        role: "1", // Default to admin (1)
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (field: string, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }))
    }

    const resetForm = () => {
        setUser({
            username: "",
            password: "",
            full_name: "",
            role: "1",
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const userData: CreateUserRequest = {
                username: user.username,
                password: user.password,
                fullName: user.full_name, // Try fullName instead of full_name
                role: user.role,
            }

            console.log("Sending user data:", userData) // Debug log

            const createdUser = await createUser(userData)
            toast.success("Tạo tài khoản thành công!")
            onUserAdded(createdUser)

            resetForm()
            setIsAddDialogOpen(false)

        } catch (error) {
            console.error("Failed to create user:", error)
            toast.error("Tạo tài khoản thất bại!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) {
                resetForm()
            }
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Thêm người dùng mới</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="username">Tên đăng nhập</Label>
                        <Input
                            id="username"
                            placeholder="Nhập tên đăng nhập"
                            value={user.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={user.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="full_name">Họ và tên</Label>
                        <Input
                            id="full_name"
                            placeholder="Nhập họ và tên"
                            value={user.full_name}
                            onChange={(e) => handleChange("full_name", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Vai trò</Label>
                        <Select
                            onValueChange={(value) => handleChange("role", value)}
                            value={user.role}
                            disabled={loadingRoles}
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        loadingRoles
                                            ? "Đang tải vai trò..."
                                            : errorRoles
                                                ? "Lỗi tải vai trò"
                                                : "Chọn vai trò"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.length > 0 ? (
                                    roles.map((r) => (
                                        <SelectItem key={r.roleId} value={String(r.roleId)}>
                                            {r.roleName}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <>
                                        <SelectItem value="1">Admin</SelectItem>
                                        <SelectItem value="2">Staff</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Đang tạo..." : "Lưu"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
