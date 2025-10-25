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

export default function DialogAddUser({ isAddDialogOpen, setIsAddDialogOpen }: { isAddDialogOpen: boolean, setIsAddDialogOpen: (open: boolean) => void }) {
    const [user, setUser] = useState({
        username: "",
        fullName: "",
        role: "1",
        createdAt: new Date().toISOString().slice(0, 10),
    })

    const handleChange = (field: string, value: string) => {
        setUser((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
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
                            <Label htmlFor="fullName">Họ và tên</Label>
                            <Input
                                id="fullName"
                                placeholder="Nhập họ và tên"
                                value={user.fullName}
                                onChange={(e) => handleChange("fullName", e.target.value)}
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
                                value={user.createdAt}
                                onChange={(e) => handleChange("createdAt", e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit">Lưu</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
