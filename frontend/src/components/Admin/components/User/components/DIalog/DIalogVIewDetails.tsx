import React from "react"
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
import { IUser, role } from "@/types/types"



interface DialogViewDetailsProps {
    user: IUser
    isViewDialogOpen: boolean
    setIsViewDialogOpen: (open: boolean) => void
}

export default function DialogViewDetails({ user, isViewDialogOpen, setIsViewDialogOpen }: DialogViewDetailsProps) {
    const getRoleName = (role: role) => {
        // return role === role.ADMIN ? "admin" : role === role.USER ? "Người dùng" : "Khách hàng"
    }

    return (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Chi tiết người dùng</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="username">Tên đăng nhập</Label>
                        <Input
                            id="username"
                            value={user.username}
                            readOnly
                            className="bg-gray-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Họ và tên</Label>
                        <Input
                            id="fullName"
                            value={user.full_name}
                            readOnly
                            className="bg-gray-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Vai trò</Label>
                        <Input
                            // value={getRoleName(user.role)}
                            value={user.role}
                            readOnly
                            className="bg-gray-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="createdAt">Ngày tạo</Label>
                        <Input
                            type="date"
                            id="createdAt"
                            value={user.createdAt}
                            readOnly
                            className="bg-gray-50"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsViewDialogOpen(false)}
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
