"use client";

import { Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TableManagerPayment from "./components/TableManagerPayment";
import PaymentFormDialog from "./components/PaymentFormDialog";
import PaginationManagerPayment from "./components/PaginationManagerPayment";
import type { IPayment } from "@/apis/paymentApi";
import { usePayment } from "@/hooks/usePayment";
import { useState } from "react";

export default function ManagerPayment() {
  const {
    loading,
    searchTerm,
    setSearchTerm,
    filteredPayments,
    paginatedPayments,
    fetchPayments,
    addPayment,
    updatePayment,
    deletePayment,
  } = usePayment();

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<IPayment | null>(null);

  const onAdd = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  const onEdit = (row: IPayment) => {
    setEditing(row);
    setOpenDialog(true);
  };

  const onDelete = async (row: IPayment) => {
    if (!row?.paymentId) return;
    await deletePayment(row.paymentId);
  };

  const onSubmit = async (payload: Omit<IPayment, "paymentId">, id?: number) => {
    if (id) {
      await updatePayment(id, payload);
    } else {
      await addPayment(payload);
    }
    setOpenDialog(false);
  };

  const formatCurrency = (n: number) => {
    try {
      return n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    } catch {
      return `${n}`;
    }
  };

  const formatDate = (dt: string) => {
    if (!dt) return "";
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return dt;
    return d.toLocaleString("vi-VN");
  };

  return (
    <div className="space-y-6 ">
      <div className="w-full mx-auto max-w-screen-2xl px-[clamp(12px,3vw,28px)] pt-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">$</span>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quản lý thanh toán
              </h1>
              <p className="text-sm text-muted-foreground">
                Theo dõi và thao tác các thanh toán trong hệ thống
              </p>
            </div>
          </div>

          <Button
            onClick={onAdd}
            className="bg-emerald-700 hover:bg-emerald-800 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm thanh toán
          </Button>
        </div>
      </div>
      <Card className="border-none shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">Danh sách thanh toán</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm phương thức / mã đơn / số tiền..."
                className="pl-8 w-[320px]"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <TableManagerPayment
            rows={paginatedPayments}
            loading={loading}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          <PaginationManagerPayment totalItems={filteredPayments.length} className="mt-4" />
        </CardContent>
      </Card>

      <PaymentFormDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        initial={editing ?? undefined}
        onSubmit={onSubmit}
      />
    </div>
  );
}
