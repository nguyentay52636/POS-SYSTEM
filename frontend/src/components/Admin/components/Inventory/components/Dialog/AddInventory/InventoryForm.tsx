"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Hash } from "lucide-react"
import { getProducts } from "@/apis/productApi"
import { IProduct, IInventory } from "@/types/types"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

// Zod validation schema
const inventorySchema = z.object({
    productId: z.number().min(1, "Vui lòng chọn sản phẩm"),
    quantity: z.number().min(0, "Số lượng không được âm"),
})

type InventoryFormData = z.infer<typeof inventorySchema>

interface InventoryFormProps {
    onSubmit: (data: IInventory) => void | Promise<void>
    onCancel: () => void
}

export function InventoryForm({ onSubmit, onCancel }: InventoryFormProps) {
    const [products, setProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                setError(null)
                const data = await getProducts()
                console.log('Fetched products:', data) // Debug log
                setProducts(data)
            } catch (error: any) {
                console.error('Error fetching products:', error)
                setError(error.response?.data?.message || error.message || 'Không thể tải danh sách sản phẩm')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm<InventoryFormData>({
        resolver: zodResolver(inventorySchema),
        defaultValues: {
            productId: undefined,
            quantity: 0,
        }
    })

    const onSubmitForm = async (data: InventoryFormData) => {
        await onSubmit(data as unknown as IInventory)
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 pt-4 rounded-lg">
            {/* Thông tin tồn kho */}
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Package className="h-5 w-5" />
                        Thông tin tồn kho
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="space-y-2">
                        <Label htmlFor="productId" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Sản phẩm *
                        </Label>
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}
                        <Select
                            onValueChange={(value) => setValue('productId', parseInt(value))}
                            disabled={loading || !!error}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={
                                    loading ? "Đang tải..." :
                                        error ? "Lỗi tải dữ liệu" :
                                            products.length === 0 ? "Không có sản phẩm" :
                                                "Chọn sản phẩm"
                                } />
                            </SelectTrigger>
                            <SelectContent>
                                {products.length === 0 && !loading && !error ? (
                                    <div className="p-2 text-center text-gray-500">
                                        Không có sản phẩm nào
                                    </div>
                                ) : (
                                    products.map((product) => (
                                        <SelectItem key={product.productId} value={product.productId?.toString() || ""}>
                                            {product.productName} (ID: {product.productId})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {errors.productId && (
                            <p className="text-sm text-red-600">{errors.productId.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity" className="flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Số lượng *
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            {...register("quantity", { valueAsNumber: true })}
                            placeholder="Nhập số lượng"
                        />
                        {errors.quantity && (
                            <p className="text-sm text-red-600">{errors.quantity.message}</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Hủy
                </Button>
                <Button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-800"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang xử lý..." : "Thêm mới"}
                </Button>
            </div>
        </form>
    )
}

