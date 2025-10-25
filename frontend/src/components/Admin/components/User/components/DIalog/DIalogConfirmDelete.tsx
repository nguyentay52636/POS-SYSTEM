import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import { IUser } from "@/types/types"



interface DialogConfirmDeleteProps {
    user: IUser
    isDeleteDialogOpen: boolean
    setIsDeleteDialogOpen: (open: boolean) => void
    onConfirmDelete: (userId: string) => void
}

export default function DialogConfirmDelete({
    user,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    onConfirmDelete
}: DialogConfirmDeleteProps) {
    const handleConfirmDelete = () => {
        onConfirmDelete(user.user_id.toString())
        setIsDeleteDialogOpen(false)
    }

    return (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Xác nhận xóa người dùng
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800">
                            Bạn có chắc chắn muốn xóa người dùng này không?
                        </p>
                        <p className="text-sm text-red-700 mt-2 font-medium">
                            Tên đăng nhập: <span className="font-semibold">{user.username}</span>
                        </p>
                        <p className="text-sm text-red-700">
                            Họ và tên: <span className="font-semibold">{user.full_name}</span>
                        </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                            ⚠️ Hành động này không thể hoàn tác!
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Xóa
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
