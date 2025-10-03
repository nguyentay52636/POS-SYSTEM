import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Order, OrderItem } from '@/types/types';
import { Image as ImageIcon, User, MapPin, Calendar, CreditCard, Package } from 'lucide-react';

interface DialogViewDetailsProps {
    selectedOrder: Order | null;
    setSelectedOrder: (order: Order | null) => void;
}

export default function DialogViewDetails({
    selectedOrder,
    setSelectedOrder,
}: DialogViewDetailsProps) {
    const [isOpen, setIsOpen] = useState(false);

    // const getFullImageUrl = (path: string) => {
    //     if (!path) return '';
    //     if (/^https?:\/\//.test(path)) return path;
    //     const apiUrl = import.meta.env.VITE_API_URL as string;
    //     const baseUrl = apiUrl.replace(/\/api\/?$/, '');
    //     return `${baseUrl}${path}`;
    // };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = ''; // Clear the src on error
    };

    React.useEffect(() => {
        if (selectedOrder) {
            setIsOpen(true);
        }
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

    const calculateTotalAmount = (orderItems: OrderItem[]) => {
        return orderItems.reduce((total, item) => total + (item.quantity * item.price), 0);
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        setSelectedOrder(null);
                    }
                }}
            >
                <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto '>
                    <DialogHeader className="border-b border-green-200 dark:border-green-700 pb-4">
                        <DialogTitle className="text-green-800 dark:text-green-200 flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                                <Package className="h-4 w-4 text-white" />
                            </div>
                            <span>Chi tiết đơn hàng #{selectedOrder?.id}</span>
                        </DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className='space-y-6'>
                            {/* Thông tin đơn hàng */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {/* Thông tin khách hàng */}
                                <div className='space-y-4'>
                                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2'>
                                        <User className='h-5 w-5 text-green-600' />
                                        <span>Thông tin khách hàng</span>
                                    </h3>
                                    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700'>
                                        <div className='space-y-2'>
                                            <div>
                                                <span className='text-sm text-gray-500 dark:text-gray-400'>Email:</span>
                                                <p className='font-medium'>{selectedOrder.user?.email || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className='text-sm text-gray-500 dark:text-gray-400'>Họ tên:</span>
                                                <p className='font-medium'>{selectedOrder.user?.fullName || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className='text-sm text-gray-500 dark:text-gray-400'>Địa chỉ:</span>
                                                <p className='font-medium flex items-start space-x-1'>
                                                    <MapPin className='h-4 w-4 mt-0.5 text-green-600' />
                                                    <span>{selectedOrder.user?.address || 'N/A'}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin đơn hàng */}
                                <div className='space-y-4'>
                                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2'>
                                        <Calendar className='h-5 w-5 text-green-600' />
                                        <span>Thông tin đơn hàng</span>
                                    </h3>
                                    <div className='bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-200 dark:border-green-700'>
                                        <div className='space-y-2'>
                                            <div>
                                                <span className='text-sm text-gray-500 dark:text-gray-400'>Mã đơn hàng:</span>
                                                <p className='font-medium'>#{selectedOrder.id}</p>
                                            </div>
                                            <div>
                                                <span className='text-sm text-gray-500 dark:text-gray-400'>Ngày đặt:</span>
                                                <p className='font-medium'>
                                                    {new Date(selectedOrder.createdAt).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                            <div>
                                                <span className='text-sm text-gray-500 dark:text-gray-400'>Trạng thái:</span>
                                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                                                    {getStatusLabel(selectedOrder.status)}
                                                </div>
                                            </div>
                                            <div>
                                                <span className='text-sm text-gray-500 dark:text-gray-400'>Tổng tiền:</span>
                                                <p className='font-bold text-lg text-green-600 dark:text-green-400'>
                                                    {calculateTotalAmount(selectedOrder.orderItems).toLocaleString('vi-VN')} đ
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className='space-y-4'>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2'>
                                    <Package className='h-5 w-5 text-green-600' />
                                    <span>Danh sách sản phẩm ({selectedOrder.orderItems?.length || 0} sản phẩm)</span>
                                </h3>
                                <div className='space-y-3'>
                                    {selectedOrder.orderItems?.map((item) => (
                                        <div key={item.productId} className='flex items-center gap-4 p-4 border border-green-200 dark:border-green-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors'>
                                            <div className='w-20 h-20 flex items-center justify-center bg-green-100 dark:bg-green-800/30 rounded-md overflow-hidden border border-green-200 dark:border-green-600'>
                                                {item.product?.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        className='w-full h-full object-cover'
                                                        onError={handleImageError}
                                                        loading='lazy'
                                                        alt={item.product.name}
                                                    />
                                                ) : (
                                                    <div className='flex flex-col items-center justify-center text-green-400'>
                                                        <ImageIcon className='w-6 h-6 mb-1' />
                                                        <span className='text-xs'>No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='flex-1'>
                                                <div className='font-medium text-green-700 dark:text-green-300 text-sm'>Mã SP: #{item.productId}</div>
                                                <div className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{item.product?.name || 'Sản phẩm không xác định'}</div>
                                                <div className='flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400'>
                                                    <span>Số lượng: <span className='font-medium'>{item.quantity}</span></span>
                                                    <span>Giá: <span className='font-medium'>{item.price.toLocaleString('vi-VN')} đ</span></span>
                                                </div>
                                            </div>
                                            <div className='text-lg font-semibold text-green-700 dark:text-green-300'>
                                                {(item.quantity * item.price).toLocaleString('vi-VN')} đ
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}