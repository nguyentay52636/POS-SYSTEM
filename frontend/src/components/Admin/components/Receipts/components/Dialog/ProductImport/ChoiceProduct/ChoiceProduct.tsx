"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import TableChoiceProduct from "./components/TableChoiceProduct"
import type { IProduct } from "@/types/types"
import { mockCategories } from "@/components/Admin/components/Products/mock/data"

interface ChoiceProductProps {
    products?: IProduct[]
    loading?: boolean
    onSelectProducts?: (products: IProduct[]) => void
}

export default function ChoiceProduct({ products = [], loading = false, onSelectProducts }: ChoiceProductProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedStatus, setSelectedStatus] = useState<string>("all")
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const categories = useMemo(
        () => ["all", ...mockCategories.map((cat) => cat.categoryName).filter((name): name is string => Boolean(name))],
        []
    )

    const STATUSES: { value: string; label: string }[] = [
        { value: "all", label: "Tất cả trạng thái" },
        { value: "active", label: "Đang bán" },
        { value: "inactive", label: "Ngừng bán" },
        { value: "out-of-stock", label: "Hết hàng" },
    ]

    const filteredProducts = useMemo(() => {
        const q = searchTerm.toLowerCase().trim()

        return products.filter((p: IProduct) => {
            const idStr = p.productId ? p.productId.toString() : ""
            const name = p.productName?.toLowerCase() || ""
            const barcode = p.barcode?.toLowerCase() || ""

            const matchesSearch =
                !q ||
                idStr.includes(q) ||
                name.includes(q) ||
                barcode.includes(q)

            const categoryName = p.category?.categoryName || ""
            const matchesCategory =
                selectedCategory === "all" || categoryName === selectedCategory

            const status = p.status || ""
            const matchesStatus =
                selectedStatus === "all" ||
                (selectedStatus === "out-of-stock"
                    ? p.unit === 0
                    : status === selectedStatus)

            return matchesSearch && matchesCategory && matchesStatus
        })
    }, [products, searchTerm, selectedCategory, selectedStatus])

    const handleToggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        )
    }

    const handleToggleSelectAll = () => {
        const ids = filteredProducts
            .map((p) => p.productId)
            .filter((id): id is number => typeof id === "number")

        setSelectedIds((prev) => {
            const allSelected = ids.length > 0 && ids.every((id) => prev.includes(id))
            return allSelected ? prev.filter((id) => !ids.includes(id)) : Array.from(new Set([...prev, ...ids]))
        })
    }

    const handleAddSelected = () => {
        if (!onSelectProducts) return
        const selectedProducts = products.filter(
            (p) => p.productId && selectedIds.includes(p.productId)
        )
        if (selectedProducts.length === 0) return
        onSelectProducts(selectedProducts)
    }

    return (
        <div className="space-y-4 w-full">
            <Card className="shadow-sm border-0">
                <CardHeader>
                    <CardTitle>Chọn sản phẩm để nhập hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto max-w-6xl!">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="w-full md:max-w-sm">
                            <Input
                                placeholder="Tìm kiếm theo mã, tên hoặc barcode..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat === "all" ? "Tất cả danh mục" : cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {onSelectProducts && (
                                <Button
                                    type="button"
                                    className="bg-green-700"
                                    onClick={handleAddSelected}
                                    disabled={selectedIds.length === 0}
                                >
                                    Thêm sản phẩm đã chọn
                                </Button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center  text-gray-500">
                            Đang tải dữ liệu sản phẩm...
                        </div>
                    ) : (
                        <TableChoiceProduct
                            products={filteredProducts}
                            selectedIds={selectedIds}
                            onToggleSelect={handleToggleSelect}
                            onToggleSelectAll={handleToggleSelectAll}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
