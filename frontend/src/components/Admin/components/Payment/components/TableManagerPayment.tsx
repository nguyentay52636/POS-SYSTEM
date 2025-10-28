"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IPayment } from "@/apis/paymentApi";

export default function TableManagerPayment({
  rows,
  loading,
  onEdit,
  onDelete,
  formatCurrency,
  formatDate,
}: {
  rows: IPayment[];
  loading?: boolean;
  onEdit: (row: IPayment) => void;
  onDelete: (row: IPayment) => void;
  formatCurrency: (n: number) => string;
  formatDate: (iso: string) => string;
}) {
  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[110px]">Payment</TableHead>
            <TableHead className="w-[100px]">Order</TableHead>
            <TableHead className="w-[140px]">Số tiền</TableHead>
            <TableHead className="min-w-[160px]">Phương thức</TableHead>
            <TableHead className="min-w-[180px]">Ngày giờ</TableHead>
            <TableHead className="w-[130px] text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Đang tải...
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r, idx) => {
              // Chuẩn hoá giá trị có thể undefined
              const pid = Number(r.paymentId ?? 0);
              const oid = Number(r.orderId ?? 0);
              const amountSafe = Number.isFinite(Number(r.amount)) ? Number(r.amount) : 0;

              const key = pid > 0 ? `p-${pid}` : `row-${idx}`;
              const paymentMethod = (r.paymentMethod ?? "").replaceAll("_", " ").trim();
              const dateText = r.paymentDate ? formatDate(r.paymentDate) : "";

              return (
                <TableRow key={key}>
                  <TableCell className="text-center">{pid > 0 ? pid : ""}</TableCell>
                  <TableCell className="text-center">{oid > 0 ? oid : ""}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(amountSafe)}
                  </TableCell>
                  <TableCell className="capitalize">{paymentMethod}</TableCell>
                  <TableCell>{dateText}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => onEdit(r)}>
                        <Pencil className="h-4 w-4" /> Sửa
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-1" onClick={() => onDelete(r)}>
                        <Trash2 className="h-4 w-4" /> Xoá
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

