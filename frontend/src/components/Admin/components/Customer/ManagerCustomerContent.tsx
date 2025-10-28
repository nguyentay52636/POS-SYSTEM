"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import ManagerCustomerHeader from "./components/ManagerCustomerHeader";
import TableManagerCustomer from "./components/TableManagerCustomer";
import PaginationManagerCustomer from "./components/PaginationManagerCustomer";

// API thật
import {
  getCustomers,
  deleteCustomer,
  createCustomer,       // NEW
  updateCustomer,       // NEW
  type Customer,
  type CustomerInput,   // NEW
} from "@/apis/customerApi";

import CustomerFormDialog from "./components/CustomerFormDialog"; // NEW
import { Button } from "@/components/ui/button"; // NEW
import { Plus } from "lucide-react"; // NEW

export default function ManagerCustomerContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // NEW: dialog state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomers();
      setCustomers(res.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const q = searchQuery.toLowerCase().trim();
    return customers.filter((c) =>
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.phone || "").toLowerCase().includes(q) ||
      (c.address || "").toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const handleDelete = async (id: number) => {
    setRefreshing(true);
    try {
      await deleteCustomer(id);
      await loadData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Xoá khách hàng thất bại");
    } finally {
      setRefreshing(false);
    }
  };

  // NEW: mở dialog thêm
  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  // NEW: mở dialog sửa
  const handleEdit = (id: number) => {
    const c = customers.find((x) => x.customerId === id);
    if (!c) return;
    setEditing(c);
    setOpen(true);
  };

  // NEW: lưu form (tạo hoặc cập nhật)
  const handleSave = async (payload: CustomerInput) => {
    setRefreshing(true);
    try {
      if (editing?.customerId) {
        await updateCustomer(editing.customerId, payload);
      } else {
        await createCustomer(payload);
      }
      setOpen(false);
      await loadData();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Lưu khách hàng thất bại");
    } finally {
      setRefreshing(false);
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

        {/* NEW: nút thêm khách hàng (đặt ngay dưới header) */}
        <div className="flex justify-end">
          <Button
          className="bg-green-800  hover:bg-green-700 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={handleAdd} disabled={refreshing}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm khách hàng
          </Button>
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : (
          <>
            <TableManagerCustomer
              customers={filteredCustomers}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onEdit={handleEdit}
              onDelete={handleDelete}
              busy={refreshing}
            />

            <PaginationManagerCustomer totalItems={filteredCustomers.length} />
          </>
        )}

        {/* NEW: Dialog form */}
        <CustomerFormDialog
          open={open}
          onClose={() => setOpen(false)}
          onSave={handleSave}
          editing={editing}
          busy={refreshing}
        />
      </div>
    </div>
  );
}
