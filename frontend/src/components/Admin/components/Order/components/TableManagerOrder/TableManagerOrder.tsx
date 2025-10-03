import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MoreVertical, Info, Image as ImageIcon, Eye, ChevronDown, ShoppingCart, Trash2 } from 'lucide-react';
import { Order, OrderItem } from '@/types/types';
import DialogViewDetails from '../Dialog/DialogViewDetails';
import DialogConfirm from '../Dialog/DialogConfirm';
// import { updateOrder, deleteOrder } from '@/lib/apis/orderApi';
import { toast } from 'sonner';
import Link from 'next/link';

interface OrderTableProps {
    paginatedpayments: Order[];
    calculateTotalAmount: (orderItems: any[]) => number;
    handleViewDetails: (order: Order) => void;
    handleDelete: (id: number) => void;
    onStatusChange?: (orderId: number, newStatus: string) => void;
}

export default function OrderTable({
    paginatedpayments,
    calculateTotalAmount,
    handleViewDetails,
    handleDelete,
    onStatusChange,
}: OrderTableProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    const getFullImageUrl = (path: string, productName: string = '') => {
        if (!path || path.trim() === '') {
            const encodedName = encodeURIComponent(productName || 'Product');
            return `https://placehold.co/200x200/A27B5C/FFF?text=${encodedName}`;
        }
        if (/^https?:\/\//.test(path)) return path;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const baseUrl = apiUrl.replace(/\/api\/?$/, '');
        return `${baseUrl}${path}`;
    };

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

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            setIsUpdating(true);
            // await updateOrder(orderId, { status: newStatus });
            toast.success('Cập nhật trạng thái đơn hàng thành công!', {
                duration: 3000,
            });
            if (onStatusChange) {
                onStatusChange(orderId, newStatus);
            }
        } catch (error) {
            toast.error('Cập nhật trạng thái đơn hàng thất bại!', {
                duration: 3000,
            });
            console.error('Error updating order status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;

        try {
            setIsDeleting(true);
            // await deleteOrder(orderToDelete.id);
            handleDelete(orderToDelete.id);
            toast.success('Xóa đơn hàng thành công!', {
                duration: 3000,
            });
            setOrderToDelete(null);
        } catch (error) {
            toast.error('Xóa đơn hàng thất bại!', {
                duration: 3000,
            });
            console.error('Error deleting order:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleViewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
    };

    const handleDeleteClick = (order: Order) => {
        setOrderToDelete(order);
    };
    console.log(paginatedpayments);

    return (
        <div className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden border border-green-100 dark:border-green-800/30">
            <div className=" my-6 p-4 border-b">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Danh sách đơn hàng</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quản lý và theo dõi tất cả đơn hàng ({paginatedpayments.length} đơn hàng)</p>
                    </div>
                </div>
            </div>
            <Table>
                <TableHeader className="sticky top-0 bg-green-50/80 dark:bg-green-900/20 z-10">
                    <TableRow>
                        <TableHead className='w-[50px] font-semibold bg-green-50/80 dark:bg-green-900/20'>
                            <Checkbox />
                        </TableHead>
                        <TableHead className="font-semibold bg-green-50/80 dark:bg-green-900/20 text-green-800 dark:text-green-200">Mã hoá đơn</TableHead>
                        <TableHead className="font-semibold bg-green-50/80 dark:bg-green-900/20 text-green-800 dark:text-green-200">Khách hàng</TableHead>
                        <TableHead className="font-semibold bg-green-50/80 dark:bg-green-900/20 text-green-800 dark:text-green-200">Sản phẩm</TableHead>
                        <TableHead className="font-semibold bg-green-50/80 dark:bg-green-900/20 text-green-800 dark:text-green-200">Giá</TableHead>
                        <TableHead className="font-semibold bg-green-50/80 dark:bg-green-900/20 text-green-800 dark:text-green-200">Trạng thái</TableHead>
                        <TableHead className='w-[50px] font-semibold bg-green-50/80 dark:bg-green-900/20 text-green-800 dark:text-green-200'>Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedpayments.map((order) => (
                        <TableRow key={order.id} className="hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-colors border-b border-green-100/50 dark:border-green-800/20">
                            <TableCell>
                                <Checkbox />
                            </TableCell>
                            <TableCell>
                                <div>{order.id}</div>
                                <div className='text-sm text-muted-foreground'>
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div>{order.user?.email}</div>
                                <div className='text-sm text-muted-foreground'>{order.user?.address}</div>
                            </TableCell>
                            <TableCell>
                                <div className='flex items-center gap-2'>
                                    <span>{order.orderItems?.length} sản phẩm</span>
                                    <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleViewOrderDetails(order)}
                                        className='hover:bg-green-100 dark:hover:bg-green-900/20'
                                    >
                                        <Eye className='h-4 w-4 text-green-600' />
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell>{calculateTotalAmount(order.orderItems).toLocaleString('vi-VN')} đ</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant='ghost' size='sm' className='flex items-center gap-2'>
                                            <Badge
                                                className={
                                                    order.status === 'ChoDuyet'
                                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                        : order.status === 'DaDuyet'
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300'
                                                            : 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300'
                                                }
                                            >
                                                {getStatusLabel(order.status)}
                                            </Badge>
                                            <ChevronDown className='h-4 w-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <div className='flex flex-col gap-2 p-2'>
                                            <div className='flex items-center space-x-2'>
                                                <Checkbox
                                                    id='choduyet'
                                                    checked={order.status === 'ChoDuyet'}
                                                    onCheckedChange={() => handleStatusChange(order.id, 'ChoDuyet')}
                                                    disabled={isUpdating}
                                                />
                                                <label htmlFor='choduyet'>Chờ Duyệt</label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <Checkbox
                                                    id='daduyet'
                                                    checked={order.status === 'DaDuyet'}
                                                    onCheckedChange={() => handleStatusChange(order.id, 'DaDuyet')}
                                                    disabled={isUpdating}
                                                />
                                                <label htmlFor='daduyet'>Đã Duyệt</label>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <Checkbox
                                                    id='dahuy'
                                                    checked={order.status === 'DaHuy'}
                                                    onCheckedChange={() => handleStatusChange(order.id, 'DaHuy')}
                                                    disabled={isUpdating}
                                                />
                                                <label htmlFor='dahuy'>Đã Hủy</label>
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem
                                            onClick={() => handleViewOrderDetails(order)}
                                            className="flex items-center space-x-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
                                        >
                                            <Eye className="h-4 w-4 text-green-600" />
                                            <span>Xem chi tiết</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDeleteClick(order)}
                                            className="flex items-center space-x-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span>Xóa đơn hàng</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
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
                title="Xác nhận xóa đơn hàng"
                description={`Bạn có chắc chắn muốn xóa đơn hàng #${orderToDelete?.id}? Hành động này không thể hoàn tác.`}
                confirmText="Xóa đơn hàng"
                cancelText="Hủy"
                isLoading={isDeleting}
            />
        </div>
    );
}