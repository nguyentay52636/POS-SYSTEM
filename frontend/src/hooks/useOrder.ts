import { useState, useEffect, useMemo, useCallback } from "react"
import { getOrders, updateOrderStatus, Order, OrderItem } from "@/apis/orderApi"
import { toast } from "sonner"

export type UiStatus = "ALL" | "ChoDuyet" | "DaDuyet" | "DaHuy"

/**
 * Convert API status to UI status
 */
const toUiStatus = (s: string): UiStatus => {
  const k = (s || "").toLowerCase()
  if (k === "pending" || k === "choduyet") return "ChoDuyet"
  if (k === "paid" || k === "approved" || k === "daduyet") return "DaDuyet"
  if (k === "canceled" || k === "cancelled" || k === "dahuy") return "DaHuy"
  return "ChoDuyet"
}

export const calculateGross = (items: OrderItem[]) =>
  items?.reduce((s, i) => s + i.quantity * i.price, 0) || 0


export const calculateNet = (order: Order) => {
  const gross = calculateGross(order.orderItems)
  const discount = order.promoId ? (order.discountAmount || 0) : 0
  return Math.max(gross - discount, 0)
}

export const useOrder = () => {
  // Data state
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  const [statusFilter, setStatusFilter] = useState<UiStatus>("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedForExport, setSelectedForExport] = useState<Order | null>(null)

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getOrders()
      setOrders(res || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Không thể tải danh sách đơn hàng")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Filter orders by status and search term
  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()

    return orders.filter((o) => {
      const matchesStatus =
        statusFilter === "ALL" || toUiStatus(o.status) === statusFilter

      const matchesSearch =
        !q ||
        String(o.orderId).includes(q) ||
        (o.customerName || "").toLowerCase().includes(q) ||
        (o.userName || "").toLowerCase().includes(q) ||
        (o.promoCode || "").toLowerCase().includes(q)

      return matchesStatus && matchesSearch
    })
  }, [orders, statusFilter, searchTerm])

  // Pagination calculations
  const totalItems = filteredOrders.length
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * rowsPerPage
  const endIdx = startIdx + rowsPerPage
  const paginatedOrders = filteredOrders.slice(startIdx, endIdx)

  // Handlers
  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await updateOrderStatus(id, "DaHuy")
        await fetchOrders()
        toast.success("Đã hủy đơn hàng")
      } catch (error) {
        toast.error("Hủy đơn hàng thất bại")
        console.error("Error canceling order:", error)
      }
    },
    [fetchOrders]
  )

  const handleViewDetails = useCallback((order: Order) => {
    setSelectedOrder(order)
  }, [])

  const handleStatusChange = useCallback(
    async (orderId: number, newStatus: string) => {
      try {
        await updateOrderStatus(orderId, newStatus)
        await fetchOrders()
        toast.success("Cập nhật trạng thái thành công")
      } catch (error: any) {
        console.error(
          "Update status error:",
          error?.response?.status,
          error?.config?.url,
          error?.response?.data || error?.message || error
        )
        toast.error("Cập nhật trạng thái thất bại")
        throw error
      }
    },
    [fetchOrders]
  )

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleRowsPerPageChange = useCallback((rows: number) => {
    setRowsPerPage(rows)
    setCurrentPage(1)
  }, [])

  return {
    // Data
    orders,
    filteredOrders,
    paginatedOrders,
    loading,

    // Filter state
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,

    // Pagination state
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    safePage,
    totalItems,

    // Selection state
    selectedOrder,
    setSelectedOrder,
    selectedForExport,
    setSelectedForExport,

    // Handlers
    fetchOrders,
    handleDelete,
    handleViewDetails,
    handleStatusChange,
    handlePageChange,
    handleRowsPerPageChange,
  }
}

