"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IPayment } from "@/apis/paymentApi";

type FormValue = Omit<IPayment, "paymentId">;

export default function PaymentFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: IPayment;
  onSubmit: (payload: FormValue, id?: number) => Promise<void> | void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormValue>({
    defaultValues: {
      orderId: 0,
      amount: 0,
      paymentMethod: "cash",
      paymentDate: new Date().toISOString().slice(0, 16),
    } as any,
  });

  useEffect(() => {
    if (initial) {
      reset({
        orderId: initial.orderId,
        amount: initial.amount,
        paymentMethod: initial.paymentMethod,
        // next expects "YYYY-MM-DDTHH:mm"
        paymentDate: (initial.paymentDate ?? "").slice(0, 16),
      } as any);
    } else {
      reset({
        orderId: 0,
        amount: 0,
        paymentMethod: "cash",
        paymentDate: new Date().toISOString().slice(0, 16),
      } as any);
    }
  }, [initial, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{initial ? "Sửa thanh toán" : "Thêm thanh toán"}</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            // convert datetime-local -> ISO
            const iso = values.paymentDate
              ? new Date(values.paymentDate).toISOString()
              : new Date().toISOString();
            const payload: FormValue = { ...values, paymentDate: iso };
            await onSubmit(payload, initial?.paymentId);
          })}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Mã đơn hàng</Label>
              <Input type="number" {...register("orderId", { valueAsNumber: true })} required />
            </div>

            <div>
              <Label>Số tiền</Label>
              <Input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} required />
            </div>

            <div>
              <Label>Phương thức</Label>
              <Select
                defaultValue={watch("paymentMethod")}
                onValueChange={(v) => setValue("paymentMethod", v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Tiền mặt</SelectItem>
                  <SelectItem value="card">Thẻ</SelectItem>
                  <SelectItem value="e-wallet">Ví điện tử</SelectItem>
                  <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ngày giờ</Label>
              {/* datetime-local */}
              <Input type="datetime-local" {...register("paymentDate")} required />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {initial ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
