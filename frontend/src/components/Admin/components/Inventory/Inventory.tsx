import { PaginationProvider } from '@/context/PaginationContext'
import React from 'react'
import InventoryContent from './InventoryContent'

export default function Inventory() {
    return (
        <>
            <PaginationProvider>
                <InventoryContent />
            </PaginationProvider>
        </>
    )
}
