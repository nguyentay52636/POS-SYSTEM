import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IEmployee } from "@/apis/employeeApi"

interface DialogViewDetailsProps {
    employee: IEmployee | null
    isOpen: boolean
    onClose: () => void
}

export default function DialogViewDetails({ employee, isOpen, onClose }: DialogViewDetailsProps) {
    if (!employee) return null

    const formatDate = (dateString?: string | Date) => {
        if (!dateString) return ""
        return new Date(dateString).toLocaleDateString("vi-VN")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Chi tiết nhân viên</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label>Họ và tên</Label>
                        <Input
                            value={employee.fullName || ""}
                            readOnly
                            disabled
                            className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Giới tính</Label>
                            <Input
                                value={employee.gender === "Male" ? "Nam" : employee.gender === "Female" ? "Nữ" : "Khác"}
                                readOnly
                                disabled
                                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Ngày sinh</Label>
                            <Input
                                value={formatDate(employee.birthDate)}
                                readOnly
                                disabled
                                className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input
                            value={employee.phone || ""}
                            readOnly
                            disabled
                            className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Chức vụ</Label>
                        <Input
                            value={employee.rolePosition || employee.role?.roleName || "Chưa có"}
                            readOnly
                            disabled
                            className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Trạng thái</Label>
                        <Input
                            value={employee.status === "active" ? "Đang làm việc" : "Đã nghỉ"}
                            readOnly
                            disabled
                            className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
