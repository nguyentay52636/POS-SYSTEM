"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Calendar, DollarSign, FileText, Package, Plus, Trash2 } from "lucide-react"
import { CreateImportReceiptDTO } from "@/apis/importReceiptApi"
import { getAllSuppliers } from "@/apis/supplierApi"
import { getAllProducts } from "@/apis/inventoryApi"
import { ISupplier, IProduct } from "@/types/types"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Zod validation schema
const receiptSchema = z.object({
    supplier_id: z.number().min(1, "Vui lòng chọn nhà cung cấp"),
    user_id: z.number().min(1),
    import_date: z.string().min(1, "Vui lòng chọn ngày nhập"),
    total_amount: z.number().min(0, "Tổng tiền không được âm"),
    status: z.string().min(1, "Vui lòng chọn trạng thái"),
    note: z.string().optional(),
})

type ReceiptFormData = z.infer<typeof receiptSchema>

interface ReceiptFormProps {
    onSubmit: (data: CreateImportReceiptDTO) => void | Promise<void>
    onCancel: () => void
}

interface ReceiptItem {
    product_id: number
    quantity: number
    unit_price: number
    subtotal: number
}

export function ReceiptForm({ onSubmit, onCancel }: ReceiptFormProps) {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([])
    const [products, setProducts] = useState<IProduct[]>([])
    const [items, setItems] = useState<ReceiptItem[]>([])
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
    const [newItemQuantity, setNewItemQuantity] = useState<number>(1)
    const [newItemPrice, setNewItemPrice] = useState<number>(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppliersData, productsData] = await Promise.all([
                    getAllSuppliers(),
                    getAllProducts()
                ])
                setSuppliers(suppliersData)
                setProducts(productsData)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<ReceiptFormData>({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            user_id: 1, // TODO: Get from auth context
            import_date: new Date().toISOString().split('T')[0],
            status: 'pending',
            total_amount: 0,
        }
    })

    const addItem = () => {
        if (!selectedProductId || !newItemQuantity || !newItemPrice) return

        const product = products.find(p => p.product_id === selectedProductId)
        if (!product) return

        const newItem: ReceiptItem = {
            product_id: selectedProductId,
            quantity: newItemQuantity,
            unit_price: newItemPrice,
            subtotal: newItemQuantity * newItemPrice
        }

        setItems([...items, newItem])
        const newTotal = items.reduce((sum, item) => sum + item.subtotal, 0) + newItem.subtotal
        setValue('total_amount', newTotal)

        // Reset
        setSelectedProductId(null)
        setNewItemQuantity(1)
        setNewItemPrice(0)
    }

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index)
        setItems(newItems)
        const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0)
        setValue('total_amount', newTotal)
    }

    const onSubmitForm = async (data: ReceiptFormData) => {
        const receiptData: CreateImportReceiptDTO = {
            ...data,
            total_amount: items.reduce((sum, item) => sum + item.subtotal, 0),
            import_items: items
        }
        await onSubmit(receiptData)
    }

    const selectedProduct = products.find(p => p.product_id === selectedProductId)

    useEffect(() => {
        if (selectedProduct) {
            setNewItemPrice(selectedProduct.price)
        }
    }, [selectedProduct])

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 pt-4 rounded-lg">
            {/* Thông tin cơ bản */}
            <Card className="border-l-4 border-l-green-500">
                <CardHeader className="bg-green-50">
                    <CardTitle className="flex items-center gap-2 text-green-700">
                        <FileText className="h-5 w-5" />
                        Thông tin phiếu nhập
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="supplier_id" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Nhà cung cấp *
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('supplier_id', parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhà cung cấp" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((supplier) => (
                                        <SelectItem key={supplier.supplier_id} value={supplier.supplier_id.toString()}>
                                            {supplier.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.supplier_id && (
                                <p className="text-sm text-red-600">{errors.supplier_id.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="import_date" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Ngày nhập *
                            </Label>
                            <Input
                                id="import_date"
                                type="date"
                                {...register("import_date")}
                            />
                            {errors.import_date && (
                                <p className="text-sm text-red-600">{errors.import_date.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">
                                Trạng thái *
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('status', value)}
                                defaultValue="pending"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Đang chờ</SelectItem>
                                    <SelectItem value="completed">Đã hoàn thành</SelectItem>
                                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="note">
                            Ghi chú
                        </Label>
                        <Textarea
                            id="note"
                            {...register("note")}
                            placeholder="Nhập ghi chú nếu có"
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Danh sách sản phẩm */}
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="bg-blue-50">
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Package className="h-5 w-5" />
                        Danh sách sản phẩm
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    {/* Form thêm sản phẩm */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                            <Label>Sản phẩm</Label>
                            <Select
                                value={selectedProductId?.toString() || ""}
                                onValueChange={(value) => setSelectedProductId(parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn sản phẩm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.product_id} value={product.product_id.toString()}>
                                            {product.product_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Số lượng</Label>
                            <Input
                                type="number"
                                value={newItemQuantity}
                                onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 0)}
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Đơn giá</Label>
                            <Input
                                type="number"
                                value={newItemPrice}
                                onChange={(e) => {
                                    const price = parseFloat(e.target.value) || 0
                                    setNewItemPrice(price)
                                }}
                                min="0"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="button"
                                onClick={addItem}
                                className="w-full bg-green-700 hover:bg-green-800"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm
                            </Button>
                        </div>
                    </div>

                    {/* Bảng sản phẩm */}
                    {items.length > 0 && (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sản phẩm</TableHead>
                                        <TableHead>Số lượng</TableHead>
                                        <TableHead>Đơn giá</TableHead>
                                        <TableHead>Thành tiền</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, index) => {
                                        const product = products.find(p => p.product_id === item.product_id)
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{product?.product_name || 'N/A'}</TableCell>
                                                <TableCell>{item.quantity}</TableCell>
                                                <TableCell>{item.unit_price.toLocaleString('vi-VN')} VNĐ</TableCell>
                                                <TableCell className="font-semibold">{item.subtotal.toLocaleString('vi-VN')} VNĐ</TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeItem(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Tổng tiền */}
                    <div className="flex justify-end pt-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Tổng tiền:</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString('vi-VN')} VNĐ
                            </p>
                        </div>
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
                    className="bg-green-700 hover:bg-green-800"
                    disabled={isSubmitting || items.length === 0}
                >
                    {isSubmitting ? "Đang xử lý..." : "Thêm mới"}
                </Button>
            </div>
        </form>
    )
}

