import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Remove Select imports properly if not using, or keep for potential future use but we are making role readonly
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Edit, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { updateUser, UpdateUserRequest } from "@/apis/userApi"
import { IUser, role } from "@/types/types"
import type { IRole } from "@/apis/roleApi"


interface DialogEditUserProps {
    user: IUser
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    onUpdateUser: () => void
    roles: IRole[]
}

export default function DialogEditUser({
    user,
    isEditDialogOpen,
    setIsEditDialogOpen,
    onUpdateUser,
    roles
}: DialogEditUserProps) {
    const [editedUser, setEditedUser] = useState<IUser>({
        userId: 0,
        username: "",
        fullName: "",
        role: 1,
        createdAt: "",
        updatedAt: "",
        avatar: "",
        status: "active",
        roleName: ""
    })

    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Load user data when dialog opens
    useEffect(() => {
        if (user && isEditDialogOpen) {
            setEditedUser(user)
            setPassword("") // Reset password field
        }
    }, [user, isEditDialogOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Only sending password as per requirement
            const userData: UpdateUserRequest = {
                password: password
            }

            console.log("Updating user password:", userData)

            await updateUser(editedUser.userId, userData)
            toast.success("Cập nhật mật khẩu thành công!")

            // Call the callback to refresh the list
            onUpdateUser()
            setIsEditDialogOpen(false)

        } catch (error: any) {
            console.error("Failed to update user:", error)
            const msg = error?.response?.data?.message || "Cập nhật thất bại!"
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit className="h-5 w-5" />
                        Chỉnh sửa tài khoản
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="username">Tên đăng nhập</Label>
                        <Input
                            id="username"
                            value={editedUser.username}
                            readOnly
                            disabled
                            className="bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                            id="fullName"
                            value={editedUser.fullName}
                            readOnly
                            disabled
                            className="bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Vai trò</Label>
                        <Input
                            value={editedUser.roleName || (typeof editedUser.role === 'string' ? editedUser.role : `Role ${editedUser.role}`)}
                            readOnly
                            disabled
                            className="bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Trạng thái</Label>
                        <Input
                            value={editedUser.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                            readOnly
                            disabled
                            className="bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mật khẩu mới</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500">Chỉ nhập nếu bạn muốn thay đổi mật khẩu.</p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading || !password}>
                            <Edit className="h-4 w-4 mr-2" />
                            {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
