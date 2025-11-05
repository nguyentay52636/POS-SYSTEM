import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { FileText, Eye, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { IImportReceipt } from '@/types/types'

interface TableManagerReceiptsProps {
    receipts: IImportReceipt[]
    filteredReceipts: IImportReceipt[]
    setSelectedReceipt: (receipt: IImportReceipt) => void
    setIsDetailDialogOpen: (open: boolean) => void
    setIsEditDialogOpen: (open: boolean) => void
    handleDeleteReceipt: (receiptId: number) => void
}

export default function TableManagerReceipts({
    receipts,
    filteredReceipts,
    setSelectedReceipt,
    setIsDetailDialogOpen,
    setIsEditDialogOpen,
    handleDeleteReceipt
}: TableManagerReceiptsProps) {

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
        <>
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Danh sách phiếu nhập</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className=" dark:bg-gray-900/50">
                                    <TableHead className="font-semibold text-gray-900 dark:text-white">Mã phiếu</TableHead>
                                    <TableHead className="font-semibold text-gray-900 dark:text-white">Nhà cung cấp</TableHead>
                                    <TableHead className="font-semibold text-gray-900 dark:text-white">Người nhập</TableHead>
                                    <TableHead className="font-semibold text-gray-900 dark:text-white">Ngày nhập</TableHead>
                                    <TableHead className="font-semibold text-gray-900 dark:text-white">Tổng tiền</TableHead>
                                    <TableHead className="font-semibold text-gray-900 dark:text-white">Trạng thái</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900 dark:text-white">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredReceipts.map((receipt) => (
                                    <TableRow key={receipt.importId || receipt.import_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm dark:bg-gray-900/50 dark:text-white">
                                                #{receipt.importId || receipt.import_id}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {receipt.supplierName || receipt.supplier?.name || 'N/A'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 dark:text-white">
                                            {receipt.userName || receipt.user?.full_name || receipt.userId || receipt.user_id}
                                        </TableCell>
                                        <TableCell className="text-gray-600 dark:text-white">
                                            {new Date(receipt.importDate || receipt.import_date || '').toLocaleDateString('vi-VN')}
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-semibold text-blue-600 dark:text-white           ">{formatPrice(receipt.totalAmount || receipt.total_amount || 0)}</p>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(receipt.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedReceipt(receipt)
                                                        setIsDetailDialogOpen(true)
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedReceipt(receipt)
                                                        setIsEditDialogOpen(true)
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteReceipt(receipt.importId || receipt.import_id || 0)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
        </>
    )
}

