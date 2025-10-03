"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package } from "lucide-react"
import type { SanPham } from "@/types/types"

export interface ProductSelectionProps {
    products: SanPham[]
    selectedProductId: string
    onChange: (productId: string) => void
}

export function ProductSelectionCard({ products, selectedProductId, onChange }: ProductSelectionProps) {
    const selectedProduct = products.find((p) => p.maSanPham === selectedProductId)

    return (
        <Card className="border-green-200 bg-green-50/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-green-800 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Thông tin sản phẩm
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="maSanPham" className="text-green-700">
                        Chọn sản phẩm *
                    </Label>
                    <Select value={selectedProductId} onValueChange={onChange}>
                        <SelectTrigger className="border-green-300 focus:border-green-500">
                            <SelectValue placeholder="Chọn sản phẩm khuyến mãi" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product) => (
                                <SelectItem key={product.maSanPham} value={product.maSanPham}>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={product.hinhAnh || "/placeholder.svg"}
                                            alt={product.tenSanPham}
                                            className="w-8 h-8 rounded object-cover"
                                        />
                                        <div>
                                            <div className="font-medium">{product.tenSanPham}</div>
                                            <div className="text-sm text-gray-500">
                                                {product.giaBan.toLocaleString("vi-VN")}đ - {product.maDanhMuc}
                                            </div>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedProduct && (
                    <Card className="border-green-100 bg-white">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedProduct.hinhAnh || "/placeholder.svg"}
                                    alt={selectedProduct.tenSanPham}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-green-800">{selectedProduct.tenSanPham}</h4>
                                    <p className="text-sm text-gray-600">
                                        {selectedProduct.maDanhMuc} - {selectedProduct.xuatXu}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                                            {selectedProduct.giaBan.toLocaleString("vi-VN")}đ
                                        </Badge>
                                        <Badge variant="outline" className="border-green-300">
                                            Tồn: {selectedProduct.soLuongTon}
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
