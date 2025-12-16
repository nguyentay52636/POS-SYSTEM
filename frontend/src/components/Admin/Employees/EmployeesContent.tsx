"use client";

import { useMemo, useState } from "react";
import TableEmployees from "./components/TableEmployees";
import PaginationEmployee from "./components/PaginationEmployee";
import DialogAddEmployee from "./components/Dialog/AddEmployee/DialogAddEmployee";

import { useUser } from "@/hooks/useUser";
import { usePagination } from "@/context/PaginationContext";
import { deleteUser } from "@/apis/userApi";
import { IUser } from "@/types/types";
import HeaderEmployee from "./components/HeaderEmployee";

export default function EmployeesContent() {
    const {
        users,
        loading,
        handleUserAdded,
        handleUpdateUser,
        handleConfirmDelete,
        refreshUsers,
    } = useUser();

    const { paginationState } = usePagination();
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<IUser | null>(null);

    // Filter Logic
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowerTerm = searchTerm.toLowerCase();
        return users.filter(
            (u) =>
                (u.full_name?.toLowerCase().includes(lowerTerm)) ||
                (u.username?.toLowerCase().includes(lowerTerm))
        );
    }, [users, searchTerm]);

    // Pagination Logic
    const paginatedUsers = useMemo(() => {
        const { currentPage, rowsPerPage } = paginationState;
        const start = (currentPage - 1) * rowsPerPage;
        return filteredUsers.slice(start, start + rowsPerPage);
    }, [filteredUsers, paginationState]);

    const handleAdd = () => {
        setEditingUser(null);
        setIsAddDialogOpen(true);
    };

    const handleEdit = (user: IUser) => {
        setEditingUser(user);
        setIsAddDialogOpen(true);
    };

    const handleDelete = async (user: IUser) => {
        try {
            await deleteUser(user.user_id);
            handleConfirmDelete(user.user_id);
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Không thể xóa nhân viên này");
        }
    };

    const handleSuccess = (data: IUser, isEdit: boolean) => {
        if (isEdit) {
            handleUpdateUser(data);
        } else {
            handleUserAdded(data);
        }
    };

    if (loading) {
        return (
            <div className="">
                <div className="p-6 space-y-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">
                                Đang tải danh sách nhân viên...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="p-6 space-y-8">
                <HeaderEmployee onAdd={handleAdd} />



                <TableEmployees
                    employees={paginatedUsers}
                    searchQuery={searchTerm}
                    setSearchQuery={setSearchTerm}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    busy={loading}
                />

                <PaginationEmployee totalItems={filteredUsers.length} />

                <DialogAddEmployee
                    open={isAddDialogOpen}
                    onClose={() => setIsAddDialogOpen(false)}
                    onSuccess={handleSuccess}
                    editingUser={editingUser}
                    busy={loading}
                />
            </div>
        </div>
    );
}
