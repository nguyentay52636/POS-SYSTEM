"use client";

import { useMemo } from "react";
import ManagerCustomerHeader from "./components/ManagerCustomerHeader";
import TableManagerCustomer from "./components/TableManagerCustomer";
import PaginationManagerCustomer from "./components/PaginationManagerCustomer";
import CustomerFormDialog from "./components/CustomerFormDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePagination } from "@/context/PaginationContext";
import { useCustomer } from "@/hooks/useCustomer";
import { CustomerInput } from "@/apis/customerApi";

export default function ManagerCustomerContent() {
  const {
    customers,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCustomer,
    setSelectedCustomer,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    filteredCustomers,
    paginatedCustomers,
    handleAddCustomer,
    handleEditCustomer,
    handleDeleteCustomer,
  } = useCustomer();

  const { paginationState } = usePagination();

  // Mở dialog thêm
  const handleAdd = () => {
    setSelectedCustomer(null);
    setIsAddDialogOpen(true);
  };

  // Mở dialog sửa
  const handleEdit = (id: number) => {
    const customer = customers.find((c) => c.customerId === id);
    if (customer) {
      setSelectedCustomer(customer);
      setIsEditDialogOpen(true);
    }
  };

  // Lưu form (tạo hoặc cập nhật)
  const handleSave = async (payload: CustomerInput) => {
    try {
      if (selectedCustomer?.customerId) {
        await handleEditCustomer(selectedCustomer.customerId, payload);
      } else {
        await handleAddCustomer(payload);
      }
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      // Error đã được xử lý trong hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Đang tải danh sách khách hàng...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="p-6 space-y-8">
        <ManagerCustomerHeader />

        {/* Nút thêm khách hàng */}
        <div className="flex justify-end">
          <Button
            className="bg-green-800 hover:bg-green-700 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleAdd}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm khách hàng
          </Button>
        </div>

            <TableManagerCustomer
              customers={paginatedCustomers}
          searchQuery={searchTerm}
          setSearchQuery={setSearchTerm}
              onEdit={handleEdit}
          onDelete={handleDeleteCustomer}
          busy={loading}
            />

            <PaginationManagerCustomer totalItems={filteredCustomers.length} />

        {/* Dialog form thêm mới */}
        <CustomerFormDialog
          open={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            setSelectedCustomer(null);
          }}
          onSave={handleSave}
          editing={null}
          busy={loading}
        />

        {/* Dialog form chỉnh sửa */}
        <CustomerFormDialog
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedCustomer(null);
          }}
          onSave={handleSave}
          editing={selectedCustomer}
          busy={loading}
        />
      </div>
    </div>
  );
}
