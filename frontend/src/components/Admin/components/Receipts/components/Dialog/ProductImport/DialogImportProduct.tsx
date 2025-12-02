import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ChoiceProduct from './ChoiceProduct/ChoiceProduct'
import type { IProduct } from "@/types/types"

interface DialogImportProductProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSelectProducts: (products: IProduct[]) => void
}

export default function DialogImportProduct({ isOpen, onOpenChange, onSelectProducts }: DialogImportProductProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-7xl! max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chọn sản phẩm để nhập hàng</DialogTitle>
                </DialogHeader>
                <ChoiceProduct onSelectProducts={onSelectProducts} />
            </DialogContent>
        </Dialog>
    )
}

