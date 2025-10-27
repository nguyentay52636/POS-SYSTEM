"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Hash } from "lucide-react"
import { UpdateInventoryDTO } from "@/apis/inventoryApi"
import { IInventory } from "@/types/types"
import { Input } from "@/components/ui/input"

// Zod validation schema
const editInventorySchema = z.object({
    quantity: z.number().min(0, "Số lượng không được âm"),
})

type EditInventoryFormData = z.infer<typeof editInventorySchema>

interface EditInventoryDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    selectedInventory: IInventory | null
    onSubmit: (data: UpdateInventoryDTO) => Promise<void>
}

export default function EditInventoryDialog({ isOpen, onOpenChange, selectedInventory, onSubmit }: EditInventoryDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EditInventoryFormData>({
        resolver: zodResolver(editInventorySchema),
        defaultValues: {
            quantity: selectedInventory?.quantity || 0,
        }
    })

    const onSubmitForm = async (data: EditInventoryFormData) => {
        await onSubmit(data)
        onOpenChange(false)
    }

    if (!selectedInventory) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Cập nhật tồn kho</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 pt-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="bg-blue-50">
                            <CardTitle className="text-blue-700">
                                Thông tin sản phẩm: {selectedInventory.product?.product_name || 'N/A'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
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
                                    defaultValue={selectedInventory.quantity}
                                />
                                {errors.quantity && (
                                    <p className="text-sm text-red-600">{errors.quantity.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-700 hover:bg-blue-800"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang xử lý..." : "Cập nhật"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

