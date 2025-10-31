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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  ChevronDown,
  ShoppingCart,
  Trash2,
  Check,
} from "lucide-react";
import type { Order } from "@/apis/orderApi";
import DialogViewDetails from "../Dialog/DialogViewDetails";
import DialogConfirm from "../Dialog/DialogConfirm";
import { toast } from "sonner";

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
}

/* ===========================
   Trạng thái: mapping + helpers
   =========================== */

const STATUS_OPTIONS = [
  { ui: "ChoDuyet", api: "pending", label: "Chờ Duyệt" },
  { ui: "DaDuyet", api: "paid", label: "Đã Duyệt" },
  { ui: "DaHuy", api: "canceled", label: "Đã Hủy" },
];

// Chuẩn hoá mọi biến thể về key UI
const toUiStatus = (s: string) => {
  const k = (s || "").toLowerCase();
  if (k === "pending" || k === "choduyet") return "ChoDuyet";
  if (k === "paid" || k === "approved" || k === "daduyet") return "DaDuyet";
  if (k === "canceled" || k === "cancelled" || k === "dahuy") return "DaHuy";
  return "ChoDuyet";
};

const getStatusLabel = (ui: string) =>
  STATUS_OPTIONS.find((o) => o.ui === ui)?.label || ui;

const getStatusBadgeClass = (ui: string) => {
  switch (ui) {
    case "ChoDuyet":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "DaDuyet":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "DaHuy":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
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
}: OrderTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
          {rows.map((order) => {
            const currentUi = toUiStatus(order.status);

            return (
              <TableRow key={order.orderId} className="hover:bg-green-50/50">
                <TableCell>
                  <Checkbox />
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
                  <div className="flex items-center gap-2">
                    <span>{order.orderItems?.length} sản phẩm</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4 text-green-600" />
                    </Button>
                  </div>
                </TableCell>

                <TableCell>
                  {getNetAmount(order).toLocaleString("vi-VN")} đ
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Badge className={getStatusBadgeClass(currentUi)}>
                          {getStatusLabel(currentUi)}
                        </Badge>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-44">
                      {STATUS_OPTIONS.map((opt) => {
                        const isActive = currentUi === opt.ui;
                        return (
                          <DropdownMenuItem
                            key={opt.ui}
                            onClick={() =>
                              handleStatusChangeLocal(order.orderId, opt.ui)
                            }
                            className="flex items-center gap-2"
                          >
                            <Check
                              className={`h-4 w-4 ${
                                isActive ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <span className={isActive ? "font-medium" : ""}>
                              {opt.label}
                            </span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                        <Eye className="h-4 w-4 text-green-600" />
                        <span className="ml-2">Xem chi tiết</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOrderToDelete(order)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-2">Hủy đơn hàng</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <DialogViewDetails
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
      />

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
