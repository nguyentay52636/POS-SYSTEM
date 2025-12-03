"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { CreateImportReceiptDTO } from "@/apis/importReceiptApi"
import { IProduct } from "@/types/types"
import { useState } from "react"
import { useSupplier } from "@/hooks/useSupplier"
import TableImportProduct from "../ProductImport/TableImportProduct"
import DialogImportProduct from "../ProductImport/DialogImportProduct"
import BasicFormReceipt from "./BasicFormReceipt"

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
        watch,
    } = useForm<ReceiptFormData>({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            userId: 1, // TODO: Get from auth context
            importDate: new Date().toISOString().split('T')[0],
            status: 'pending',
            totalAmount: 0,
        }
    })

    const { suppliers } = useSupplier()
    const supplierId = watch("supplierId")
    const [supplierProducts, setSupplierProducts] = useState<IProduct[]>([])

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

        setItems((prev) => {
            const updated = [...prev, newItem]
            const newTotal = updated.reduce((sum, item) => sum + item.subtotal, 0)
            setValue('totalAmount', newTotal)
            return updated
        })
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
            <BasicFormReceipt
                suppliers={suppliers}
                supplierId={supplierId}
                register={register}
                errors={errors}
                setValue={setValue}
                onOpenProductImportDialog={() => setIsProductImportDialogOpen(true)}
                onProductsLoaded={setSupplierProducts}
            />

            <TableImportProduct
                products={products}
                onAddSelected={(selectedProducts) => {
                    selectedProducts.forEach(addItem)
                }}
            />
            {/* Dialog chọn sản phẩm */}
            <DialogImportProduct
                isOpen={isProductImportDialogOpen}
                onOpenChange={setIsProductImportDialogOpen}
                products={supplierProducts}
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

