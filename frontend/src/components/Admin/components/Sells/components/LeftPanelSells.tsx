import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'
import CardItemProduct from './ListItem/CartItemProduct'
import { IInventory } from '@/types/types'
import { useInventory } from '@/hooks/useInventory'
import { useCategory } from '@/hooks/useCategory'

interface LeftPanelSellsProps {
    addToCart: (inventory: IInventory) => void
    refreshKey?: number
}

export default function LeftPanelSells({ addToCart, refreshKey }: LeftPanelSellsProps) {
    const { inventories, loading, fetchInventories } = useInventory()
    const { categories } = useCategory()
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<number | "all">("all")

    useEffect(() => {
        if (refreshKey !== undefined) {
            fetchInventories()
        }
    }, [refreshKey])

    const filteredInventories: IInventory[] = inventories.filter((inventory) => {
        const name =
            inventory.product?.productName ??
            inventory.productName ??
            ""
        const barcode = inventory.product?.barcode ?? ""
        const categoryId = inventory.product?.categoryId
        const quantity = inventory.quantity ?? 0

        // Chỉ hiển thị sản phẩm còn hàng trong kho (quantity > 0)
        const hasStock = quantity > 0

        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            barcode.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory =
            selectedCategory === "all" ||
            (categoryId !== undefined && categoryId === selectedCategory)

        return hasStock && matchesSearch && matchesCategory
    })

    return (
        <>
            <div className="flex-1 p-6 overflow-hidden flex flex-col ">
                <Card className="mb-6 shadow-sm border border-green-200 ">
                    <CardContent className="p-5">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    placeholder="Tìm kiếm sản phẩm theo tên hoặc mã vạch..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 h-11 text-sm border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all dark:text-white text-black"
                                />
                            </div>
                            <Select
                                value={selectedCategory.toString()}
                                onValueChange={(value) => setSelectedCategory(value === "all" ? "all" : Number(value))}
                            >
                                <SelectTrigger className="w-[200px] h-11 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:text-white text-black">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        <span className="font-medium dark:text-white text-black">Tất cả danh mục</span>
                                    </SelectItem>
                                    {categories
                                        .filter((cat) => typeof cat.categoryId === "number")
                                        .map((cat) => (
                                            <SelectItem key={cat.categoryId} value={cat.categoryId!.toString()}>
                                                {cat.categoryName}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-black dark:text-white">
                                Hiển thị <span className="font-semibold text-black dark:text-white">{filteredInventories.length}</span> sản phẩm
                            </span>
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSearchTerm("")}
                                    className="text-black hover:text-gray-700 hover:bg-gray-100 dark:text-white"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Xóa tìm kiếm
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <ScrollArea className="flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center space-y-3">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500 mx-auto"></div>
                                <p className="text-gray-500 dark:text-gray-400">Đang tải sản phẩm từ tồn kho...</p>
                            </div>
                        </div>
                    ) : filteredInventories.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center space-y-2">
                                <div className="text-4xl">📦</div>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Không tìm thấy sản phẩm</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Chưa có sản phẩm trong tồn kho"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-4 pb-4">
                            {filteredInventories.map((inventory) => (
                                <CardItemProduct key={inventory.inventoryId} inventory={inventory} addToCart={addToCart} />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>
        </>
    )
}
