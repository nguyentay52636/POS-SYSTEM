import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, ChevronDown, ShoppingCart, Trash2 } from 'lucide-react';
import type { Order } from '@/apis/orderApi';
import DialogViewDetails from '../Dialog/DialogViewDetails';
import DialogConfirm from '../Dialog/DialogConfirm';
import { toast } from 'sonner';

export interface OrderTableProps {
  paginatedpayments: Order[];
  calculateTotalAmount: (orderItems: any[]) => number;
  handleViewDetails: (order: Order) => void;
  handleDelete: (id: number) => void;
  onStatusChange?: (orderId: number, newStatus: string) => void;
  loading?: boolean;
}

const getStatusLabel = (status: string) =>
  status === 'ChoDuyet' ? 'Chờ Duyệt' : status === 'DaDuyet' ? 'Đã Duyệt' : status === 'DaHuy' ? 'Đã Hủy' : status;

export default function OrderTable({
  paginatedpayments,
  calculateTotalAmount,
  handleViewDetails,
  handleDelete,
  onStatusChange,
  loading,
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
      handleDelete(orderToDelete.orderId);
      toast.success('Xóa (hủy) đơn hàng thành công!', { duration: 3000 });
      setOrderToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

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
              Quản lý ({paginatedpayments.length} đơn){loading ? ' • đang tải...' : ''}
            </p>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader className="sticky top-0 bg-green-50/80 dark:bg-green-900/20 z-10">
          <TableRow>
            <TableHead className="w-[50px] font-semibold"><Checkbox /></TableHead>
            <TableHead className="font-semibold">Mã hoá đơn</TableHead>
            <TableHead className="font-semibold">Khách hàng</TableHead>
            <TableHead className="font-semibold">Sản phẩm</TableHead>
            <TableHead className="font-semibold">Giá</TableHead>
            <TableHead className="font-semibold">Trạng thái</TableHead>
            <TableHead className="w-[50px] font-semibold">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedpayments.map((order) => (
            <TableRow key={order.orderId} className="hover:bg-green-50/50">
              <TableCell><Checkbox /></TableCell>

              <TableCell>
                <div>#{order.orderId}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                </div>
              </TableCell>

              <TableCell>
                <div>{order.customerName}</div>
                <div className="text-sm text-muted-foreground">{order.userName}</div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{order.orderItems?.length} sản phẩm</span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                    <Eye className="h-4 w-4 text-green-600" />
                  </Button>
                </div>
              </TableCell>

              <TableCell>
                {calculateTotalAmount(order.orderItems).toLocaleString('vi-VN')} đ
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Badge>
                        {getStatusLabel(order.status)}
                      </Badge>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChangeLocal(order.orderId, 'ChoDuyet')}>Chờ Duyệt</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChangeLocal(order.orderId, 'DaDuyet')}>Đã Duyệt</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChangeLocal(order.orderId, 'DaHuy')}>Đã Hủy</DropdownMenuItem>
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
                    <DropdownMenuItem onClick={() => setOrderToDelete(order)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                      <span className="ml-2">Hủy đơn hàng</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DialogViewDetails selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />

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
