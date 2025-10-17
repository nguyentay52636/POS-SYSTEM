import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Promotion } from '@/apis/promotionsApi'

interface TableManagerPromotionsProps {
    filteredPromotions: Promotion[]
    handleViewDetail: (promotion: Promotion) => void
    handleEdit: (promotion: Promotion) => void
    handleDelete: (promotionId: number) => void
    getStatusBadge: (status: string) => React.ReactNode
}

export default function TableManagerPromotions({
    filteredPromotions,
    handleViewDetail,
    handleEdit,
    handleDelete,
    getStatusBadge
}: TableManagerPromotionsProps) {
    return (
        <Card className="bg-white">
            <CardHeader>
                <CardTitle>Danh sách khuyến mãi ({filteredPromotions.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto bg-white">
                    <Table className="bg-white">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã KM</TableHead>
                                <TableHead>Mã code</TableHead>
                                <TableHead>Mô tả</TableHead>
                                <TableHead>Loại giảm giá</TableHead>
                                <TableHead>Giá trị giảm</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead>Số lần sử dụng</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPromotions.map((promotion) => (
                                <TableRow key={promotion.promoId}>
                                    <TableCell className="font-medium">{promotion.promoId}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{promotion.promoCode}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-xs">
                                            <div className="text-sm text-gray-500 truncate">{promotion.description}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {promotion.discountType === 'percentage' ? 'Phần trăm' : 'Cố định'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                                            {promotion.discountType === 'percentage'
                                                ? `${promotion.discountValue}%`
                                                : `${promotion.discountValue.toLocaleString("vi-VN")}đ`}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>{new Date(promotion.startDate).toLocaleDateString("vi-VN")}</div>
                                            <div className="text-gray-500">
                                                đến {new Date(promotion.endDate).toLocaleDateString("vi-VN")}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <span className="font-medium">{promotion.usedCount}</span>
                                            <span className="text-gray-500">/{promotion.usageLimit}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(promotion.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewDetail(promotion)}
                                                className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(promotion)}
                                                className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => promotion.promoId && handleDelete(promotion.promoId)}
                                                className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
