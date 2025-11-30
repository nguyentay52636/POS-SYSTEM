"use client"
import { useMemo, useState } from 'react'
import HeaderManagerUser from './components/HeaderManagerUser'
import TableManagerUser from './components/TableManagerUser/TableManagerUser'
import PaginationManagerUser from './components/PaginationManagerUser'
import DialogAddUser from './components/DIalog/DialogAddUser'
import DialogEditUser from './components/DIalog/DIalogEditUser'
import DialogViewDetails from './components/DIalog/DIalogVIewDetails'
import DialogConfirmDelete from './components/DIalog/DIalogConfirmDelete'
import { usePagination } from '@/context/PaginationContext'
import { useUser } from '@/hooks/useUser'

export default function ManagerUserContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const { paginationState } = usePagination()

    const {
        users,
        loading,
        error,
        isAddDialogOpen,
        setIsAddDialogOpen,
        selectedUser,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isViewDialogOpen,
        setIsViewDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        handleOpenAddDialog,
        handleView,
        handleEdit,
        handleDelete,
        handleUserAdded,
        handleUpdateUser,
        handleConfirmDelete
    } = useUser()

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users
        const q = searchQuery.toLowerCase().trim()
        return users.filter((u) =>
            u.username.toLowerCase().includes(q) ||
            u.full_name.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        )
    }, [users, searchQuery])

    const paginatedUsers = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return filteredUsers.slice(startIndex, endIndex)
    }, [filteredUsers, paginationState.currentPage, paginationState.rowsPerPage])

    if (loading) {
        return (
            <div className="min-h-screen">
                <div className="p-6 space-y-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Đang tải danh sách tài khoản...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className=" ">
            <div className="p-6 space-y-8">
                <HeaderManagerUser onAddClick={handleOpenAddDialog} />
                {error ? (
                    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                ) : (
                    <>
                        <TableManagerUser
                            users={paginatedUsers}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                        <PaginationManagerUser totalItems={filteredUsers.length} />
                    </>
                )}

                {/* Dialogs */}
                <DialogAddUser
                    isAddDialogOpen={isAddDialogOpen}
                    setIsAddDialogOpen={setIsAddDialogOpen}
                    onUserAdded={handleUserAdded}
                />

                {selectedUser && (
                    <>
                        <DialogEditUser
                            user={selectedUser}
                            isEditDialogOpen={isEditDialogOpen}
                            setIsEditDialogOpen={setIsEditDialogOpen}
                            onUpdateUser={handleUpdateUser}
                        />

                        <DialogViewDetails
                            user={selectedUser}
                            isViewDialogOpen={isViewDialogOpen}
                            setIsViewDialogOpen={setIsViewDialogOpen}
                        />

                        <DialogConfirmDelete
                            user={selectedUser}
                            isDeleteDialogOpen={isDeleteDialogOpen}
                            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                            onConfirmDelete={handleConfirmDelete}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

