import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Order, OrderItem } from "@/apis/orderApi";
import { Image as ImageIcon, User, Calendar, Package } from "lucide-react";
import ProductComponentViewDetails from "./ProductComponentViewDetails";

interface DialogViewDetailsProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
}

export default function DialogViewDetails({
  selectedOrder,
  setSelectedOrder,
}: DialogViewDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedOrder) setIsOpen(true);
  }, [selectedOrder]);

  const getStatusLabel = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "paid":
      case "approved":
        return "Đã duyệt";
      case "dahuy":
      case "canceled":
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "paid":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "dahuy":
      case "canceled":
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Gross = sum(quantity * price)
  const calculateTotalAmount = (items: OrderItem[]) =>
    items.reduce((s, i) => s + i.quantity * i.price, 0);

  // Tính các giá trị hiển thị
  const gross =
    selectedOrder ? calculateTotalAmount(selectedOrder.orderItems) : 0;
  const discount =
    selectedOrder && selectedOrder.promoId
      ? selectedOrder.discountAmount || 0
      : 0;
  const net = Math.max(gross - discount, 0);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setSelectedOrder(null);
      }}
    >
      <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-green-200 dark:border-green-700 pb-4">
          <DialogTitle className="text-green-800 dark:text-green-200 flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <span>Chi tiết đơn hàng #{selectedOrder?.orderId}</span>
          </DialogTitle>
        </DialogHeader>

        {selectedOrder && (
          <div className="space-y-6">
            {/* Thông tin KH & Đơn */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-600" />
                  <span>Thông tin khách hàng</span>
                </h3>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Khách hàng:</span>
                      <p className="font-medium">
                        {selectedOrder.customerName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Người tạo:</span>
                      <p className="font-medium">
                        {selectedOrder.userName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span>Thông tin đơn hàng</span>
                </h3>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Mã đơn:</span>
                      <p className="font-medium">#{selectedOrder.orderId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ngày đặt:</span>
                      <p className="font-medium">
                        {new Date(selectedOrder.orderDate).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Trạng thái:</span>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>

                    {/* ✅ Hiển thị Tạm tính / Giảm giá / Thành tiền */}
                    <div className="pt-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Tạm tính:</span>
                        <p className="font-medium">
                          {gross.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Giảm giá:</span>
                        <p className="font-medium text-red-600">
                          - {discount.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Thành tiền:
                        </span>
                        <p className="font-bold text-lg text-green-600">
                          {net.toLocaleString("vi-VN")} đ
                        </p>
                      </div>
                    </div>
                    {/* End Tổng tiền */}
                  </div>
                </div>
              </div>
            </div>
            <ProductComponentViewDetails selectedOrder={selectedOrder} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
