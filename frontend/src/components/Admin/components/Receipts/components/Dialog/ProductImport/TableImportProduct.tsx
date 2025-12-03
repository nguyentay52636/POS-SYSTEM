import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { IProduct } from '@/types/types'
import { formatPrice } from '@/utils/productUtils'

interface TableImportProductProps {
    products: IProduct[]
    onAddSelected?: (products: IProduct[]) => void
}

export default function TableImportProduct({ products, onAddSelected }: TableImportProductProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const enableSelection = Boolean(onAddSelected)

    const selectableProducts = useMemo(
        () => products.filter((product) => typeof product.productId === "number"),
        [products]
    )

    const allSelected =
        enableSelection &&
        selectableProducts.length > 0 &&
        selectableProducts.every((product) => selectedIds.includes(product.productId!))

    const selectedProducts = products.filter(
        (product) => product.productId && selectedIds.includes(product.productId)
    )

    const toggleSelect = (productId?: number) => {
        if (!enableSelection || productId === undefined) return

        const product = products.find((p) => p.productId === productId)
        if (!product) return

        setSelectedIds((prev) => {
            const exists = prev.includes(productId)
            const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId]

            // Khi tick chọn (chưa tồn tại trước đó) thì thêm trực tiếp vào phiếu
            if (!exists && onAddSelected) {
                onAddSelected([product])
            }

            return next
        })
    }

    const toggleSelectAll = () => {
        if (!enableSelection) return
        if (allSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(selectableProducts.map((product) => product.productId!) || [])
        }
    }

    return (
        <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Package className="h-5 w-5" />
                    Danh sách sản phẩm của nhà cung cấp
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-6xl! pt-6">
                {enableSelection && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="text-sm text-gray-700">
                            Đã chọn{" "}
                            <span className="font-semibold text-green-700">{selectedProducts.length}</span>{" "}
                            sản phẩm
                        </div>
                    </div>
                )}
                {products.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        Không có sản phẩm nào cho nhà cung cấp này
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {enableSelection && (
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={allSelected}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Chọn tất cả sản phẩm"
                                            />
                                        </TableHead>
                                    )}
                                    <TableHead>Mã SP</TableHead>
                                    <TableHead>Tên sản phẩm</TableHead>
                                    <TableHead>Barcode</TableHead>
                                    <TableHead>Giá bán</TableHead>
                                    <TableHead>Tồn kho</TableHead>
                                    <TableHead>Danh mục</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.productId}>
                                        {enableSelection && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={product.productId !== undefined && selectedIds.includes(product.productId)}
                                                    onCheckedChange={() => toggleSelect(product.productId)}
                                                    aria-label={`Chọn sản phẩm ${product.productName}`}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell>{product.productId}</TableCell>
                                        <TableCell>{product.productName}</TableCell>
                                        <TableCell>{product.barcode || '-'}</TableCell>
                                        <TableCell>{formatPrice(product.price)}</TableCell>
                                        <TableCell>{product.unit}</TableCell>
                                        <TableCell>{product.category?.categoryName || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

