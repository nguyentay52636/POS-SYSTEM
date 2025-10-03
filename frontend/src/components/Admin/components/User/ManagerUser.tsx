import React from 'react'
import { PaginationProvider } from '@/context/PaginationContext'
import ManagerUserContent from './ManagerUserContent'

export default function ManagerUser() {
    return (
        <PaginationProvider>
            <ManagerUserContent />
        </PaginationProvider>
    )
}
