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
import { IProduct } from "@/types/types"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSupplier } from "@/hooks/useSupplier"
import TableImportProduct from "../ProductImport/TableImportProduct"
import DialogImportProduct from "../ProductImport/DialogImportProduct"

// Zod validation schema
const receiptSchema = z.object({
    supplierId: z.number().min(1, "Vui lòng chọn nhà cung cấp"),
    userId: z.number().min(1),
    importDate: z.string().min(1, "Vui lòng chọn ngày nhập"),
    totalAmount: z.number().min(0, "Tổng tiền không được âm"),
    status: z.string().min(1, "Vui lòng chọn trạng thái"),
    note: z.string().optional(),
})

type ReceiptFormData = z.infer<typeof receiptSchema>

interface ReceiptFormProps {
    onSubmit: (data: CreateImportReceiptDTO) => void | Promise<void>
    onCancel: () => void
}

interface ReceiptItem {
    productId: number
    quantity: number
    unitPrice: number
    subtotal: number
}

export function ReceiptForm({ onSubmit, onCancel }: ReceiptFormProps) {
    const [products, setProducts] = useState<IProduct[]>([])
    const [items, setItems] = useState<ReceiptItem[]>([])
    const [isProductImportDialogOpen, setIsProductImportDialogOpen] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<ReceiptFormData>({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            userId: 1, // TODO: Get from auth context
            importDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            totalAmount: 0,
        }
    })

    const { suppliers, loading: loadingSuppliers } = useSupplier()

    const addItem = (product: IProduct) => {
        if (!product.productId) return
        const quantity = 1
        const unitPrice = product.price

        const newItem: ReceiptItem = {
            productId: product.productId,
            quantity,
            unitPrice,
            subtotal: quantity * unitPrice
        }

        const newItems = [...items, newItem]
        setItems(newItems)
        const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0)
        setValue('totalAmount', newTotal)
    }

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index)
        setItems(newItems)
        const newTotal = newItems.reduce((sum, item) => sum + item.subtotal, 0)
        setValue('totalAmount', newTotal)
    }

    const onSubmitForm = async (data: ReceiptFormData) => {
        const receiptData: CreateImportReceiptDTO = {
            ...data,
            totalAmount: items.reduce((sum, item) => sum + item.subtotal, 0),
            importItems: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.subtotal
            }))
        }
        await onSubmit(receiptData)
    }

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
                <CardContent className="space-y-4 pt-6 max-w-6xl!">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="supplierId" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Nhà cung cấp *
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('supplierId', parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn nhà cung cấp" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers.map((supplier) => (
                                        <SelectItem
                                            key={supplier.supplierId}
                                            value={supplier.supplierId?.toString() || ""}
                                        >
                                            {supplier.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.supplierId && (
                                <p className="text-sm text-red-600">{errors.supplierId.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="importDate" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Ngày nhập *
                            </Label>
                            <Input
                                id="importDate"
                                type="date"
                                {...register("importDate")}
                            />
                            {errors.importDate && (
                                <p className="text-sm text-red-600">{errors.importDate.message}</p>
                            )}
                        </div>

                        {/* <div className="space-y-2">
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
                        </div> */}
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
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            className="bg-green-700"
                            onClick={() => setIsProductImportDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Thêm sản phẩm
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <TableImportProduct products={products} onAddProduct={addItem} />
            {/* Dialog chọn sản phẩm */}
            <DialogImportProduct
                isOpen={isProductImportDialogOpen}
                onOpenChange={setIsProductImportDialogOpen}
                onSelectProducts={(selected) => {
                    setProducts(selected)
                    setIsProductImportDialogOpen(false)
                }}
            />

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

