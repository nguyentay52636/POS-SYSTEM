import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { OrderItem } from '@/apis/orderApi';
import { Image as ImageIcon } from 'lucide-react';

interface DialogOrderProductProps {
  selectedOrderItems: OrderItem[];
  setSelectedOrderItems: (items: OrderItem[] | null) => void;
}

export default function DialogOrderProduct({
  selectedOrderItems,
  setSelectedOrderItems,
}: DialogOrderProductProps) {
  const [isOpen, setIsOpen] = useState(false);

  React.useEffect(() => {
    if (selectedOrderItems?.length) setIsOpen(true);
  }, [selectedOrderItems]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setSelectedOrderItems(null);
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {selectedOrderItems?.map((item) => (
            <div key={item.orderItemId} className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-24 h-24 flex items-center justify-center bg-green-100 rounded-md">
                <ImageIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-green-700">Mã SP: #{item.productId}</div>
                <div className="text-lg font-semibold">{item.productName}</div>
                <div className="text-sm text-green-600">Số lượng: {item.quantity}</div>
                <div className="text-sm text-green-600">
                  Giá: {item.price.toLocaleString('vi-VN')} đ
                </div>
              </div>
              <div className="text-lg font-semibold text-green-700">
                {(item.quantity * item.price).toLocaleString('vi-VN')} đ
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
