"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { CreateImportReceiptDTO } from "@/apis/importReceiptApi"
import { IProduct } from "@/types/types"
import { useSupplier } from "@/hooks/useSupplier"
import { useDispatch, useSelector } from "react-redux"
import { selectAuth } from "@/redux/Slice/authSlice"
import { AppDispatch } from "@/redux/store"
import {
    addItem,
    updateItem,
    removeItem,
    addProducts,
    setSupplierProducts,
    setIsProductImportDialogOpen,
    resetReceipt,
    selectReceiptItems,
    selectReceiptProducts,
    selectSupplierProducts,
    selectIsProductImportDialogOpen,
} from "@/redux/Slice/ReceiptStore"
import DialogImportProduct from "../ProductImport/DialogImportProduct"
import BasicFormReceipt from "./BasicFormReceipt"
import ReceiptItemsTable from "./ReceiptItemsTable"
import { useEffect } from "react"

// Zod validation schema
const receiptSchema = z.object({
    supplierId: z.number().min(1, "Vui lòng chọn nhà cung cấp"),
    userId: z.number().min(1),
    status: z.string().min(1, "Vui lòng chọn trạng thái"),
    note: z.string().optional(),
})

type ReceiptFormData = z.infer<typeof receiptSchema>

interface ReceiptFormProps {
    onSubmit: (data: CreateImportReceiptDTO) => void | Promise<void>
    onCancel: () => void
}

export function ReceiptForm({ onSubmit, onCancel }: ReceiptFormProps) {
    const dispatch = useDispatch<AppDispatch>()

    // Redux state
    const { user } = useSelector(selectAuth)
    const items = useSelector(selectReceiptItems)
    const products = useSelector(selectReceiptProducts)
    const supplierProducts = useSelector(selectSupplierProducts)
    const isProductImportDialogOpen = useSelector(selectIsProductImportDialogOpen)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<ReceiptFormData>({
        resolver: zodResolver(receiptSchema),
        defaultValues: {
            userId: user?.userId || 0,
            status: 'pending',
        }
    })

    const { suppliers } = useSupplier()
    const supplierId = watch("supplierId")

    useEffect(() => {
        if (user?.userId) {
            setValue("userId", user.userId)
        }
    }, [user, setValue])

    // Reset receipt when component unmounts or form is cancelled
    useEffect(() => {
        return () => {
            // Optional: Reset on unmount if needed
            // dispatch(resetReceipt())
        }
    }, [dispatch])

    const handleAddItem = (product: IProduct) => {
        dispatch(addItem(product))
    }

    const handleUpdateItem = (index: number, field: 'quantity' | 'unitPrice', value: number) => {
        dispatch(updateItem({ index, field, value }))
    }

    const handleRemoveItem = (index: number) => {
        dispatch(removeItem(index))
    }

    const onSubmitForm = async (data: ReceiptFormData) => {
        // Validation: Check valid userId
        if (!user?.userId) {
            // Try to use data.userId if set, otherwise error
            if (!data.userId) {
                // Import toast if needed or just alert
                alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.")
                return
            }
        }

        // Validation: Check items validity
        const invalidItems = items.filter(item => item.quantity <= 0 || item.unitPrice <= 0)
        if (invalidItems.length > 0) {
            alert("Vui lòng kiểm tra lại sản phẩm: Số lượng và Đơn giá phải lớn hơn 0.")
            return
        }

        const receiptData: CreateImportReceiptDTO = {
            supplierId: data.supplierId,
            userId: user?.userId || data.userId,
            status: data.status,
            note: data.note,
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            }))
        }
        await onSubmit(receiptData)
        // Reset receipt after successful submission
        dispatch(resetReceipt())
    }

    return (
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 pt-4 rounded-lg">
            <BasicFormReceipt
                suppliers={suppliers}
                supplierId={supplierId}
                register={register}
                errors={errors}
                setValue={setValue}
                onOpenProductImportDialog={() => dispatch(setIsProductImportDialogOpen(true))}
                onProductsLoaded={(products) => dispatch(setSupplierProducts(products))}
            />

            <ReceiptItemsTable
                items={items}
                products={products}
                onUpdateItem={handleUpdateItem}
                onRemoveItem={handleRemoveItem}
            />
            {/* Dialog chọn sản phẩm */}
            <DialogImportProduct
                isOpen={isProductImportDialogOpen}
                onOpenChange={(open) => dispatch(setIsProductImportDialogOpen(open))}
                products={supplierProducts}
                onSelectProducts={(selected) => {
                    // Lưu thông tin sản phẩm để hiển thị trong bảng phiếu nhập
                    dispatch(addProducts(selected))

                    // Thêm/xử lý số lượng cho các sản phẩm đã chọn
                    selected.forEach(handleAddItem)

                    dispatch(setIsProductImportDialogOpen(false))
                }}
            />

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        dispatch(resetReceipt())
                        onCancel()
                    }}
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

