import { PaginationProvider } from '@/context/PaginationContext'
import React from 'react'
import ManagerPromotionsContent from './ManagerPromotionsContent'

export default function ManagerPromotions() {
    return (
        <PaginationProvider>
            <ManagerPromotionsContent />
        </PaginationProvider>
    )
}
