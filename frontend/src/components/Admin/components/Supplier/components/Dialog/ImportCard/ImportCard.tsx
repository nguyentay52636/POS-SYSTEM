import React, { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Plus, Minus, Trash2, Loader2 } from 'lucide-react'
import { ISupplier, IProduct } from '@/types/types'
import { useProduct } from '@/hooks/useProduct'
import { formatPrice } from '@/utils/productUtils'

interface ImportCardProps {
    isImportDialogOpen: boolean
    setIsImportDialogOpen: (open: boolean) => void
    selectedSupplier: ISupplier | null
    setSelectedSupplier: (supplier: ISupplier | null) => void
    handleImportGoods: (data: {
        ngayNhap: string
        chiTietPhieuNhap: any[]
        tongTien: number
    }) => void
}

interface ImportItem {
    product: IProduct
    quantity: number
    price: number
}

export default function ImportCard({
    isImportDialogOpen,
    setIsImportDialogOpen,
    selectedSupplier,
    setSelectedSupplier,
    handleImportGoods
}: ImportCardProps) {
    const { products, loading: productsLoading } = useProduct()
    const [importDate, setImportDate] = useState(new Date().toISOString().split('T')[0])
    const [importItems, setImportItems] = useState<ImportItem[]>([])

    // Filter products by selected supplier
    const availableProducts = useMemo(() => {
        if (!selectedSupplier) return []
        const supplierId = selectedSupplier.supplierId
        return products.filter((product) => {
            const productSupplierId = product.supplierId || product.supplier?.supplierId
            return productSupplierId === supplierId
        })
    }, [products, selectedSupplier])

    const addProduct = (product: IProduct) => {
        const existingItem = importItems.find(item => item.product.productId === product.productId)
        if (existingItem) {
            setImportItems(items =>
                items.map(item =>
                    item.product.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            )
        } else {
            // Use price as import price (you might want to add a separate importPrice field)
            setImportItems([...importItems, { product, quantity: 1, price: product.price }])
        }
    }

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            setImportItems(items => items.filter(item => item.product.productId !== productId))
        } else {
            setImportItems(items =>
                items.map(item =>
                    item.product.productId === productId
                        ? { ...item, quantity }
                        : item
                )
            )
        }
    }

    const removeItem = (productId: number) => {
        setImportItems(items => items.filter(item => item.product.productId !== productId))
    }

    const calculateTotal = () => {
        return importItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const handleSubmit = () => {
        const importData = {
            ngayNhap: importDate,
            chiTietPhieuNhap: importItems.map(item => ({
                productId: item.product.productId,
                quantity: item.quantity,
                price: item.price
            })),
            tongTien: calculateTotal()
        }
        handleImportGoods(importData)
        setImportItems([])
    }

    if (!selectedSupplier) return null

    return (
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Nhập hàng từ: {selectedSupplier.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Import Date */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin nhập hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="importDate">Ngày nhập hàng</Label>
                                    <Input
                                        id="importDate"
                                        type="date"
                                        value={importDate}
                                        onChange={(e) => setImportDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Nhà cung cấp</Label>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <p className="font-medium">{selectedSupplier.name}</p>
                                        <p className="text-sm text-gray-600">{selectedSupplier.email}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Available Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Sản phẩm có thể nhập ({availableProducts.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {productsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-6 w-6 animate-spin text-green-700 mr-2" />
                                    <p className="text-gray-600">Đang tải sản phẩm...</p>
                                </div>
                            ) : availableProducts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">Không có sản phẩm nào từ nhà cung cấp này</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableProducts.map((product) => (
                                        <div key={product.productId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-gray-900">{product.productName}</h4>
                                                <div className="flex items-center justify-space-between p-2">
                                                    <div className="text-sm text-gray-600">
                                                        <p>Mã SP: {product.productId}</p>
                                                        {product.barcode && <p>Barcode: {product.barcode}</p>}
                                                        <p>Giá nhập: {formatPrice(product.price)}</p>
                                                        <p>Tồn kho: {product.unit}</p>
                                                        {product.category?.categoryName && (
                                                            <p>Danh mục: {product.category.categoryName}</p>
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
                                                <Button
                                                    size="sm"
                                                    onClick={() => addProduct(product)}
                                                    className="w-full"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Thêm vào phiếu nhập
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Import Items */}
                    {importItems.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Chi tiết phiếu nhập</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sản phẩm</TableHead>
                                            <TableHead>Số lượng</TableHead>
                                            <TableHead>Giá nhập</TableHead>
                                            <TableHead>Thành tiền</TableHead>
                                            <TableHead>Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {importItems.map((item) => (
                                            <TableRow key={item.product.productId}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{item.product.productName}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {item.product.productId}
                                                            {item.product.barcode && ` - ${item.product.barcode}`}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.product.productId!, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-12 text-center">{item.quantity}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.product.productId!, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => {
                                                            const newPrice = Number(e.target.value)
                                                            setImportItems(items =>
                                                                items.map(i =>
                                                                    i.product.productId === item.product.productId
                                                                        ? { ...i, price: newPrice }
                                                                        : i
                                                                )
                                                            )
                                                        }}
                                                        className="w-24"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {(item.price * item.quantity).toLocaleString()} VNĐ
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => removeItem(item.product.productId!)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium">Tổng tiền:</span>
                                        <span className="text-xl font-bold text-green-600">
                                            {calculateTotal().toLocaleString()} VNĐ
                                        </span>
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
                                setIsImportDialogOpen(false)
                                setSelectedSupplier(null)
                                setImportItems([])
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={importItems.length === 0}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            Xác nhận nhập hàng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
