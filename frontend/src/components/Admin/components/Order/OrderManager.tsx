"use client";
import React from "react";
import OrderTable from "./components/TableManagerOrder/TableManagerOrder";
import DialogViewDetails from "./components/Dialog/DialogViewDetails";
import { toast } from "sonner";
import ActionOrder from "./components/TableManagerOrder/OrderActions";
import { getOrderById } from "@/apis/orderApi";
import { buildInvoiceHtml } from "@/lib/Invoice";
import PaginationManagerOrder from "./components/PaginationManagerOrder";
import { useOrder, calculateGross, calculateNet } from "@/hooks/useOrder";

export default function OrderManager() {
  const {
    paginatedOrders,
    loading,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    safePage,
    totalPages,
    rowsPerPage,
    totalItems,
    selectedOrder,
    setSelectedOrder,
    selectedForExport,
    setSelectedForExport,
    handleDelete,
    handleCancelOrder,
    handleViewDetails,
    handleStatusChange,
    handlePageChange,
    handleRowsPerPageChange,
  } = useOrder();

  return (
    <div className="bg-gradient-to-br from-green-50/30 via-gray-50 to-green-100/30 dark:from-green-900/10 dark:via-gray-900 dark:to-green-800/10 min-h-screen">
      <div className="p-6 space-y-8">
        <ActionOrder
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          exportBill={async () => {
            const orderToUse = selectedForExport ?? selectedOrder;
            if (!orderToUse) {
              toast.error("Vui lòng chọn một đơn hàng (bấm 'Xem chi tiết' hoặc đánh dấu hàng) trước khi xuất hoá đơn");
              return;
            }

            try {
              const id = orderToUse.orderId;
              const order = await getOrderById(id);
              const html = buildInvoiceHtml(order);
              const w = window.open("", "_blank", "width=900,height=700");
              if (!w) {
                toast.error("Popup bị chặn. Vui lòng cho phép popup để in hoá đơn.");
                return;
              }
              w.document.write(html);
              w.document.close();
              w.focus();
              setTimeout(() => w.print(), 600);
            } catch (err) {
              console.error("Export invoice error:", err);
              toast.error("Không thể xuất hoá đơn");
            }
          }}
        />

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
          selectedRowId={selectedForExport?.orderId ?? selectedOrder?.orderId ?? null}
          onRowSelect={(order) => setSelectedForExport(order)}
          handleCancelOrder={handleCancelOrder}
        />

        {/* Phân trang */}
        <PaginationManagerOrder
          currentPage={safePage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          totalItems={totalItems}
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
