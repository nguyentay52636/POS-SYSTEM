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
import { IUser, role } from "@/types/types"


interface DialogEditUserProps {
    user: IUser
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    onUpdateUser: (updatedUser: IUser) => void
}

export default function DialogEditUser({
    user,
    isEditDialogOpen,
    setIsEditDialogOpen,
    onUpdateUser
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



    const handleChange = (field: string, value: string) => {
        setEditedUser((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onUpdateUser(editedUser)
        setIsEditDialogOpen(false)
        console.log("User updated:", editedUser)
        alert("✅ Cập nhật người dùng thành công!")
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
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                            id="fullName"
                            placeholder="Nhập họ và tên"
                            value={editedUser.full_name}
                            onChange={(e) => handleChange("fullName", e.target.value)}
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
                                <SelectItem value="1">Quản trị viên</SelectItem>
                                <SelectItem value="2">Người dùng</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="createdAt">Ngày tạo</Label>
                        <Input
                            type="date"
                            id="createdAt"
                            value={editedUser.createdAt}
                            onChange={(e) => handleChange("createdAt", e.target.value)}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button type="submit">
                            <Edit className="h-4 w-4 mr-2" />
                            Cập nhật
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
