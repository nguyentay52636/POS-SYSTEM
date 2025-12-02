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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Edit } from "lucide-react"
import { toast } from "sonner"
import { updateUser, UpdateUserRequest } from "@/apis/userApi"
import { IUser, role } from "@/types/types"
import type { IRole } from "@/apis/roleApi"


interface DialogEditUserProps {
    user: IUser
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    onUpdateUser: (updatedUser: IUser) => void
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
        user_id: 0,
        username: "",
        full_name: "",
        role: role.ADMIN,
        createdAt: "",
        updatedAt: "",
        avatar: "",
    })
    const [isLoading, setIsLoading] = useState(false)

    // Load user data when dialog opens
    useEffect(() => {
        if (user && isEditDialogOpen) {
            setEditedUser(user)
        }
    }, [user, isEditDialogOpen])

    const handleChange = (field: string, value: string) => {
        setEditedUser((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        
        try {
            const userData: UpdateUserRequest = {
                username: editedUser.username,
                fullName: editedUser.full_name,
                role: editedUser.role, // This will be converted by updateUser API
            }
            
            console.log("Updating user with data:", userData)
            
            const updatedUser = await updateUser(editedUser.user_id, userData)
            toast.success("Cập nhật người dùng thành công!")
            
            // Call the callback to refresh the list
            onUpdateUser(updatedUser)
            setIsEditDialogOpen(false)
            
        } catch (error) {
            console.error("Failed to update user:", error)
            toast.error("Cập nhật người dùng thất bại!")
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
                        Chỉnh sửa người dùng
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="username">Tên đăng nhập</Label>
                        <Input
                            id="username"
                            placeholder="Nhập tên đăng nhập"
                            value={editedUser.username}
                            onChange={(e) => handleChange("username", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="full_name">Họ và tên</Label>
                        <Input
                            id="full_name"
                            placeholder="Nhập họ và tên"
                            value={editedUser.full_name}
                            onChange={(e) => handleChange("full_name", e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Vai trò</Label>
                        <Select
                            onValueChange={(value) => handleChange("role", value)}
                            value={editedUser.role}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.length > 0 ? (
                                    roles.map((r) => (
                                        <SelectItem
                                            key={r.roleId}
                                            value={editedUser.role}
                                        >
                                            {r.roleName}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <>
                                        <SelectItem value={role.ADMIN}>Admin</SelectItem>
                                        <SelectItem value={role.STAFF}>Staff</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
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
                        <Button type="submit" disabled={isLoading}>
                            <Edit className="h-4 w-4 mr-2" />
                            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
