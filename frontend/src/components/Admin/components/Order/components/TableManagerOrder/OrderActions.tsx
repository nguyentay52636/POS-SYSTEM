import React from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, Search, Filter, ShoppingCart } from 'lucide-react';

interface OrderActionsProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    exportBill: () => void;
}

export default function OrderActions({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    exportBill,
}: OrderActionsProps) {
    return (
        <div className="flex flex-col my-4 mx-4 md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-700 rounded-xl flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                            Quản lý Đơn hàng
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Quản lý và theo dõi tất cả đơn hàng trong hệ thống</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả</SelectItem>
                        <SelectItem value="ChoDuyet">Chờ Duyệt</SelectItem>
                        <SelectItem value="DaDuyet">Đã Duyệt</SelectItem>
                        <SelectItem value="DaHuy">Đã Hủy</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    className="bg-green-700 hover:bg-green-600 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={exportBill}
                >
                    <ArrowDownToLine className="h-4 w-4 mr-2" />
                    Xuất hoá đơn
                </Button>
            </div>
        </div>
    );
}