import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { SupplierForm } from '@/components/Admin/components/Supplier/components/Dialog/AddSupplier/SupplierForm'
import { ISupplier } from '@/types/types'
import { UpdateSupplierDTO } from '@/apis/supplierApi'

export interface DialogEditSupplierProps {
    isEditDialogOpen: boolean
    setIsEditDialogOpen: (open: boolean) => void
    selectedSupplier: ISupplier | null
    handleEditSupplier: (supplierId: number, data: UpdateSupplierDTO) => void | Promise<void>
}

export default function DialogEditSupplier({
    isEditDialogOpen,
    setIsEditDialogOpen,
    selectedSupplier,
    handleEditSupplier
}: DialogEditSupplierProps) {
    // Lưu supplier vào local state để tránh race condition
    const [currentSupplier, setCurrentSupplier] = useState<ISupplier | null>(null)

    useEffect(() => {
        if (isEditDialogOpen && selectedSupplier) {
            console.log("Setting currentSupplier:", selectedSupplier)
            setCurrentSupplier(selectedSupplier)
        }
    }, [isEditDialogOpen, selectedSupplier])

    const handleSubmit = async (data: UpdateSupplierDTO) => {
        console.log("DialogEditSupplier - currentSupplier:", currentSupplier)

        if (!currentSupplier) {
            console.error("currentSupplier is null")
            return
        }

        const supplierId = currentSupplier.supplierId

        console.log("DialogEditSupplier - supplierId:", supplierId)

        if (!supplierId) {
            console.error("supplierId is invalid:", currentSupplier)
            return
        }

        await handleEditSupplier(supplierId, data)
    }

    if (!currentSupplier) return null

    return (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-6xl! max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Chỉnh sửa nhà cung cấp: {currentSupplier.name}
                    </DialogTitle>
                </DialogHeader>
                <SupplierForm
                    supplier={currentSupplier}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsEditDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

