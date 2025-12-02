import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { IProduct } from '@/types/types'
import { formatPrice } from '@/utils/productUtils'

interface TableImportProductProps {
    products: IProduct[]
    onAddProduct?: (product: IProduct) => void
}

export default function TableImportProduct({ products, onAddProduct }: TableImportProductProps) {
    return (
        <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Package className="h-5 w-5" />
                    Danh sách sản phẩm của nhà cung cấp
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                {products.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        Không có sản phẩm nào cho nhà cung cấp này
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã SP</TableHead>
                                    <TableHead>Tên sản phẩm</TableHead>
                                    <TableHead>Barcode</TableHead>
                                    <TableHead>Giá bán</TableHead>
                                    <TableHead>Tồn kho</TableHead>
                                    <TableHead>Danh mục</TableHead>
                                    {onAddProduct && <TableHead className="text-right">Thao tác</TableHead>}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.productId}>
                                        <TableCell>{product.productId}</TableCell>
                                        <TableCell>{product.productName}</TableCell>
                                        <TableCell>{product.barcode || '-'}</TableCell>
                                        <TableCell>{formatPrice(product.price)}</TableCell>
                                        <TableCell>{product.unit}</TableCell>
                                        <TableCell>{product.category?.categoryName || '-'}</TableCell>
                                        {onAddProduct && (
                                            <TableCell className="text-right">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-700 hover:bg-green-800"
                                                    type="button"
                                                    onClick={() => onAddProduct(product)}
                                                >
                                                    Thêm vào phiếu
                                                </Button>
                                            </TableCell>
                                        )}
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

