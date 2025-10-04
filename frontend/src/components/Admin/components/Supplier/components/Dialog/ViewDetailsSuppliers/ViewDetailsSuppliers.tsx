import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin, Calendar, Edit, ShoppingCart } from 'lucide-react'
import { ISupplier, SanPham } from '@/types/types'

interface ViewDetailsSuppliersProps {
    mockProducts: SanPham[]
    isDetailDialogOpen: boolean
    setIsDetailDialogOpen: (open: boolean) => void
    selectedSupplier: ISupplier | null
    setSelectedSupplier: (supplier: ISupplier | null) => void
    handleEditSupplier: (data: Partial<ISupplier>) => void
    setIsEditDialogOpen: (open: boolean) => void
    setIsImportDialogOpen: (open: boolean) => void
}

export default function ViewDetailsSuppliers({
    mockProducts,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    selectedSupplier,
    setSelectedSupplier,
    handleEditSupplier,
    setIsEditDialogOpen,
    setIsImportDialogOpen
}: ViewDetailsSuppliersProps) {
    if (!selectedSupplier) return null

    return (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Chi tiết nhà cung cấp: {selectedSupplier.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Supplier Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>Thông tin nhà cung cấp</span>
                                <Badge
                                    variant="default"
                                    className="bg-green-100 text-green-800"
                                >
                                    Hoạt động
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">Mã NCC:</span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                                            {selectedSupplier.supplier_id}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">{selectedSupplier.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">{selectedSupplier.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">{selectedSupplier.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">Ngày tạo: {new Date(selectedSupplier.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Available Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sản phẩm có thể cung cấp</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {mockProducts.slice(0, 6).map((product) => (
                                    <div key={product.maSanPham} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-900">{product.tenSanPham}</h4>
                                            <div className="text-sm text-gray-600">
                                                <p>Mã SP: {product.maSanPham}</p>
                                                <p>Giá bán: {product.giaBan.toLocaleString()} VNĐ</p>
                                                <p>Tồn kho: {product.soLuongTon} {product.donVi}</p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {product.categoryName}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDetailDialogOpen(false)
                                setSelectedSupplier(null)
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
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            onClick={() => {
                                setIsDetailDialogOpen(false)
                                setIsImportDialogOpen(true)
                            }}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Nhập hàng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
