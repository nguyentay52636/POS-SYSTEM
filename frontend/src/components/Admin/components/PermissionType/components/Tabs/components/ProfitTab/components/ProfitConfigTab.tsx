"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit2, Save, X } from "lucide-react"
import { toast } from "sonner"
import PaginationProfit from "./PaginationProfit"
import { usePagination } from "@/context/PaginationContext"

interface Product {
    id: number
    name: string
    sku: string
    category: string
    costPrice: number
    salePrice: number
    profit: number
}

export function ProfitConfigTab() {
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editProfit, setEditProfit] = useState("")
    const { paginationState } = usePagination()

    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            name: "iPhone 15 Pro Max",
            sku: "IP15PM-256",
            category: "Điện tử",
            costPrice: 25000000,
            salePrice: 28000000,
            profit: 12,
        },
        {
            id: 2,
            name: "Samsung Galaxy S24",
            sku: "SGS24-128",
            category: "Điện tử",
            costPrice: 18000000,
            salePrice: 21000000,
            profit: 16.7,
        },
        {
            id: 3,
            name: "Áo thun nam",
            sku: "ATN-001",
            category: "Thời trang",
            costPrice: 80000,
            salePrice: 120000,
            profit: 50,
        },
        {
            id: 4,
            name: "Quần jean nữ",
            sku: "QJN-002",
            category: "Thời trang",
            costPrice: 150000,
            salePrice: 200000,
            profit: 33.3,
        },
        {
            id: 5,
            name: "Nồi cơm điện",
            sku: "NCD-005",
            category: "Gia dụng",
            costPrice: 500000,
            salePrice: 600000,
            profit: 20,
        },
        {
            id: 6,
            name: "Máy xay sinh tố",
            sku: "MXST-003",
            category: "Gia dụng",
            costPrice: 300000,
            salePrice: 380000,
            profit: 26.7,
        },
    ])

    const paginatedProducts = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return products.slice(startIndex, endIndex)
    }, [paginationState.currentPage, paginationState.rowsPerPage, products])

    const handleSelectRow = (id: number) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]))
    }

    const handleSelectAll = () => {
        if (selectedRows.length === products.length) {
            setSelectedRows([])
        } else {
            setSelectedRows(products.map((p) => p.id))
        }
    }

    const handleEdit = (product: Product) => {
        setEditingId(product.id)
        setEditProfit(product.profit.toString())
    }

    const handleSave = (id: number) => {
        setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, profit: Number.parseFloat(editProfit) } : p)))
        setEditingId(null)
        toast.success("Cập nhật thành công!", {
            description: "Đã cập nhật tỷ lệ lợi nhuận sản phẩm",
        })
    }

    const handleCancel = () => {
        setEditingId(null)
        setEditProfit("")
    }

    const handleBulkUpdate = () => {
        if (selectedRows.length === 0) {
            toast.error("Chưa chọn sản phẩm", {
                description: "Vui lòng chọn ít nhất một sản phẩm để cập nhật",
            })
            return
        }

        toast.success("Cập nhật hàng loạt thành công!", {
            description: `Đã cập nhật ${selectedRows.length} sản phẩm`,
        })
        setSelectedRows([])
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value)
    }

    return (
        <Card className="border-border shadow-lg">
            <CardHeader className="bg-card border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="text-foreground">Quản lý lợi nhuận theo sản phẩm</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Chọn và chỉnh sửa tỷ lệ lợi nhuận cho từng sản phẩm
                        </CardDescription>
                    </div>
                    {selectedRows.length > 0 && (
                        <Button onClick={handleBulkUpdate} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                            <Save className="h-4 w-4" />
                            Cập nhật {selectedRows.length} sản phẩm
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-12">
                                    <Checkbox checked={selectedRows.length === products.length} onCheckedChange={handleSelectAll} />
                                </TableHead>
                                <TableHead className="font-semibold text-foreground">Sản phẩm</TableHead>
                                <TableHead className="font-semibold text-foreground">SKU</TableHead>
                                <TableHead className="font-semibold text-foreground">Danh mục</TableHead>
                                <TableHead className="font-semibold text-foreground text-right">Giá vốn</TableHead>
                                <TableHead className="font-semibold text-foreground text-right">Giá bán</TableHead>
                                <TableHead className="font-semibold text-foreground text-right">Lợi nhuận (%)</TableHead>
                                <TableHead className="font-semibold text-foreground text-center">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedProducts.map((product) => (
                                <TableRow
                                    key={product.id}
                                    className={`hover:bg-muted/30 ${selectedRows.includes(product.id) ? "bg-emerald-50 dark:bg-emerald-950/20" : ""}`}
                                >
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedRows.includes(product.id)}
                                            onCheckedChange={() => handleSelectRow(product.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">{product.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {product.sku}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{product.category}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {formatCurrency(product.costPrice)}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {formatCurrency(product.salePrice)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {editingId === product.id ? (
                                            <Input
                                                type="number"
                                                value={editProfit}
                                                onChange={(e) => setEditProfit(e.target.value)}
                                                className="w-20 text-right"
                                                step="0.1"
                                                min="0"
                                                max="100"
                                            />
                                        ) : (
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 font-mono">
                                                {product.profit.toFixed(1)}%
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {editingId === product.id ? (
                                            <div className="flex gap-2 justify-center">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSave(product.id)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 h-8 w-8 p-0"
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    className="h-8 w-8 p-0 bg-transparent"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(product)} className="h-8 w-8 p-0">
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <PaginationProfit totalItems={products.length} className="mt-4" />
                </div>
            </CardContent>
        </Card>
    )
}
