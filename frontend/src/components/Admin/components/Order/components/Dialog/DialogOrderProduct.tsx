import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OrderItem } from '@/types/types';
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
        if (selectedOrderItems?.length) {
            setIsOpen(true);
        }
    }, [selectedOrderItems]);
    console.log(selectedOrderItems);

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        setSelectedOrderItems(null);
                    }
                }}
            >
                <DialogContent className='max-w-3xl'>
                    <DialogHeader className="border-b border-green-200 dark:border-green-700 pb-4">
                        <DialogTitle className="text-green-800 dark:text-green-200 flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-white" />
                            </div>
                            <span>Chi tiết sản phẩm</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className='grid gap-4'>
                        {selectedOrderItems?.map((item) => (
                            <div key={item.productId} className='flex items-center gap-4 p-4 border border-green-200 dark:border-green-700 rounded-lg bg-green-50/30 dark:bg-green-900/10 hover:bg-green-100/50 dark:hover:bg-green-900/20 transition-colors'>
                                <div className='w-24 h-24 flex items-center justify-center bg-green-100 dark:bg-green-800/30 rounded-md overflow-hidden border border-green-200 dark:border-green-600'>
                                    {item.product?.image ? (
                                        <img
                                            src={item.product.image}
                                            className='w-full h-full object-cover'
                                            onError={handleImageError}
                                            loading='lazy'
                                        />
                                    ) : (
                                        <div className='flex flex-col items-center justify-center text-green-400'>
                                            <ImageIcon className='w-8 h-8 mb-1' />
                                            <span className='text-xs'>No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className='flex-1'>
                                    <div className='font-medium text-green-700 dark:text-green-300'>Mã SP: #{item.productId}</div>
                                    <div className='text-lg font-semibold text-gray-900 dark:text-gray-100'>{item.product?.name}</div>
                                    <div className='text-sm text-green-600 dark:text-green-400'>Số lượng: {item.quantity}</div>
                                    <div className='text-sm text-green-600 dark:text-green-400'>
                                        Giá: {item.price.toLocaleString('vi-VN')} đ
                                    </div>
                                </div>
                                <div className='text-lg font-semibold text-green-700 dark:text-green-300'>
                                    {(item.quantity * item.price).toLocaleString('vi-VN')} đ
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}