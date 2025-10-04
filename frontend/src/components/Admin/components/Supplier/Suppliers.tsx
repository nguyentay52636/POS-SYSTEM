import { PaginationProvider } from '@/context/PaginationContext'
import React from 'react'
import SuppliersContent from './SuppliersContent'

export default function Suppliers() {
    return (
        <>
            <PaginationProvider>
                <SuppliersContent
                />
            </PaginationProvider>
        </>
    )
}
