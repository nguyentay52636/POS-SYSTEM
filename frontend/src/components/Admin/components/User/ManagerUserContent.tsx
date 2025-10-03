"use client"
import { useEffect, useMemo, useState } from 'react'
import { mockUsers } from '@/Mock/data'
import HeaderManagerUser from './components/HeaderManagerUser'
import TableManagerUser from './components/TableManagerUser/TableManagerUser'
import PaginationManagerUser from './components/PaginationManagerUser'
import { IUser } from '@/types/types'

export default function ManagerUserContent() {
    const [searchQuery, setSearchQuery] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [users, setUsers] = useState<IUser[]>([])

    useEffect(() => {
        try {
            setUsers(mockUsers)
        } catch (e: any) {
            setError("Không thể tải dữ liệu giả lập")
        } finally {
            setLoading(false)
        }
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
        <div className=" bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="p-6 space-y-8">
                <HeaderManagerUser handleAddAccount={handleAddAccount} />
                {error ? (
                    <div>Error</div>
                ) : (
                    <>
                        <TableManagerUser
                            users={filteredUsers}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                        <PaginationManagerUser totalItems={filteredUsers.length} />
                    </>
                )}
            </div>
        </div>
    )
}
