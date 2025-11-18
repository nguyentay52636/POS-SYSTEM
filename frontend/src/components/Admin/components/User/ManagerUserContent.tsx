"use client"
import { useCallback, useEffect, useMemo, useState } from 'react'
import HeaderManagerUser from './components/HeaderManagerUser'
import TableManagerUser from './components/TableManagerUser/TableManagerUser'
import PaginationManagerUser from './components/PaginationManagerUser'
import DialogAddUser from './components/DIalog/DialogAddUser'
import DialogEditUser from './components/DIalog/DIalogEditUser'
import DialogViewDetails from './components/DIalog/DIalogVIewDetails'
import DialogConfirmDelete from './components/DIalog/DIalogConfirmDelete'
import { getAllUsers } from '../../../../apis/userApi'
import { IUser } from '@/types/types'
import { usePagination } from '@/context/PaginationContext'

export default function ManagerUserContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<IUser[]>([])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    // Dialog states
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            const usersData = await getAllUsers()
            setUsers(usersData)
            setError(null)
        } catch (e: any) {
            setError("Không thể tải dữ liệu")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const { paginationState } = usePagination()

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

    const handleOpenAddDialog = () => {
        setIsAddDialogOpen(true)
    }

    // Handlers for table actions
    const handleView = (user: IUser) => {
        setSelectedUser(user)
        setIsViewDialogOpen(true)
    }

    const handleEdit = (user: IUser) => {
        setSelectedUser(user)
        setIsEditDialogOpen(true)
    }

    const handleDelete = (user: IUser) => {
        setSelectedUser(user)
        setIsDeleteDialogOpen(true)
    }

    const handleUserAdded = (newUser: IUser) => {
        setUsers((prev) => [newUser, ...prev])
    }

    const handleUpdateUser = (updatedUser: IUser) => {
        setUsers((prev) =>
            prev.map((user) => (user.user_id === updatedUser.user_id ? updatedUser : user))
        )
        setSelectedUser((prev) =>
            prev && prev.user_id === updatedUser.user_id ? updatedUser : prev
        )
    }

    const handleConfirmDelete = (deletedUserId: number) => {
        setUsers((prev) => prev.filter((user) => user.user_id !== deletedUserId))
        setSelectedUser((prev) =>
            prev && prev.user_id === deletedUserId ? null : prev
        )
    }

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
