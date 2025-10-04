import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart } from 'lucide-react'
import { Plus } from 'lucide-react'
import { Barcode } from 'lucide-react'
import { Package } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'
interface ICategory {
    category_id: number
    category_name: string
    createdAt: string
    updatedAt: string
}
interface IProduct {
    product_id: number
    category_id: number
    supplier_id: number
    product_name: string
    barcode: string
    price: number
    unit: string
    createdAt: string
    updatedAt: string
    image?: string
    stock?: number
}

interface LeftPanelSellsProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedCategory: number | "all"
    setSelectedCategory: (value: number | "all") => void
    filteredProducts: IProduct[]
    mockCategories: ICategory[]
    addToCart: (product: IProduct) => void
}

export default function LeftPanelSells({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, filteredProducts, mockCategories, addToCart }: LeftPanelSellsProps) {
    return (
        <>
            <div className="flex-1 p-6 overflow-hidden flex flex-col bg-white">
                <Card className="mb-6 shadow-sm border border-green-200 bg-white">
                    <CardContent className="p-5">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    placeholder="Tìm kiếm sản phẩm theo tên hoặc mã vạch..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 h-11 text-sm border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                                />
                            </div>
                            <Select
                                value={selectedCategory.toString()}
                                onValueChange={(value) => setSelectedCategory(value === "all" ? "all" : Number(value))}
                            >
                                <SelectTrigger className="w-[200px] h-11 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        <span className="font-medium">Tất cả danh mục</span>
                                    </SelectItem>
                                    {mockCategories.map((cat) => (
                                        <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                                            {cat.category_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Hiển thị <span className="font-semibold text-green-700">{filteredProducts.length}</span> sản phẩm
                            </span>
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSearchTerm("")}
                                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Xóa tìm kiếm
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <ScrollArea className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-4 pb-4">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.product_id}
                                className="group cursor-pointer transition-all duration-200 border border-gray-200 hover:border-green-400 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden bg-white"
                                onClick={() => addToCart(product)}
                            >
                                <CardContent className="p-0">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                        <img
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.product_name}
                                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                                        />

                                        <div className="absolute top-2 right-2">
                                            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-gray-200">
                                                <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                                                    <Package className="h-3 w-3" />
                                                    {product.stock}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                            <div className="bg-white rounded-full p-3 shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                                                <Plus className="h-6 w-6 text-green-700" strokeWidth={2} />
                                            </div>
                                        </div>

                                        <div className="absolute bottom-2 left-2 bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                                            <span className="text-[10px] font-mono text-white flex items-center gap-1">
                                                <Barcode className="h-3 w-3" />
                                                {product.barcode}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-3 space-y-2">
                                        <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-gray-800 group-hover:text-green-700 transition-colors duration-200">
                                            {product.product_name}
                                        </h3>

                                        <div className="flex items-end justify-between gap-2 pt-1 border-t border-gray-100">
                                            <div className="flex-1">
                                                <p className="text-[10px] uppercase tracking-wide text-gray-500 mb-1 font-medium">
                                                    Giá bán
                                                </p>
                                                <div className="flex items-baseline gap-1">
                                                    <p className="text-lg font-bold text-green-700 leading-none">
                                                        {product.price.toLocaleString("vi-VN")}
                                                    </p>
                                                    <span className="text-xs font-medium text-gray-600">đ</span>
                                                </div>
                                            </div>
                                            <Badge className="text-xs font-medium px-2 py-1 bg-green-100 border border-green-200 text-green-800">
                                                /{product.unit}
                                            </Badge>
                                        </div>

                                        <div className="pt-2 border-t border-gray-100">
                                            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500 group-hover:text-green-700 transition-colors duration-200">
                                                <ShoppingCart className="h-3.5 w-3.5" />
                                                <span>Nhấn để thêm</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

        </>
    )
}
