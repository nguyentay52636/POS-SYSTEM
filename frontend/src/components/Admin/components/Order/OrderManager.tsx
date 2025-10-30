"use client";
import React, { useState, useMemo, useEffect } from "react";
import OrderTable from "./components/TableManagerOrder/TableManagerOrder";
import DialogViewDetails from "./components/Dialog/DialogViewDetails";
import { toast } from "sonner";
import ActionOrder from "./components/TableManagerOrder/OrderActions";
import PaginationManagerOrder from "./components/PaginationManagerOrder";
import type { Order, OrderItem } from "@/apis/orderApi";

// 👉 Dùng đúng type + hàm từ orderApi.ts
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderItems,
  getOrderPayments,
} from "@/apis/orderApi";

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  // ====== Gọi API: danh sách đơn hàng ======
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders(); // GET /api/Order
      setOrders(res);               // res đã là Order[]
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Tổng tiền cho 1 đơn (nếu cần dùng ở bảng)
  const calculateTotalAmount = (orderItems: OrderItem[]) =>
    orderItems.reduce((total, item) => total + item.quantity * item.price, 0);

  // Lọc theo từ khóa & trạng thái, dựa trên field đúng của Order (orderApi.ts)
  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        o.orderId.toString().includes(q) ||
        o.userName.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ====== Handlers ======
  // Hủy đơn hàng — PATCH /api/Order/{id}/cancel
  const handleDelete = async (id: number) => {
    try {
      // await cancelOrder(id);
      await fetchOrders();
      toast.success("Đã hủy đơn hàng");
    } catch (error) {
      toast.error("Hủy đơn hàng thất bại");
      console.error("Error canceling order:", error);
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus); // PUT /Order/{id} + DTO đúng
      await fetchOrders();
      toast.success("Cập nhật trạng thái thành công");
    } catch (error: any) {
      console.error(
        "Update status error:",
        error?.response?.status,
        error?.config?.url,
        error?.response?.data || error?.message || error
      );
      toast.error("Cập nhật trạng thái thất bại");
      throw error;
    }
  };


  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gradient-to-br from-green-50/30 via-gray-50 to-green-100/30 dark:from-green-900/10 dark:via-gray-900 dark:to-green-800/10 min-h-screen">
      <div className="p-6 space-y-8">
        <ActionOrder
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          exportBill={() => {}}
        />

        <OrderTable
          paginatedpayments={paginatedOrders}
          calculateTotalAmount={calculateTotalAmount}
          handleViewDetails={handleViewDetails}
          handleDelete={handleDelete}
          onStatusChange={handleStatusChange}
          loading={loading} // nếu OrderTableProps chưa có, thêm `loading?: boolean`
        />

        <PaginationManagerOrder
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          totalItems={filteredOrders.length}
        />

        {selectedOrder && (
          <DialogViewDetails
            selectedOrder={selectedOrder}
            setSelectedOrder={() => setSelectedOrder(null)}
          />
        )}
      </div>
    </div>
  );
}
