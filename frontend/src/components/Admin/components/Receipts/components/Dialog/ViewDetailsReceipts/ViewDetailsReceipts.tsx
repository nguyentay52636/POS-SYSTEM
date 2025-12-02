import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IImportReceipt } from '@/types/types'
import { Building2, Calendar, DollarSign, Edit, FileText, Package, User } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ViewDetailsReceiptsProps {
    isDetailDialogOpen: boolean
    setIsDetailDialogOpen: (open: boolean) => void
    selectedReceipt: IImportReceipt | null
    setSelectedReceipt: (receipt: IImportReceipt | null) => void
    setIsEditDialogOpen: (open: boolean) => void
}

export default function ViewDetailsReceipts({
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    selectedReceipt,
    setSelectedReceipt,
    setIsEditDialogOpen
}: ViewDetailsReceiptsProps) {
    if (!selectedReceipt) return null

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Đang chờ</Badge>
            case 'completed':
                return <Badge className="bg-green-100 text-green-800 border-green-200">Đã hoàn thành</Badge>
            case 'cancelled':
                return <Badge className="bg-red-100 text-red-800 border-red-200">Đã hủy</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    return (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-6x! max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Chi tiết phiếu nhập #{selectedReceipt.importId || selectedReceipt.import_id}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Receipt Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>Thông tin phiếu nhập</span>
                                {getStatusBadge(selectedReceipt.status)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium text-gray-700">Nhà cung cấp:</span>
                                        <span className="text-gray-900">{selectedReceipt.supplierName || selectedReceipt.supplier?.name || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium text-gray-700">Người nhập:</span>
                                        <span className="text-gray-900">{selectedReceipt.userName || selectedReceipt.user?.full_name || selectedReceipt.userId || selectedReceipt.user_id}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium text-gray-700">Ngày nhập:</span>
                                        <span className="text-gray-900">{new Date(selectedReceipt.importDate || selectedReceipt.import_date || '').toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium text-gray-700">Tổng tiền:</span>
                                        <span className="text-blue-600 font-semibold">{formatPrice(selectedReceipt.totalAmount || selectedReceipt.total_amount || 0)}</span>
                                    </div>
                                </div>
                            </div>
                            {selectedReceipt.note && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-700 mb-2">Ghi chú:</p>
                                    <p className="text-gray-900">{selectedReceipt.note}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Import Items */}
                    {(selectedReceipt.importItems || selectedReceipt.import_items) && (selectedReceipt.importItems || selectedReceipt.import_items || []).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Danh sách sản phẩm
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sản phẩm</TableHead>
                                            <TableHead>Số lượng</TableHead>
                                            <TableHead>Đơn giá</TableHead>
                                            <TableHead>Thành tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(selectedReceipt.importItems || selectedReceipt.import_items || []).map((item) => (
                                            <TableRow key={item.importItemId || item.import_item_id}>
                                                <TableCell>{item.product?.productName || 'N/A'}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{(item.unitPrice || item.unit_price || 0).toLocaleString('vi-VN')} VNĐ</TableCell>
                                                <TableCell className="font-semibold">{item.subtotal.toLocaleString('vi-VN')} VNĐ</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDetailDialogOpen(false)
                                setSelectedReceipt(null)
                            }}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDetailDialogOpen(false)
                                setIsEditDialogOpen(true)
                            }}
                            className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

