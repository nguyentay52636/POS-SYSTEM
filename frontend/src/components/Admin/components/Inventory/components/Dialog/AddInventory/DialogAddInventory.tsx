import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
import { Plus } from 'lucide-react'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InventoryForm } from './InventoryForm'
import { IInventory } from '@/types/types'

export interface DialogAddInventoryProps {
    isAddDialogOpen: boolean
    setIsAddDialogOpen: (open: boolean) => void
    handleAddInventory: (inventory: IInventory) => void | Promise<void>
}

export default function DialogAddInventory({ isAddDialogOpen, setIsAddDialogOpen, handleAddInventory }: DialogAddInventoryProps) {
    const handleSubmit = async (data: IInventory) => {
        await handleAddInventory(data)
        setIsAddDialogOpen(false)
    }

    return (
        <>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-blue-700 hover:bg-blue-800">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm tồn kho
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm tồn kho mới</DialogTitle>
                    </DialogHeader>
                    <InventoryForm
                        onSubmit={handleSubmit}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

