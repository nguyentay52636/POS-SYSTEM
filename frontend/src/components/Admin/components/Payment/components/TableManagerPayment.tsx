"use client";

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
import Image from "next/image";

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
            <TableHead className="text-center">Mã TT</TableHead>
            <TableHead className="text-center">Mã HĐ</TableHead>
            <TableHead className="text-left min-w-[280px]">Sản phẩm</TableHead>
            <TableHead className="text-center">Số tiền</TableHead>
            <TableHead className="text-center">Phương thức</TableHead>
            <TableHead className="text-center">Thao tác</TableHead>
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
                const orderItems = r.order?.orderItems || [];

                return (
                  <TableRow key={key}>
                    <TableCell className="text-center">{pid > 0 ? pid : ""}</TableCell>
                    <TableCell className="text-center">{oid > 0 ? oid : ""}</TableCell>
                    <TableCell className="text-left">
                      {orderItems.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {orderItems.map((item: any, i) => {
                            const productName = item.productName || item.product?.productName || `SP #${item.productId}`;
                            const imageUrl = item.product?.imageUrl;
                            const subtotal = item.subtotal || (item.quantity * item.price);

                            return (
                              <div key={item.orderItemId || i} className="flex items-center gap-2">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={productName}
                                    width={36}
                                    height={36}
                                    className="rounded object-cover w-9 h-9"
                                  />
                                ) : (
                                  <div className="w-9 h-9 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                    <span>📦</span>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {productName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.quantity} x {formatCurrency(item.price)} = {formatCurrency(subtotal)}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Không có sản phẩm</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {formatCurrency(amountSafe)}
                    </TableCell>
                    <TableCell className="capitalize text-center">
                      {paymentMethod}
                    </TableCell>
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
                <TableCell colSpan={3} className="text-right">
                  Tổng Doanh Thu:
                </TableCell>
                <TableCell className="text-center font-semibold">
                  {formatCurrency(totalAmount)}
                </TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>

            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
