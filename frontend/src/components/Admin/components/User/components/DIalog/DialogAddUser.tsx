import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { createUser, CreateUserRequest } from "@/apis/userApi";

export default function DialogAddUser({ isAddDialogOpen, setIsAddDialogOpen }: { isAddDialogOpen: boolean, setIsAddDialogOpen: (open: boolean) => void }) {
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
            
            console.log("Sending user data:", userData); // Debug log
            
            await createUser(userData)
            toast.success("Tạo tài khoản thành công!")
            
            // Reset form
            setUser({
                username: "",
                password: "",
                full_name: "",
                role: "1", // Default to admin (1)
            })
            
            // Close dialog
            setIsAddDialogOpen(false)
            
        } catch (error) {
            console.error("Failed to create user:", error)
            toast.error("Tạo tài khoản thất bại!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        className="w-full mx-8 sm:w-auto bg-green-700 text-white hover:bg-green-800 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2"
                        onClick={() => setIsAddDialogOpen(true)}
                    >
                        <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">Thêm tài khoản</span>
                    </Button>
                </DialogTrigger>

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
                                defaultValue={user.role}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Admin</SelectItem>
                                    <SelectItem value="2">Staff</SelectItem>
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
        </>
    )
}
