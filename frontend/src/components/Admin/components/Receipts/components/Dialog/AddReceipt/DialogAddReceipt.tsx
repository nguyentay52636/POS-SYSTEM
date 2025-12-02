import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
import { Plus } from 'lucide-react'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ReceiptForm } from './ReceiptForm'
import { CreateImportReceiptDTO } from '@/apis/importReceiptApi'

export interface DialogAddReceiptProps {
    isAddDialogOpen: boolean
    setIsAddDialogOpen: (open: boolean) => void
    handleAddReceipt: (receipt: CreateImportReceiptDTO) => void | Promise<void>
}

export default function DialogAddReceipt({ isAddDialogOpen, setIsAddDialogOpen, handleAddReceipt }: DialogAddReceiptProps) {
    const handleSubmit = async (data: CreateImportReceiptDTO) => {
        await handleAddReceipt(data)
        setIsAddDialogOpen(false)
    }

    return (
        <>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-green-700 hover:bg-green-800  dark:text-white!">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm phiếu nhập
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl! max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white!">Thêm phiếu nhập mới</DialogTitle>
                    </DialogHeader>
                    <ReceiptForm
                        onSubmit={handleSubmit}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

