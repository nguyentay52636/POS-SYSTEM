import { useState, useCallback, useEffect } from 'react'
import { getAllUsers } from '@/apis/userApi'
import { IUser } from '@/types/types'

export const useUser = () => {
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
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

    const handleOpenAddDialog = () => {
        setIsAddDialogOpen(true)
    }

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

    return {
        users,
        loading,
        error,
        isAddDialogOpen,
        setIsAddDialogOpen,
        selectedUser,
        setSelectedUser,
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
        handleConfirmDelete,
        refreshUsers: fetchUsers
    }
}