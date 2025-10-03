import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { KhuyenMai } from '../ManagerPromotionsContent'
interface BasicProduct {
    maSanPham: string
    tenSanPham: string
    hinhAnh: string
    giaBan: number
}
interface TableManagerPromotionsProps {
    filteredPromotions: KhuyenMai[]
    getProductInfo: (maSanPham: string) => BasicProduct | undefined
    handleViewDetail: (promotion: KhuyenMai) => void
    handleEdit: (promotion: KhuyenMai) => void
    handleDelete: (maKhuyenMai: string) => void
    getStatusBadge: (status: string) => React.ReactNode
}
export default function TableManagerPromotions({ filteredPromotions, getProductInfo, handleViewDetail, handleEdit, handleDelete, getStatusBadge }: TableManagerPromotionsProps) {
    return (
        <>
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
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead>Tên chương trình</TableHead>
                                    <TableHead>Giảm giá</TableHead>
                                    <TableHead>Thời gian</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPromotions.map((promotion) => {
                                    const product = getProductInfo(promotion.maSanPham)
                                    return (
                                        <TableRow key={promotion.maKhuyenMai}>
                                            <TableCell className="font-medium">{promotion.maKhuyenMai}</TableCell>
                                            <TableCell>
                                                {product && (
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={product.hinhAnh || "/placeholder.svg"}
                                                            alt={product.tenSanPham}
                                                            className="w-10 h-10 rounded object-cover"
                                                        />
                                                        <div>
                                                            <div className="font-medium">{product.tenSanPham}</div>
                                                            <div className="text-sm text-gray-500">{product.giaBan.toLocaleString("vi-VN")}đ</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    <div className="font-medium">{promotion.tenKhachHangKhuyenMai}</div>
                                                    <div className="text-sm text-gray-500 truncate">{promotion.moTa}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-orange-100 text-orange-700 border-orange-300">
                                                    {promotion.phanTramGiamGia}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{new Date(promotion.ngayBatDau).toLocaleDateString("vi-VN")}</div>
                                                    <div className="text-gray-500">
                                                        đến {new Date(promotion.ngayKetThuc).toLocaleDateString("vi-VN")}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(promotion.trangThai)}</TableCell>
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
                                                        onClick={() => handleDelete(promotion.maKhuyenMai)}
                                                        className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

        </>
    )
}