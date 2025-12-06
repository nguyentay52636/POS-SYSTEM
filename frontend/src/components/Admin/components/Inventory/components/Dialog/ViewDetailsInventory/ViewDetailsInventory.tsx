import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Hash, Edit, Calendar } from 'lucide-react'
import { IInventory } from '@/types/types'

interface ViewDetailsInventoryProps {
    isDetailDialogOpen: boolean
    setIsDetailDialogOpen: (open: boolean) => void
    selectedInventory: IInventory | null
    setSelectedInventory: (inventory: IInventory | null) => void
    setIsEditDialogOpen: (open: boolean) => void
}

export default function ViewDetailsInventory({
    isDetailDialogOpen,
    setIsDetailDialogOpen,
    selectedInventory,
    setSelectedInventory,
    setIsEditDialogOpen
}: ViewDetailsInventoryProps) {
    if (!selectedInventory) return null

    return (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
            <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Chi tiết tồn kho
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Inventory Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>Thông tin tồn kho</span>
                                <Badge
                                    variant="default"
                                    className={
                                        selectedInventory.quantity === 0
                                            ? 'bg-red-100 text-red-800'
                                            : selectedInventory.quantity < 10
                                                ? 'bg-orange-100 text-orange-800'
                                                : 'bg-green-100 text-green-800'
                                    }
                                >
                                    {selectedInventory.quantity === 0
                                        ? 'Hết hàng'
                                        : selectedInventory.quantity < 10
                                            ? 'Tồn kho thấp'
                                            : 'Đủ hàng'}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">Mã tồn kho:</span>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                                            {selectedInventory.inventoryId}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">Mã sản phẩm: {selectedInventory.productId}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">Số lượng: {selectedInventory.quantity}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <img src={selectedInventory.product?.imageUrl} alt={selectedInventory.product?.productName} className="w-10 h-10 rounded-full" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="text-gray-700">
                                            Cập nhật: {selectedInventory.updatedAt ? new Date(selectedInventory.updatedAt).toLocaleDateString('vi-VN') : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Information */}
                    {selectedInventory.product && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Thông tin sản phẩm</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Tên sản phẩm</p>
                                        <p className="text-base font-semibold text-gray-900">{selectedInventory.product.productName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Giá bán</p>
                                        <p className="text-base font-semibold text-blue-600">
                                            {new Intl.NumberFormat('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }).format(selectedInventory.product.price || 0)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Danh mục</p>
                                        <p className="text-base text-gray-900">{selectedInventory.product.category?.categoryName || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Nhà cung cấp</p>
                                        <p className="text-base text-gray-900">{selectedInventory.product.supplier?.name || 'N/A'}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDetailDialogOpen(false)
                                setSelectedInventory(null)
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
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

