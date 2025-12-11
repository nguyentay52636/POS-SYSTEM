"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package } from "lucide-react"
import { IProduct } from "@/types/types"

export interface ProductSelectionProps {
    products: IProduct[]
    selectedProductId: number | undefined
    onChange: (productId: number) => void
}

export function ProductSelectionCard({ products, selectedProductId, onChange }: ProductSelectionProps) {
    const selectedProduct = products.find((p) => p.productId === selectedProductId)

    const handleValueChange = (value: string) => {
        onChange(parseInt(value, 10))
    }

    return (
        <Card className="border-green-200 bg-green-50/30 dark:bg-green-950/20 dark:border-green-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-green-800 dark:text-green-300 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Thông tin sản phẩm
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="productId" className="text-green-700 dark:text-green-300">
                        Chọn sản phẩm *
                    </Label>
                    <Select
                        value={selectedProductId?.toString() || ""}
                        onValueChange={handleValueChange}
                    >
                        <SelectTrigger className="border-green-300 focus:border-green-500">
                            <SelectValue placeholder="Chọn sản phẩm khuyến mãi" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product) => (
                                <SelectItem
                                    key={product.productId}
                                    value={product.productId?.toString() || ""}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.imageUrl || "/placeholder.svg"}
                                            alt={product.productName}
                                            className="w-8 h-8 rounded object-cover"
                                        />
                                        <div>
                                            <div className="font-medium">{product.productName}</div>
                                            <div className="text-sm text-gray-500">
                                                {product.price?.toLocaleString("vi-VN")}đ - {product.category?.categoryName}
                                            </div>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedProduct && (
                    <Card className="border-green-100 bg-white dark:bg-gray-800 dark:border-green-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedProduct.imageUrl || "/placeholder.svg"}
                                    alt={selectedProduct.productName}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-green-800 dark:text-green-300">
                                        {selectedProduct.productName}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedProduct.category?.categoryName} - {selectedProduct.supplier?.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                            {selectedProduct.price?.toLocaleString("vi-VN")}đ
                                        </Badge>
                                        <Badge variant="outline" className="border-green-300 dark:border-green-700">
                                            Đơn vị: {selectedProduct.unit}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>
    )
}

export default ProductSelectionCard
