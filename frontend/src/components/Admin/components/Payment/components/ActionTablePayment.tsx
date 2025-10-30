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

/** Hiển thị menu 3 chấm + dialog xác nhận xoá cho Payment */
export default function ActionTablePayment(props: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => Promise<void> | void;
  disabled?: boolean;
  display?: {
    id?: number | string;
    orderId?: number | string;
    amount?: number | string;
    method?: string;
    date?: string;
  };
}) {
  const { onView, onEdit, onDelete, disabled, display } = props;
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const confirmDelete = async () => {
    if (!onDelete) return;
    try {
      setBusy(true);
      await onDelete();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0" aria-label="Hành động" disabled={disabled}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={onEdit} disabled={!onEdit}>
            <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="text-red-600 focus:text-red-600"
            disabled={!onDelete}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Xóa thanh toán
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog xác nhận xoá (cùng style với bản Customer) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Xác nhận xóa thanh toán
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">Bạn có chắc chắn muốn xóa thanh toán này không?</p>
              {display?.id !== undefined && (
                <p className="text-sm text-red-700 mt-2 font-medium">
                  Payment ID: <span className="font-semibold">{display.id}</span>
                </p>
              )}
              {display?.orderId !== undefined && (
                <p className="text-sm text-red-700">Order ID: <span className="font-semibold">{display.orderId}</span></p>
              )}
              {display?.amount !== undefined && (
                <p className="text-sm text-red-700">Số tiền: <span className="font-semibold">{display.amount}</span></p>
              )}
              {display?.method && (
                <p className="text-sm text-red-700">Phương thức: <span className="font-semibold">{display.method}</span></p>
              )}
              {display?.date && (
                <p className="text-sm text-red-700">Ngày giờ: <span className="font-semibold">{display.date}</span></p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">⚠️ Hành động này không thể hoàn tác!</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={busy}>
                <X className="h-4 w-4 mr-2" /> Hủy
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDelete} disabled={busy}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                {busy ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
