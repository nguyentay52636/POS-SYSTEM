"use client";

import React from 'react'
import { PaginationProvider } from '@/context/PaginationContext'
import EmployeesContent from './EmployeesContent'

export default function Employees() {
    return (
        <PaginationProvider>
            <EmployeesContent />
        </PaginationProvider>
    )
}
