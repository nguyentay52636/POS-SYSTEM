"use client"
import { useEffect, useMemo, useState } from "react"

import mockEmployees from "@/Mock/data"
import ManagerCustomerHeader from "./components/ManagerCustomerHeader"
import TableManagerCustomer from "./components/TableManagerCustomer"
import PaginationManagerCustomer from "./components/PaginationManagerCustomer"
export default function ManagerCustomerContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [employees, setEmployees] = useState<any[]>([])

    useEffect(() => {
        try {
            setEmployees(mockEmployees)
        } catch (e: any) {
            setError("Không thể tải dữ liệu giả lập")
        } finally {
            setLoading(false)
        }
    }, [])

    const filteredEmployees = useMemo(() => {
        if (!searchQuery) return employees
        const q = searchQuery.toLowerCase().trim()
        return employees.filter((e) =>
            e.tenNhanVien.toLowerCase().includes(q) ||
            e.maNhanVien.toLowerCase().includes(q) ||
            e.soDienThoai.toLowerCase().includes(q) ||
            e.vaiTro.role.toLowerCase().includes(q)
        )
    }, [employees, searchQuery])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="p-6 space-y-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Đang tải danh sách nhân viên...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className=" bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="p-6 space-y-8">

                <ManagerCustomerHeader />

                {error ? (
                    <div>Error</div>
                ) : (
                    <>
                        <TableManagerCustomer
                            employees={filteredEmployees}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                        <PaginationManagerCustomer
                            totalItems={filteredEmployees.length}

                        />

                    </>
                )}




            </div>

            {/* <DialogAddEmployee
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                staff={selectedStaff}
            
            /> */}
        </div>
    )
}