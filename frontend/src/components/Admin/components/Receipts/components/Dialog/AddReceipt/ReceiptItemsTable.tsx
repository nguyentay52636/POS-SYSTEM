import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react'
import type { IProduct } from '@/types/types'
import { formatPrice } from '@/utils/productUtils'

interface ReceiptItem {
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
}

interface ReceiptItemsTableProps {
    items: ReceiptItem[]
    products: IProduct[]
    onUpdateItem: (index: number, field: 'quantity' | 'unitPrice', value: number) => void
    onRemoveItem: (index: number) => void
}

export default function ReceiptItemsTable({
    items,
    products,
    onUpdateItem,
    onRemoveItem,
}: ReceiptItemsTableProps) {
    const getProductInfo = (productId: number): IProduct | undefined => {
        return products.find(p => p.productId === productId)
    }

    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)

    const validateQuantity = (value: number): number => {
        if (isNaN(value) || value < 1) return 1
        return Math.floor(value)
    }

    const validateUnitPrice = (value: number): number => {
        if (isNaN(value) || value <= 0) return 0.01 // Minimum valid value
        return value
    }

    const handleQuantityChange = (index: number, newValue: number) => {
        const validatedValue = validateQuantity(newValue)
        onUpdateItem(index, 'quantity', validatedValue)
    }

    const handleUnitPriceChange = (index: number, newValue: number) => {
        const validatedValue = validateUnitPrice(newValue)
        onUpdateItem(index, 'unitPrice', validatedValue)
    }

    const handleIncrementQuantity = (index: number, currentQuantity: number) => {
        handleQuantityChange(index, currentQuantity + 1)
    }

    const handleDecrementQuantity = (index: number, currentQuantity: number) => {
        if (currentQuantity > 1) {
            handleQuantityChange(index, currentQuantity - 1)
        }
    }

    return (
        <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="bg-orange-50">
                <CardTitle className="flex items-center gap-2 text-orange-700">
                    <ShoppingCart className="h-5 w-5" />
                    Danh sách sản phẩm nhập hàng
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-6xl! pt-6">
                {items.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        Chưa có sản phẩm nào trong phiếu nhập. Vui lòng chọn sản phẩm từ danh sách nhà cung cấp.
                    </div>
                ) : (
                    <>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mã SP</TableHead>
                                        <TableHead>Tên sản phẩm</TableHead>
                                        <TableHead className="w-32">Số lượng</TableHead>
                                        <TableHead className="w-40">Giá nhập</TableHead>
                                        <TableHead>Thành tiền</TableHead>
                                        <TableHead className="w-20">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, index) => {
                                        const product = getProductInfo(item.productId)
                                        return (
                                            <TableRow key={`${item.productId}-${index}`}>
                                                <TableCell className="font-medium">
                                                    {item.productId}
                                                </TableCell>
                                                <TableCell>
                                                    {product?.productName || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleDecrementQuantity(index, item.quantity)}
                                                            disabled={item.quantity <= 1}
                                                            className="h-8 w-8 p-0 border border-gray-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value) || 1
                                                                handleQuantityChange(index, value)
                                                            }}
                                                            onBlur={(e) => {
                                                                const value = parseInt(e.target.value) || 1
                                                                handleQuantityChange(index, value)
                                                            }}
                                                            className="w-20 text-center"
                                                        />
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleIncrementQuantity(index, item.quantity)}
                                                            className="h-8 w-8 p-0 border border-gray-200 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600"
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="1000"
                                                        value={item.unitPrice}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value) || 0
                                                            handleUnitPriceChange(index, value)
                                                        }}
                                                        onBlur={(e) => {
                                                            const value = parseFloat(e.target.value) || 0
                                                            handleUnitPriceChange(index, value)
                                                        }}
                                                        className="w-full"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-semibold text-green-700">
                                                    {formatPrice(item.subtotal)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => onRemoveItem(index)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex justify-end p-4 bg-gray-50 rounded-lg border">
                            <div className="text-lg font-semibold">
                                <span className="text-gray-700">Tổng tiền: </span>
                                <span className="text-green-700 text-xl">
                                    {formatPrice(totalAmount)}
                                </span>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
