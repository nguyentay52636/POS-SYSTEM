"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IRole } from "@/apis/roleApi"

interface DeleteRoleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    role: IRole | null
}

export function DeleteRoleDialog({ open, onOpenChange, onConfirm, role }: DeleteRoleDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-gray-900">Xác nhận xóa vai trò</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600">
                        Bạn có chắc chắn muốn xóa vai trò <strong className="text-gray-900">{role?.roleName}</strong>?
                        <br />
                        <span className="text-red-600 font-medium">Hành động này không thể hoàn tác!</span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300">Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                        Xóa vai trò
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
