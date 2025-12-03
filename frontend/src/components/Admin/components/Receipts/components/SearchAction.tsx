import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Filter } from 'lucide-react'

interface SearchActionProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    statusFilter: string
    setStatusFilter: (status: string) => void
}

export default function SearchAction({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: SearchActionProps) {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Tìm kiếm theo mã phiếu, nhà cung cấp, ghi chú..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] dark:bg-gray-900/50 dark:border-gray-700 dark:text-white    dark:hover:bg-gray-900/50">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Lọc trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="pending">Đang chờ</SelectItem>
                                <SelectItem value="completed">Đã hoàn thành</SelectItem>
                                <SelectItem value="canceled">Đã hủy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

