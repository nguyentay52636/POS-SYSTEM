
import React from 'react'
import { PaginationProvider } from '@/context/PaginationContext'
import ManagerCustomerContent from './ManagerCustomerContent'
export default function CustomerManager() {
    return (
        <PaginationProvider>
            <ManagerCustomerContent />
        </PaginationProvider>
    )
}   
