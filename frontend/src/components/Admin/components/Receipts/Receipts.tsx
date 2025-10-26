import { PaginationProvider } from '@/context/PaginationContext'
import React from 'react'
import ReceiptsContent from './ReceiptsContent'

export default function Receipts() {
    return (
        <>
            <PaginationProvider>
                <ReceiptsContent />
            </PaginationProvider>
        </>
    )
}
