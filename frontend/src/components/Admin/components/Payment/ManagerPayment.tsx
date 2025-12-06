"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TableManagerPayment from "./components/TableManagerPayment";
import PaymentFormDialog from "./components/PaymentFormDialog";
import paymentApi from "@/apis/paymentApi";
import type { IPayment } from "@/apis/paymentApi";

export default function ManagerPayment() {
  const [data, setData] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<IPayment | null>(null);

  async function load() {
    setLoading(true);
    try {
      const rows = await paymentApi.list();
      setData(rows ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return data;
    return data.filter(
      (p) =>
        String(p.paymentId).includes(keyword) ||
        String(p.orderId).includes(keyword) ||
        p.paymentMethod.toLowerCase().includes(keyword) ||
        String(p.amount).includes(keyword)
    );
  }, [q, data]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

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
    await paymentApi.remove(row.paymentId);
    await load();
  };

  const onSubmit = async (payload: Omit<IPayment, "paymentId">, id?: number) => {
    if (id) await paymentApi.update(id, payload);
    else await paymentApi.create(payload);
    setOpenDialog(false);
    await load();
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
          {/* Bên trái: icon + tiêu đề */}
          <div className="flex items-center gap-3">
            {/* Icon gradient hiển thị dấu $ */}
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

          {/* Bên phải: nút thêm thanh toán */}
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
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm phương thức / mã đơn / số tiền..."
                className="pl-8 w-[320px]"
              />
            </div>
          </div>
        </CardHeader>


        <CardContent className="pt-4">
          <TableManagerPayment
            rows={rows ?? []}
            loading={loading}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onEdit={onEdit}
            onDelete={onDelete}
          />

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Hiển thị {rows.length ? `${start + 1}-${start + rows.length}` : 0} trên {total} kết quả
            </div>
            <div className="flex items-center gap-2">
              <select
                className="h-9 rounded-md border bg-background px-2"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} / trang
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={current <= 1}
                >
                  «
                </Button>
                <div className="px-3 py-1 rounded-md border bg-background">
                  {current} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={current >= totalPages}
                >
                  »
                </Button>
              </div>
            </div>
          </div>
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