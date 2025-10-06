import { PaginationProvider } from '@/context/PaginationContext'
import React from 'react'
import ManagerProductContent from './ManagerProductContent'

export default function ManagerProduct() {
    return (
        <>
            <PaginationProvider>
                <ManagerProductContent />
            </PaginationProvider>
        </>
    )
}
