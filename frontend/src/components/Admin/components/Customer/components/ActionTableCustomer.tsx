"use client";

import * as React from "react";
import { MoreHorizontal, Eye, Pencil, Trash2, AlertTriangle, X } from "lucide-react";
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

type Props = {
  onView?: () => void;
  onEdit?: () => void;
  /** Thực thi xoá thật; return Promise nếu gọi API */
  onDelete?: () => Promise<void> | void;

  /** Thông tin hiển thị trong dialog (để người dùng biết đang xoá ai) */
  display?: {
    id?: number | string;
    name?: string;
    phone?: string;
    email?: string;
  };

  /** Nếu cha đang loading (xoá…), disable menu */
  disabled?: boolean;
};

export default function ActionTableCustomer({
  onView,
  onEdit,
  onDelete,
  display,
  disabled,
}: Props) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    try {
      setIsLoading(true);
      await onDelete();
      setIsDeleteDialogOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Menu ba chấm giống phần Tài khoản */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0"
            aria-label="Hành động"
            disabled={disabled}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onView} disabled={!onView}>
            <Eye className="mr-2 h-4 w-4" />
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit} disabled={!onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
            disabled={!onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa Khách hàng
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog xác nhận xoá (theo mẫu bạn gửi) */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Xác nhận xóa khách hàng
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                Bạn có chắc chắn muốn xóa khách hàng này không?
              </p>
              {display?.id !== undefined && (
                <p className="text-sm text-red-700 mt-2 font-medium">
                  ID: <span className="font-semibold">{display.id}</span>
                </p>
              )}
              {display?.name && (
                <p className="text-sm text-red-700">
                  Họ và tên: <span className="font-semibold">{display.name}</span>
                </p>
              )}
              {display?.phone && (
                <p className="text-sm text-red-700">
                  Điện thoại: <span className="font-semibold">{display.phone}</span>
                </p>
              )}
              {display?.email && (
                <p className="text-sm text-red-700">
                  Email: <span className="font-semibold">{display.email}</span>
                </p>
              )}
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
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isLoading}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {isLoading ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
