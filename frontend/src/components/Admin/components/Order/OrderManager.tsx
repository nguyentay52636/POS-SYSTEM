"use client";
import React, { useState, useMemo, useEffect } from "react";
import OrderTable from "./components/TableManagerOrder/TableManagerOrder";
import DialogViewDetails from "./components/Dialog/DialogViewDetails";
import { toast } from "sonner";
import ActionOrder from "./components/TableManagerOrder/OrderActions";
import PaginationManagerOrder from "./components/PaginationManagerOrder";
import type { Order, OrderItem } from "@/apis/orderApi";
import type { UiStatus } from "./components/TableManagerOrder/TableManagerOrder";

// 👉 Chỉ import API đang dùng
import { getOrders, updateOrderStatus } from "@/apis/orderApi";

/* ===========================
   Helpers tính tiền & trạng thái
   =========================== */

// Chuẩn hoá status từ BE về khóa UI để lọc/hiển thị
const toUiStatus = (s: string): UiStatus => {
  const k = (s || "").toLowerCase();
  if (k === "pending" || k === "choduyet") return "ChoDuyet";
  if (k === "paid" || k === "approved" || k === "daduyet") return "DaDuyet";
  if (k === "canceled" || k === "cancelled" || k === "dahuy") return "DaHuy";
  return "ChoDuyet";
};

// Tính tạm tính (gross)
const calculateGross = (items: OrderItem[]) =>
  items?.reduce((s, i) => s + i.quantity * i.price, 0) || 0;

// Tính thành tiền (net = gross - discount nếu có promo)
const calculateNet = (order: Order) => {
  const gross = calculateGross(order.orderItems);
  const discount = order.promoId ? (order.discountAmount || 0) : 0;
  return Math.max(gross - discount, 0);
};

export default function OrderManager() {
  // dữ liệu
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  // filter & search
  const [statusFilter, setStatusFilter] = useState<UiStatus>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // chi tiết đơn
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ====== Gọi API: danh sách đơn hàng ======
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders(); // GET /Order
      setOrders(res || []);
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

  // ====== Lọc theo từ khóa & trạng thái ======
  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return orders.filter((o) => {
      const matchesStatus =
        statusFilter === "ALL" || toUiStatus(o.status) === statusFilter;

      const matchesSearch =
        !q ||
        String(o.orderId).includes(q) ||
        (o.customerName || "").toLowerCase().includes(q) ||
        (o.userName || "").toLowerCase().includes(q) ||
        (o.promoCode || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchTerm]);

  // ====== Phân trang từ danh sách đã lọc ======
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIdx, endIdx);

  // ====== Handlers ======
  const handleDelete = async (id: number) => {
    try {
      await updateOrderStatus(id, "DaHuy"); // đổi trạng thái sang Đã Hủy
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
      await updateOrderStatus(orderId, newStatus); // PUT /Order/{id} + DTO chuẩn
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
        {/* Thanh hành động: tìm kiếm, lọc trạng thái, export */}
        <ActionOrder
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          exportBill={() => {}}
        />

        {/* Bảng đơn hàng */}
        <OrderTable
          paginatedpayments={paginatedOrders}
          calculateTotalAmount={calculateGross} // gross (nếu bảng còn dùng)
          getNetAmount={calculateNet}           // net hiển thị ở cột Giá
          handleViewDetails={handleViewDetails}
          handleDelete={handleDelete}
          onStatusChange={handleStatusChange}
          loading={loading}
          statusFilter={statusFilter}           // để Table hiển thị badge/menu đúng
          searchKeyword={searchTerm}            // nếu Table tự lọc thêm
        />

        {/* Phân trang */}
        <PaginationManagerOrder
          currentPage={safePage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          totalItems={filteredOrders.length}
        />

        {/* Dialog chi tiết */}
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
