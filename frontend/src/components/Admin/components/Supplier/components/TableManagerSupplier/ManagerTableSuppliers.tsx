import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Eye, Edit, Trash2, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ISupplier } from '@/types/types'


interface ManagerTableSuppliersProps {
    suppliers: ISupplier[]
    filteredSuppliers: ISupplier[]
    setSelectedSupplier: (supplier: ISupplier) => void
    setIsImportDialogOpen: (open: boolean) => void
    setIsDetailDialogOpen: (open: boolean) => void
    setIsEditDialogOpen: (open: boolean) => void
    handleDeleteSupplier: (supplierId: number) => void
}
export default function ManagerTableSuppliers({ suppliers, filteredSuppliers, setSelectedSupplier, setIsImportDialogOpen, setIsDetailDialogOpen, setIsEditDialogOpen, handleDeleteSupplier }: ManagerTableSuppliersProps) {
    return (
        <>
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Danh sách nhà cung cấp</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="">
                                    <TableHead className="font-semibold text-gray-900">Mã NCC</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Tên nhà cung cấp</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Liên hệ</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Địa chỉ</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Ngày tạo</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredSuppliers.map((supplier) => (
                                    <TableRow key={supplier.supplier_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            <span className="px-2 py-1 dark:text-white text-gray-800 rounded text-sm">
                                                {supplier.supplier_id}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium dark:text-white text-gray-900">{supplier.name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm dark:text-white text-gray-600">
                                                    <Phone className="h-3 w-3" />
                                                    {supplier.phone}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm dark:text-white text-gray-600">
                                                    <Mail className="h-3 w-3" />
                                                    {supplier.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-sm dark:text-white text-gray-600">
                                                <MapPin className="h-3 w-3" />
                                                <span className="truncate max-w-[200px]">{supplier.address}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="default"
                                                className="dark:bg-green-100 dark:text-green-800 bg-green-100 text-green-800 hover:bg-green-200"
                                            >
                                                Hoạt động
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="dark:text-white text-gray-600">{new Date(supplier?.createdAt || "").toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedSupplier(supplier)
                                                        setIsImportDialogOpen(true)
                                                    }}
                                                    className="dark:bg-green-50 dark:text-green-700 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                                                    disabled={false}
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedSupplier(supplier)
                                                        setIsDetailDialogOpen(true)
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedSupplier(supplier)
                                                        setIsEditDialogOpen(true)
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteSupplier(supplier.supplier_id)}
                                                    className="dark:text-red-600 dark:hover:text-red-700 dark:hover:bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-50"
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
