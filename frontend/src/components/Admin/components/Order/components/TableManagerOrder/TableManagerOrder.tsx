import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  ShoppingCart,
} from "lucide-react";
import type { Order } from "@/apis/orderApi";
import DialogConfirm from "../Dialog/DialogConfirm";
import { toast } from "sonner";
import ActionsOnTableOrder from "./ActionsOnTableOrder";

export type UiStatus = "ALL" | "ChoDuyet" | "DaDuyet" | "DaHuy";

export interface OrderTableProps {
  paginatedpayments: Order[];                                // danh sách gốc (chưa lọc)
  calculateTotalAmount: (orderItems: any[]) => number;       // gross
  getNetAmount: (order: Order) => number;                    // net = gross - discount
  handleViewDetails: (order: Order) => void;
  handleDelete: (id: number) => void;
  onStatusChange?: (orderId: number, newStatus: string) => void | Promise<void>;
  loading?: boolean;

  /** ⬇️ Thêm 2 props tùy chọn để table tự lọc */
  statusFilter?: UiStatus;            // "ALL" | "ChoDuyet" | "DaDuyet" | "DaHuy"
  searchKeyword?: string;             // từ khóa tìm kiếm (mã, tên KH, người tạo, promoCode)
  // Optional: parent can control which row is selected (for export) and receive selection changes
  selectedRowId?: number | null;
  onRowSelect?: (order: Order | null) => void;
}

// Chuẩn hoá mọi biến thể về key UI
const toUiStatus = (s: string) => {
  const k = (s || "").toLowerCase();
  if (k === "pending" || k === "choduyet") return "ChoDuyet";
  if (k === "paid" || k === "approved" || k === "daduyet") return "DaDuyet";
  if (k === "canceled" || k === "cancelled" || k === "dahuy") return "DaHuy";
  return "ChoDuyet";
};

export default function OrderTable({
  paginatedpayments,
  calculateTotalAmount,
  getNetAmount,
  handleViewDetails,
  handleDelete,
  onStatusChange,
  loading,
  statusFilter = "ALL",
  searchKeyword = "",
  selectedRowId = null,
  onRowSelect,
}: OrderTableProps) {
  // selection is lifted to parent via onRowSelect (if provided)
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const handleStatusChangeLocal = async (orderId: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      if (onStatusChange) await onStatusChange(orderId, newStatus); // PHẢI await
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      setIsDeleting(true);
      await Promise.resolve(handleDelete(orderToDelete.orderId));
      toast.success("Xóa (hủy) đơn hàng thành công!", { duration: 3000 });
      setOrderToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  /* ===========================
     Lọc theo trạng thái & từ khóa
     =========================== */
  const rows = useMemo(() => {
    const keyword = (searchKeyword || "").trim().toLowerCase();

    return paginatedpayments.filter((o) => {
      const matchStatus =
        statusFilter === "ALL" || toUiStatus(o.status) === statusFilter;

      const matchSearch =
        !keyword ||
        String(o.orderId).includes(keyword) ||
        (o.customerName || "").toLowerCase().includes(keyword) ||
        (o.userName || "").toLowerCase().includes(keyword) ||
        (o.promoCode || "").toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [paginatedpayments, statusFilter, searchKeyword]);

  return (
    <div className="shadow-xl bg-white/90 dark:bg-gray-800/90 rounded-xl overflow-hidden border">
      <div className="my-6 p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">Danh sách đơn hàng</h3>
            <p className="text-sm text-gray-600">
              Quản lý ({rows.length} đơn)
              {loading ? " • đang tải..." : ""}
            </p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader className="sticky top-0 bg-green-50/80 dark:bg-green-900/20 z-10">
          <TableRow>
            <TableHead className="w-[50px] font-semibold">
              <Checkbox />
            </TableHead>
            <TableHead className="font-semibold">Mã hoá đơn</TableHead>
            <TableHead className="font-semibold">Khách hàng</TableHead>
            <TableHead className="font-semibold">Sản phẩm</TableHead>
            <TableHead className="font-semibold">Giá</TableHead>
            <TableHead className="font-semibold">Trạng thái</TableHead>
            <TableHead className="w-[50px] font-semibold">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.map((order: Order) => {
            const currentUi = toUiStatus(order.status);

            return (
              <TableRow key={order.orderId} className="hover:bg-green-50/50">
                <TableCell>
                  <Checkbox
                    checked={selectedRowId === order.orderId}
                    onCheckedChange={(val: boolean) => {
                      // notify parent selection change
                      if (val) {
                        onRowSelect?.(order);
                      } else {
                        onRowSelect?.(null);
                      }
                    }}
                  />
                </TableCell>

                <TableCell>
                  <div>{order.orderId}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                  </div>
                </TableCell>

                <TableCell>
                  <div>{order.customerName}</div>
                  <div className="text-sm text-muted-foreground">
                    {order.userName}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-2">
                    {order.orderItems && order.orderItems.length > 0 ? (
                      order.orderItems.slice(0, 3).map((item) => (
                        <div key={item.orderItemId} className="flex items-center gap-3">
                          <img
                            src={item.product?.imageUrl || "/placeholder.svg"}
                            alt={item.product?.imageUrl || item.product?.productName || "Sản phẩm"}
                            className="h-10 w-10 rounded-lg border object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                              {item.product?.productName || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              SL: {item.quantity} × {item.price.toLocaleString("vi-VN")} đ
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">Không có sản phẩm</span>
                    )}
                    {order.orderItems && order.orderItems.length > 3 && (
                      <div className="text-xs text-gray-500 pt-1">
                        +{order.orderItems.length - 3} sản phẩm khác
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        onRowSelect?.(order);
                        handleViewDetails(order);
                      }}
                    >
                      <Eye className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-xs">Xem tất cả</span>
                    </Button>
                  </div>
                </TableCell>

                <TableCell>
                  {getNetAmount(order).toLocaleString("vi-VN")} đ
                </TableCell>

                <ActionsOnTableOrder
                  order={order}
                  currentUi={currentUi}
                  onStatusChange={handleStatusChangeLocal}
                  handleViewDetails={handleViewDetails}
                  setOrderToDelete={setOrderToDelete}
                  onRowSelect={onRowSelect}
                  isUpdating={isUpdating}
                />
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Details dialog is rendered by parent (OrderManager) from its selectedOrder state */}

      <DialogConfirm
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDeleteOrder}
        title="Xác nhận hủy đơn hàng"
        description={`Bạn chắc muốn hủy đơn #${orderToDelete?.orderId}?`}
        confirmText="Hủy đơn"
        cancelText="Đóng"
        isLoading={isDeleting}
      />
    </div>
  );
}
