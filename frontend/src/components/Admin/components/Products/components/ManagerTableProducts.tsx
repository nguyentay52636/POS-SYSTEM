import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { IProduct } from '@/types/types'


interface ManagerTableProductsProps {
    products: IProduct[]
    formatPrice: (price: number) => string
    getStatusBadge: (status: string) => React.ReactNode
    handleEditProduct: (product: IProduct) => void
    handleDeleteProduct: (productId: string) => void
    handleViewDetails: (product: IProduct) => void
    handleViewEdit: (product: IProduct) => void
}



export default function ManagerTableProducts({ products, formatPrice, getStatusBadge, handleEditProduct, handleDeleteProduct }: ManagerTableProductsProps) {

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                            <TableHead className="font-semibold text-gray-900">Sản phẩm</TableHead>
                            <TableHead className="font-semibold text-gray-900">Mã SP</TableHead>
                            <TableHead className="font-semibold text-gray-900">Mã DM</TableHead>
                            <TableHead className="font-semibold text-gray-900">Mã TH</TableHead>
                            <TableHead className="font-semibold text-gray-900">Mã Loại</TableHead>
                            <TableHead className="font-semibold text-gray-900">Giá bán</TableHead>
                            <TableHead className="font-semibold text-gray-900">SL Tồn</TableHead>
                            <TableHead className="font-semibold text-gray-900">Đơn vị</TableHead>
                            <TableHead className="font-semibold text-gray-900">Xuất xứ</TableHead>
                            <TableHead className="font-semibold text-gray-900">Hạn sử dụng</TableHead>
                            <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                            <TableHead className="text-right font-semibold text-gray-900">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.product_id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.product_name}
                                                className="h-12 w-12 rounded-lg object-cover border shadow-sm"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{product.product_name}</p>
                                            <p className="text-sm text-gray-500">{product.category_id.category_name}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <code className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono border">
                                        {product.product_id}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <code className="bg-blue-50 px-2 py-1 rounded-md text-sm font-mono border-blue-200 text-blue-700">
                                        {product.category_id.category_name}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <code className="bg-purple-50 px-2 py-1 rounded-md text-sm font-mono border-purple-200 text-purple-700">
                                        {product.supplier_id.name}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <code className="bg-orange-50 px-2 py-1 rounded-md text-sm font-mono border-orange-200 text-orange-700">
                                        {product.supplier_id.name}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <p className="font-semibold text-gray-900">{formatPrice(product.price)}</p>
                                </TableCell>
                                <TableCell>
                                    <span className={`font-medium ${product.unit > 0 ? "text-gray-900" : "text-red-600"}`}>
                                        {product.unit}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">{product.unit}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600">{product.xuatXu}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600 font-mono">{product.hsd}</span>
                                </TableCell>
                                <TableCell>{getStatusBadge(product.status)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center   justify-end space-x-1">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
                                            <Eye className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-green-50"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <Edit className="h-4 w-4 text-green-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDeleteProduct(product.product_id.toString())}
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
        </>
    )
}
