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
            <div className="rounded-xl border border-gray-200 dark:bg-gray-900/50 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className=" border-b dark:bg-gray-900/50">
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Sản phẩm</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Mã SP</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Mã DM</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Mã TH</TableHead>
                            <TableHead className="font-semibold text-gray-900">Mã Loại</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Giá bán</TableHead>
                            <TableHead className="font-semibold text-gray-900">SL Tồn</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Đơn vị</TableHead>
                            <TableHead className="font-semibold text-gray-900">Xuất xứ</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Hạn sử dụng</TableHead>
                            <TableHead className="font-semibold text-gray-900 dark:text-white">Trạng thái</TableHead>
                            <TableHead className="text-right font-semibold text-gray-900 dark:text-white        ">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.product_id} className="hover:bg-gray-50/50 transition-colors dark:bg-gray-900/50">
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
                                            <p className="font-medium text-gray-900 dark:text-white ">{product.product_name}</p>
                                            <p className="text-sm text-gray-500 dark:text-white">{product.category_id.category_name}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <code className="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono border dark:bg-gray-900/50 dark:border-gray-700 dark:text-white">
                                        {product.product_id}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <code className="bg-blue-50 px-2 py-1 rounded-md text-sm font-mono border-blue-200 text-blue-700 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white">
                                        {product.category_id.category_name}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <code className="bg-purple-50 px-2 py-1 rounded-md text-sm font-mono border-purple-200 text-purple-700 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white">
                                        {product.supplier_id.name}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <code className="bg-orange-50 px-2 py-1 rounded-md text-sm font-mono border-orange-200 text-orange-700 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white">
                                        {product.supplier_id.name}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
                                </TableCell>
                                <TableCell>
                                    <span className={`font-medium ${product.unit > 0 ? "text-gray-900 dark:text-white" : "text-red-600 dark:text-white"}`}>
                                        {product.unit}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded dark:bg-gray-900/50 dark:border-gray-700 dark:text-white">{product.unit}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600 dark:text-white">{product.xuatXu}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-gray-600 font-mono dark:text-white">{product.hsd}</span>
                                </TableCell>
                                <TableCell>{getStatusBadge(product.status)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center   justify-end space-x-1 dark:text-white">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                                            <Eye className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/50"
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
