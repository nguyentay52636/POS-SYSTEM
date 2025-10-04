"use client"

import { useState } from "react"
import { ISupplier } from "@/types/types"
import StatsCard from "./components/StatsCard"
import SearchAction from "./components/TableManagerSupplier/SearchAction"
import ManagerTableSuppliers from "./components/TableManagerSupplier/ManagerTableSuppliers"
import { mockSuppliers, mockProducts } from "./components/TableManagerSupplier/data"
import PaginationSuppliers from "./components/TableManagerSupplier/PaginationSuppliers"

import HeaderManagerSupplier from "./components/HeaderManagerSupplier"
import ImportCard from "./components/Dialog/ImportCard/ImportCard"


export default function SuppliersContent() {
    const [suppliers, setSuppliers] = useState<ISupplier[]>(mockSuppliers)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

    const filteredSuppliers = suppliers.filter((supplier) => {
        const matchesSearch =
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.supplier_id.toString().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    const totalSuppliers = suppliers.length
    const activeSuppliers = suppliers.length // All suppliers are considered active for now
    const inactiveSuppliers = 0 // No inactive suppliers in current data

    const handleAddSupplier = (data: Partial<ISupplier>) => {
        const newSupplier: ISupplier = {
            ...(data as ISupplier),
            supplier_id: suppliers.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        setSuppliers([...suppliers, newSupplier])
        setIsAddDialogOpen(false)
    }

    const handleEditSupplier = (data: Partial<ISupplier>) => {
        setSuppliers(suppliers.map((s) => (s.supplier_id === selectedSupplier?.supplier_id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s)))
        setIsEditDialogOpen(false)
        setSelectedSupplier(null)
    }

    const handleDeleteSupplier = (supplierId: number) => {
        setSuppliers(suppliers.filter((s) => s.supplier_id !== supplierId))
    }

    const handleImportGoods = (data: {
        ngayNhap: string
        chiTietPhieuNhap: any[]
        tongTien: number
    }) => {
        console.log("Import goods data:", data)
        setIsImportDialogOpen(false)
        setSelectedSupplier(null)
    }

    return (
        <div className=" bg-gradient-to-br from-green-50 via-blue-50 to-white p-6">
            <div className=" mx-auto space-y-6">
                <HeaderManagerSupplier isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} handleAddSupplier={handleAddSupplier} />
                <StatsCard totalSuppliers={totalSuppliers} activeSuppliers={activeSuppliers} inactiveSuppliers={inactiveSuppliers} />
                <SearchAction searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
                <ManagerTableSuppliers suppliers={suppliers} filteredSuppliers={filteredSuppliers} setSelectedSupplier={setSelectedSupplier} setIsImportDialogOpen={setIsImportDialogOpen} setIsDetailDialogOpen={setIsDetailDialogOpen} setIsEditDialogOpen={setIsEditDialogOpen} handleDeleteSupplier={handleDeleteSupplier} />
                {/* <ViewDetailsSuppliers mockProducts={mockProducts} isDetailDialogOpen={isDetailDialogOpen} setIsDetailDialogOpen={setIsDetailDialogOpen} selectedSupplier={selectedSupplier} setSelectedSupplier={setSelectedSupplier} handleEditSupplier={handleEditSupplier} setIsEditDialogOpen={setIsEditDialogOpen} setIsImportDialogOpen={setIsImportDialogOpen} /> */}

                <PaginationSuppliers totalItems={filteredSuppliers.length} />

                <ImportCard isImportDialogOpen={isImportDialogOpen} setIsImportDialogOpen={setIsImportDialogOpen} selectedSupplier={selectedSupplier} setSelectedSupplier={setSelectedSupplier} handleImportGoods={handleImportGoods} />
            </div>
        </div>
    )
}
