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
import ActionTablePayment from "./ActionTablePayment";

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
  const totalAmount = rows?.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/100 font-semibold">
            <TableHead className=" text-center">Mã Thanh Toán</TableHead>
            <TableHead className="text-center">Mã hoá đơn</TableHead>
            <TableHead className="text-center">Sản phẩm</TableHead>
            <TableHead className=" text-center">Số tiền</TableHead>
            <TableHead className=" text-center">Phương thức</TableHead>
            <TableHead className=" text-center">Tạo lúc</TableHead>
            <TableHead className=" text-center">Thao tác</TableHead>
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
            <>
              {rows.map((r, idx) => {
                const pid = Number(r.paymentId ?? 0);
                const oid = Number(r.orderId ?? 0);
                const amountSafe = Number.isFinite(Number(r.amount))
                  ? Number(r.amount)
                  : 0;

                const key = pid > 0 ? `p-${pid}` : `row-${idx}`;
                const paymentMethod = (r.paymentMethod ?? "")
                  .replaceAll("_", " ")
                  .trim();
                const dateText = r.paymentDate ? formatDate(r.paymentDate) : "";

                return (
                  <TableRow key={key}>
                    <TableCell className="text-center">{pid > 0 ? pid : ""}</TableCell>
                    <TableCell className="text-center">{oid > 0 ? oid : ""}</TableCell>
                    <TableCell className="capitalize text-center">
                      {formatCurrency(amountSafe)}
                    </TableCell>
                    <TableCell className="capitalize text-center">
                      {paymentMethod}
                    </TableCell>
                    <TableCell className="text-center">{dateText}</TableCell>
                    <TableCell className="text-center">
                      <ActionTablePayment
                        onEdit={() => onEdit(r)}
                        onDelete={() => onDelete(r)}
                        display={{
                          id: pid,
                          orderId: oid,
                          amount: formatCurrency(amountSafe),
                          method: paymentMethod,
                          date: dateText,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow className="bg-muted/100 font-semibold">
                <TableCell colSpan={1} className="capitalize text-right">
                  Tổng Doanh Thu:
                </TableCell>
                <TableCell colSpan={1}> </TableCell>
                <TableCell className="capitalize text-center font-semibold">
                  {formatCurrency(totalAmount)}
                </TableCell>
                <TableCell colSpan={3}></TableCell>
              </TableRow>

            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
