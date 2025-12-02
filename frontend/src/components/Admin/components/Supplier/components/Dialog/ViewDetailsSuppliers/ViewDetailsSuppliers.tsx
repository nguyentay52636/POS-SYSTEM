import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin, Calendar, Edit, ShoppingCart } from 'lucide-react'
import { ISupplier, IProduct } from '@/types/types'
import { formatPrice } from '@/utils/productUtils'

interface ViewDetailsSuppliersProps {
    supplierProducts: IProduct[]
    isDetailDialogOpen: boolean
    setIsDetailDialogOpen: (open: boolean) => void
    selectedSupplier: ISupplier | null
    setSelectedSupplier: (supplier: ISupplier | null) => void
    setIsEditDialogOpen: (open: boolean) => void
    setIsImportDialogOpen: (open: boolean) => void
}

export default function ViewDetailsSuppliers({
    supplierProducts,
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    selectedSupplier,
    setSelectedSupplier,
    setIsEditDialogOpen,
    setIsImportDialogOpen
}: ViewDetailsSuppliersProps) {
    if (!selectedSupplier) return null

    return (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
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
                                    className={
                                        selectedSupplier.trangThai === "active"
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                    }
                                >
                                    {selectedSupplier.trangThai === "active" ? "Hoạt động" : "Tạm ngưng"}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">Mã NCC:</span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                                            {selectedSupplier.supplierId}
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
                                        <span className="text-gray-700">Ngày tạo: {selectedSupplier.createdAt ? new Date(selectedSupplier.createdAt).toLocaleDateString() : "-"}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Available Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sản phẩm có thể cung cấp ({supplierProducts.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {supplierProducts.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Chưa có sản phẩm nào từ nhà cung cấp này</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {supplierProducts.map((product) => (
                                        <div key={product.productId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-space-between">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium text-gray-900">{product.productName}</h4>
                                                    <div className="text-sm text-gray-600">
                                                        <p>Mã SP: {product.productId}</p>
                                                        {product.barcode && <p>Barcode: {product.barcode}</p>}
                                                        <p>Giá bán: {formatPrice(product.price)}</p>
                                                        <p>Tồn kho: {product.unit}</p>
                                                    </div>
                                                    {product.category?.categoryName && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {product.category.categoryName}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.productName}
                                                        width={180}
                                                        height={100}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
