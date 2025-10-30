import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Order, OrderItem } from '@/apis/orderApi';
import { Image as ImageIcon, User, Calendar, Package } from 'lucide-react';

interface DialogViewDetailsProps {
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
}

export default function DialogViewDetails({
  selectedOrder,
  setSelectedOrder,
}: DialogViewDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (selectedOrder) setIsOpen(true);
  }, [selectedOrder]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ChoDuyet':
        return 'Chờ Duyệt';
      case 'DaDuyet':
        return 'Đã Duyệt';
      case 'DaHuy':
        return 'Đã Hủy';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ChoDuyet':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'DaDuyet':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'DaHuy':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const calculateTotalAmount = (items: OrderItem[]) =>
    items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setSelectedOrder(null);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                      <p className="font-medium">{selectedOrder.customerName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Người tạo:</span>
                      <p className="font-medium">{selectedOrder.userName || 'N/A'}</p>
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
                        {new Date(selectedOrder.orderDate).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Trạng thái:</span>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusLabel(selectedOrder.status)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Tổng tiền:</span>
                      <p className="font-bold text-lg text-green-600">
                        {calculateTotalAmount(selectedOrder.orderItems).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sản phẩm */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-600" />
                <span>Danh sách sản phẩm ({selectedOrder.orderItems.length})</span>
              </h3>
              <div className="space-y-3">
                {selectedOrder.orderItems.map((it) => (
                  <div key={it.orderItemId} className="flex items-center gap-4 p-4 border rounded-lg">
                    {/* API không có ảnh: hiển thị icon + tên */}
                    <div className="w-20 h-20 flex items-center justify-center bg-green-100 rounded-md">
                      <ImageIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-green-700">SP: #{it.productId}</div>
                      <div className="text-lg font-semibold">{it.productName}</div>
                      <div className="text-sm text-gray-600">
                        SL: {it.quantity} • Giá: {it.price.toLocaleString('vi-VN')} đ
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-green-700">
                      {it.subtotal.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
