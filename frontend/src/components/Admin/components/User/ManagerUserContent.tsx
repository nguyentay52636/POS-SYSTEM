"use client"
import { useEffect, useMemo, useState } from 'react'
import HeaderManagerUser from './components/HeaderManagerUser'
import TableManagerUser from './components/TableManagerUser/TableManagerUser'
import PaginationManagerUser from './components/PaginationManagerUser'
import DialogAddUser from './components/DIalog/DialogAddUser'
import DialogEditUser from './components/DIalog/DIalogEditUser'
import DialogViewDetails from './components/DIalog/DIalogVIewDetails'
import DialogConfirmDelete from './components/DIalog/DIalogConfirmDelete'
import { getAllUsers } from '../../../../apis/userApi'
import { IUser } from '@/types/types'

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

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const usersData = await getAllUsers()
                console.log(usersData)
                setUsers(usersData)
                setError(null)
            } catch (e: any) {
                setError("Không thể tải dữ liệu")
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users
        const q = searchQuery.toLowerCase().trim()
        return users.filter((u) =>
            u.username.toLowerCase().includes(q) ||
            u.full_name.toLowerCase().includes(q) ||
            u.role.toLowerCase().includes(q)
        )
    }, [users, searchQuery])

    const handleAddAccount = () => { }

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

    const handleUpdateUser = async () => {
        // Refresh the user list
        try {
            const usersData = await getAllUsers()
            setUsers(usersData)
        } catch (e: any) {
            console.error("Failed to refresh users:", e)
        }
    }

    const handleConfirmDelete = async () => {
        // Refresh the user list
        try {
            const usersData = await getAllUsers()
            setUsers(usersData)
        } catch (e: any) {
            console.error("Failed to refresh users:", e)
        }
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
                <HeaderManagerUser isAddDialogOpen={isAddDialogOpen} setIsAddDialogOpen={setIsAddDialogOpen} />
                {error ? (
                    <div>Error</div>
                ) : (
                    <>
                        <TableManagerUser
                            users={filteredUsers}
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
