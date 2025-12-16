"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { IEmployee } from "@/apis/employeeApi";

type Props = {
    employee: IEmployee;
    onEdit: (employee: IEmployee) => void;
    onDelete: (employee: IEmployee) => void;
    busy?: boolean;
};

export default function ActionsEmployee({
    employee,
    onEdit,
    onDelete,
    busy,
}: Props) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                        disabled={busy}
                        aria-label="Hành động"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(employee)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa nhân viên
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog xác nhận xoá */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Xác nhận xóa nhân viên
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-2">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">
                                Bạn có chắc chắn muốn xóa nhân viên này không?
                            </p>
                            <p className="text-sm text-red-700 mt-2 font-medium">
                                Họ và tên:{" "}
                                <span className="font-semibold">{employee.fullName || "Không rõ"}</span>
                            </p>
                            <p className="text-sm text-red-700">
                                Điện thoại: <span className="font-semibold">{employee.phone || "-"}</span>
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
                                disabled={busy}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Hủy
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    onDelete(employee);
                                    setIsDeleteDialogOpen(false);
                                }}
                                disabled={busy}
                            >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Xóa
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
