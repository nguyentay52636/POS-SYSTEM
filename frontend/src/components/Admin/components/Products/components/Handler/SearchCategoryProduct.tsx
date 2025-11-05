import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
interface SearchCategoryProductProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    categories: string[]
    statuses: string[]
    selectedStatus: string
    setSelectedStatus: (status: string) => void
}
export default function SearchCategoryProduct({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, statuses, selectedStatus, setSelectedStatus }: SearchCategoryProductProps) {
    return (
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 dark:bg-gray-900/50 rounded-xl border">
            <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                    placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white"
                />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-white border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                            {category === "all" ? "Tất cả danh mục" : category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48 bg-white border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                            {status === "all"
                                ? "Tất cả trạng thái"
                                : status === "active"
                                    ? "Đang bán"
                                    : status === "inactive"
                                        ? "Tạm ngưng"
                                        : "Hết hàng"}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
