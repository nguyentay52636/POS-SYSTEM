import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Download, Percent, TrendingUp, Calendar, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
interface CardStasProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    statusFilter: string
    setStatusFilter: (value: string) => void
    stats: {
        total: number
        active: number
        expired: number
        avgDiscount: number
    }
}
export default function CardStas({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, stats }: CardStasProps) {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 bg-white">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-blue-800 flex items-center gap-2 text-sm font-medium">
                            <Package className="h-4 w-4" />
                            Tổng khuyến mãi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
                        <p className="text-blue-600 text-sm">Tất cả chương trình</p>
                    </CardContent>
                </Card>

                <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-green-800 flex items-center gap-2 text-sm font-medium">
                            <TrendingUp className="h-4 w-4" />
                            Đang hoạt động
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">{stats.active}</div>
                        <p className="text-green-600 text-sm">Chương trình hiện tại</p>
                    </CardContent>
                </Card>

                <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-red-800 flex items-center gap-2 text-sm font-medium">
                            <Calendar className="h-4 w-4" />
                            Hết hạn
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-900">{stats.expired}</div>
                        <p className="text-red-600 text-sm">Đã kết thúc</p>
                    </CardContent>
                </Card>

                <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-purple-800 flex items-center gap-2 text-sm font-medium">
                            <Percent className="h-4 w-4" />
                            Giảm giá TB
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-900">{stats.avgDiscount}%</div>
                        <p className="text-purple-600 text-sm">Trung bình</p>
                    </CardContent>
                </Card>
            </div>
            <Card className="bg-white">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Tìm kiếm theo tên chương trình hoặc mã khuyến mãi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="active">Đang hoạt động</SelectItem>
                                    <SelectItem value="inactive">Tạm ngưng</SelectItem>
                                    <SelectItem value="expired">Hết hạn</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 bg-transparent">
                                <Download className="h-4 w-4 mr-2" />
                                Xuất Excel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
