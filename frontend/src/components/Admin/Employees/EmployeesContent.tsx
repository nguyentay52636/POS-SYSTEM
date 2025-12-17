"use client";

import { useMemo, useState } from "react";
import TableEmployees from "./components/TableEmployees";
import PaginationEmployee from "./components/PaginationEmployee";
import DialogAddEmployee from "./components/Dialog/AddEmployee/DialogAddEmployee";
import DialogViewDetails from "./components/Dialog/DialogViewDetails";

import { useEmployees } from "@/hooks/useEmployees";
import { usePagination } from "@/context/PaginationContext";
import { IEmployee } from "@/apis/employeeApi";
import HeaderEmployee from "./components/HeaderEmployee";

export default function EmployeesContent() {
    const {
        employees,
        isLoading,
        addEmployee,
        updateEmployeeInfo,
        updateStatus,
        filterStatus,
        setFilterStatus
    } = useEmployees();

    const { paginationState } = usePagination();
    // ...


    const [searchTerm, setSearchTerm] = useState("");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(null);

    const [viewEmployee, setViewEmployee] = useState<IEmployee | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

    // Filter Logic
    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return employees;
        const lowerTerm = searchTerm.toLowerCase();
        return employees.filter(
            (e) =>
                (e.fullName?.toLowerCase().includes(lowerTerm)) ||
                (e.phone?.includes(lowerTerm)) ||
                (e.rolePosition?.toLowerCase().includes(lowerTerm))
        );
    }, [employees, searchTerm]);

    // Pagination Logic
    const paginatedEmployees = useMemo(() => {
        const { currentPage, rowsPerPage } = paginationState;
        const start = (currentPage - 1) * rowsPerPage;
        return filteredEmployees.slice(start, start + rowsPerPage);
    }, [filteredEmployees, paginationState]);

    const handleAdd = () => {
        setEditingEmployee(null);
        setIsAddDialogOpen(true);
    };

    const handleEdit = (employee: IEmployee) => {
        setEditingEmployee(employee);
        setIsAddDialogOpen(true);
    };

    const handleView = (employee: IEmployee) => {
        setViewEmployee(employee);
        setIsViewDialogOpen(true);
    };



    const handleSuccess = async (data: IEmployee, isEdit: boolean) => {
        if (isEdit && editingEmployee?.employeeId) {
            await updateEmployeeInfo(editingEmployee.employeeId, data);
        } else {
            await addEmployee(data);
        }
        setIsAddDialogOpen(false); // Close dialog after success
    };

    if (isLoading) {
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
                    employees={paginatedEmployees}
                    searchQuery={searchTerm}
                    setSearchQuery={setSearchTerm}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    onEdit={handleEdit}
                    onView={handleView}
                    onStatusChange={(id, checked) => updateStatus(id, checked ? 'active' : 'inactive')}
                    busy={isLoading}
                />

                <PaginationEmployee totalItems={filteredEmployees.length} />

                <DialogAddEmployee
                    open={isAddDialogOpen}
                    onClose={() => setIsAddDialogOpen(false)}
                    onSuccess={handleSuccess}
                    editingUser={editingEmployee} // Note: Dialog might still expect editingUser prop name even if type is different
                    busy={isLoading}
                />

                <DialogViewDetails
                    employee={viewEmployee}
                    isOpen={isViewDialogOpen}
                    onClose={() => setIsViewDialogOpen(false)}
                />
            </div>
        </div>
    );
}
