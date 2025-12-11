"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"

export function PreviewTab() {

    const changes = [
        {
            id: 1,
            name: "iPhone 15 Pro Max",
            sku: "IP15PM-256",
            category: "Điện tử",
            oldProfit: 12,
            newProfit: 15,
            oldPrice: 28000000,
            newPrice: 28750000,
            impact: "positive",
        },
        {
            id: 2,
            name: "Samsung Galaxy S24",
            sku: "SGS24-128",
            category: "Điện tử",
            oldProfit: 16.7,
            newProfit: 15,
            oldPrice: 21000000,
            newPrice: 20700000,
            impact: "negative",
        },
        {
            id: 3,
            name: "Áo thun nam",
            sku: "ATN-001",
            category: "Thời trang",
            oldProfit: 50,
            newProfit: 15,
            oldPrice: 120000,
            newPrice: 92000,
            impact: "negative",
        },
        {
            id: 4,
            name: "Quần jean nữ",
            sku: "QJN-002",
            category: "Thời trang",
            oldProfit: 33.3,
            newProfit: 15,
            oldPrice: 200000,
            newPrice: 172500,
            impact: "negative",
        },
        {
            id: 5,
            name: "Nồi cơm điện",
            sku: "NCD-005",
            category: "Gia dụng",
            oldProfit: 20,
            newProfit: 15,
            oldPrice: 600000,
            newPrice: 575000,
            impact: "negative",
        },
    ]

    const handleConfirmUpdate = () => {

    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(value)
    }

    const totalPositive = changes.filter((c) => c.impact === "positive").length
    const totalNegative = changes.filter((c) => c.impact === "negative").length

    return (
        <Card className="border-border shadow-lg">
            <CardHeader className="bg-card border-b border-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="text-foreground">Xem trước thay đổi</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Kiểm tra các thay đổi trước khi áp dụng vào hệ thống
                        </CardDescription>
                    </div>
                    <Button onClick={handleConfirmUpdate} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Xác nhận cập nhật
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-border">
                        <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground mb-1">Tổng sản phẩm</div>
                            <div className="text-2xl font-bold text-foreground">{changes.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20">
                        <CardContent className="p-4">
                            <div className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">Tăng lợi nhuận</div>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{totalPositive}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
                        <CardContent className="p-4">
                            <div className="text-sm text-orange-700 dark:text-orange-400 mb-1">Giảm lợi nhuận</div>
                            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">{totalNegative}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold text-foreground">Sản phẩm</TableHead>
                                <TableHead className="font-semibold text-foreground">SKU</TableHead>
                                <TableHead className="font-semibold text-foreground">Danh mục</TableHead>
                                <TableHead className="font-semibold text-foreground text-center">Lợi nhuận cũ</TableHead>
                                <TableHead className="font-semibold text-foreground text-center w-8"></TableHead>
                                <TableHead className="font-semibold text-foreground text-center">Lợi nhuận mới</TableHead>
                                <TableHead className="font-semibold text-foreground text-right">Giá cũ</TableHead>
                                <TableHead className="font-semibold text-foreground text-center w-8"></TableHead>
                                <TableHead className="font-semibold text-foreground text-right">Giá mới</TableHead>
                                <TableHead className="font-semibold text-foreground text-center">Ảnh hưởng</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {changes.map((change) => (
                                <TableRow key={change.id} className="hover:bg-muted/30">
                                    <TableCell className="font-medium text-foreground">{change.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        <Badge variant="outline" className="font-mono text-xs">
                                            {change.sku}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{change.category}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="font-mono">
                                            {change.oldProfit.toFixed(1)}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            className={
                                                change.impact === "positive"
                                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400"
                                            }
                                        >
                                            {change.newProfit.toFixed(1)}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">{formatCurrency(change.oldPrice)}</TableCell>
                                    <TableCell className="text-center">
                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    </TableCell>
                                    <TableCell className="text-right font-medium text-foreground">
                                        {formatCurrency(change.newPrice)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {change.impact === "positive" ? (
                                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Tăng
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                Giảm
                                            </Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
}
