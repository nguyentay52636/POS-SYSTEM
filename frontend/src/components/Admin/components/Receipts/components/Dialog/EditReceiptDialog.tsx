"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { UpdateImportReceiptDTO } from "@/apis/importReceiptApi"
import { IImportReceipt } from "@/types/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { getAllSuppliers } from "@/apis/supplierApi"
import { ISupplier } from "@/types/types"
import { Building2, Calendar } from "lucide-react"

// Zod validation schema
const editReceiptSchema = z.object({
    supplierId: z.number().optional(),
    status: z.string().optional(),
    note: z.string().optional(),
})

type EditReceiptFormData = z.infer<typeof editReceiptSchema>

interface EditReceiptDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    selectedReceipt: IImportReceipt | null
    onSubmit: (data: UpdateImportReceiptDTO) => Promise<void>
}

export default function EditReceiptDialog({ isOpen, onOpenChange, selectedReceipt, onSubmit }: EditReceiptDialogProps) {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([])

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const data = await getAllSuppliers()
                setSuppliers(data)
            } catch (error) {
                console.error('Error fetching suppliers:', error)
            }
        }
        fetchSuppliers()
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<EditReceiptFormData>({
        resolver: zodResolver(editReceiptSchema),
        defaultValues: {
            supplierId: selectedReceipt?.supplierId || selectedReceipt?.supplier_id,
            status: selectedReceipt?.status,
            note: selectedReceipt?.note || '',
        }
    })

    useEffect(() => {
        if (selectedReceipt) {
            setValue('supplierId', selectedReceipt.supplierId || selectedReceipt.supplier_id)
            setValue('status', selectedReceipt.status)
            setValue('note', selectedReceipt.note || '')
        }
    }, [selectedReceipt, setValue])

    const onSubmitForm = async (data: EditReceiptFormData) => {
        await onSubmit(data)
        onOpenChange(false)
    }

    if (!selectedReceipt) return null

    const receiptId = selectedReceipt.importId || selectedReceipt.import_id
    const currentSupplierId = selectedReceipt.supplierId || selectedReceipt.supplier_id

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl!">
                <DialogHeader>
                    <DialogTitle>Cập nhật phiếu nhập #{receiptId}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 pt-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <Label htmlFor="supplierId" className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Nhà cung cấp
                                </Label>
                                <Select
                                    defaultValue={currentSupplierId?.toString()}
                                    onValueChange={(value) => setValue('supplierId', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn nhà cung cấp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((supplier) => (
                                            <SelectItem key={supplier.supplierId || supplier.supplierId} value={(supplier.supplierId || supplier.supplierId)?.toString() || ''}>
                                                {supplier.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">
                                    Trạng thái
                                </Label>
                                <Select
                                    defaultValue={selectedReceipt.status}
                                    onValueChange={(value) => setValue('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Đang chờ</SelectItem>
                                        <SelectItem value="completed">Đã hoàn thành</SelectItem>
                                        <SelectItem value="canceled">Đã hủy</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            className="bg-green-700 hover:bg-green-800"
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

