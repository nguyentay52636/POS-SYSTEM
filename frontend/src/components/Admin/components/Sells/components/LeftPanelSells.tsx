import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/card'
import CardItemProduct from './ListItem/CartItemProduct'
import { IInventory, ICategory } from '@/types/types'
interface LeftPanelSellsProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedCategory: number | "all"
    setSelectedCategory: (value: number | "all") => void
    filteredInventories: IInventory[]
    mockCategories: ICategory[]
    addToCart: (inventory: IInventory) => void
}

export default function LeftPanelSells({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, filteredInventories, mockCategories, addToCart }: LeftPanelSellsProps) {
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
                                    {mockCategories
                                        .filter((cat): cat is ICategory & { categoryId: number } => typeof cat.categoryId === "number")
                                        .map((cat) => (
                                            <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-4 pb-4">
                        {filteredInventories.map((inventory) => (
                            <CardItemProduct key={inventory.inventoryId} inventory={inventory} addToCart={addToCart} />
                        ))}
                    </div>
                </ScrollArea>
            </div>

        </>
    )
}
