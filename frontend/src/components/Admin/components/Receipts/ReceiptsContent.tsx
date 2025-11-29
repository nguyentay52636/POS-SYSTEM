"use client"

import StatsCard from "./components/StatsCard"
import SearchAction from "./components/SearchAction"
import TableManagerReceipts from "./components/TableManagerReceipts"
import PaginationReceipts from "./components/PaginationReceipts"
import HeaderManagerReceipts from "./components/HeaderManagerReceipts"
import { UpdateImportReceiptDTO } from "@/apis/importReceiptApi"
import ViewDetailsReceipts from "./components/Dialog/ViewDetailsReceipts/ViewDetailsReceipts"
import EditReceiptDialog from "./components/Dialog/EditReceiptDialog"
import { useImportReceipt } from "@/hooks/useImportReceipt"

export default function ReceiptsContent() {
    const {
        receipts,
        loading,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        selectedReceipt,
        setSelectedReceipt,
        isAddDialogOpen,
        setIsAddDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDetailDialogOpen,
        setIsDetailDialogOpen,
        filteredReceipts,
        paginatedReceipts,
        totalReceipts,
        pendingReceipts,
        completedReceipts,
        handleAddReceipt,
        handleEditReceipt,
        handleDeleteReceipt
    } = useImportReceipt()

    if (loading) {
        return (
            <div className=" p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    return (
        <div className=" p-6">
            <div className="mx-auto space-y-6">
                <HeaderManagerReceipts
                    isAddDialogOpen={isAddDialogOpen}
                    setIsAddDialogOpen={setIsAddDialogOpen}
                    handleAddReceipt={handleAddReceipt}
                />
                <StatsCard
                    totalReceipts={totalReceipts}
                    pendingReceipts={pendingReceipts}
                    completedReceipts={completedReceipts}
                />
                <SearchAction
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />
                <TableManagerReceipts
                    receipts={receipts}
                    filteredReceipts={paginatedReceipts}
                    setSelectedReceipt={setSelectedReceipt}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                    handleDeleteReceipt={handleDeleteReceipt}
                />

                <PaginationReceipts totalItems={filteredReceipts.length} />

                <ViewDetailsReceipts
                    isDetailDialogOpen={isDetailDialogOpen}
                    setIsDetailDialogOpen={setIsDetailDialogOpen}
                    selectedReceipt={selectedReceipt}
                    setSelectedReceipt={setSelectedReceipt}
                    setIsEditDialogOpen={setIsEditDialogOpen}
                />

                <EditReceiptDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    selectedReceipt={selectedReceipt}
                    onSubmit={async (data: UpdateImportReceiptDTO) => {
                        await handleEditReceipt(data)
                        setSelectedReceipt(null)
                    }}
                />
            </div>
        </div>
    )
}

