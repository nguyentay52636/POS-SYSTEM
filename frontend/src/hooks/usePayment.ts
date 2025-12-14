import { useState, useEffect, useMemo, useContext } from "react"
import { IPayment, list, create, update, remove } from "@/apis/paymentApi"
import { toast } from "sonner"
import { PaginationContext } from "@/context/PaginationContext"

export const usePayment = () => {
    const [payments, setPayments] = useState<IPayment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    const paginationContext = useContext(PaginationContext)
    const paginationState = paginationContext?.paginationState ?? {
        currentPage: 1,
        rowsPerPage: 10,
        totalItems: payments.length,
        totalPages: 1,
    }

    useEffect(() => {
        fetchPayments()
    }, [])

    const fetchPayments = async () => {
        try {
            setLoading(true)
            const data = await list()
            setPayments(data)
        } catch (error) {
            console.error("Error fetching payments:", error)
            toast.error("Không thể tải danh sách thanh toán")
        } finally {
            setLoading(false)
        }
    }

    const filteredPayments = useMemo(() => {
        return payments.filter((payment) => {
            const paymentId = payment.paymentId?.toString() || ""
            const orderId = payment.orderId?.toString() || ""
            const customerName = payment.customerName?.toLowerCase() || ""
            const paymentMethod = payment.paymentMethod?.toLowerCase() || ""
            const query = searchTerm.toLowerCase()

            return (
                paymentId.includes(query) ||
                orderId.includes(query) ||
                customerName.includes(query) ||
                paymentMethod.includes(query)
            )
        })
    }, [payments, searchTerm])

    const paginatedPayments = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return filteredPayments.slice(startIndex, endIndex)
    }, [filteredPayments, paginationState.currentPage, paginationState.rowsPerPage])

    const totalPayments = payments.length

    const addPayment = async (data: Omit<IPayment, "paymentId">) => {
        try {
            const newPayment = await create(data)
            setPayments((prev) => [...prev, newPayment])
            toast.success("Thêm thanh toán thành công!")
            return newPayment
        } catch (error) {
            console.error("Error adding payment:", error)
            toast.error("Không thể thêm thanh toán")
            throw error
        }
    }

    const updatePayment = async (id: number, data: Partial<Omit<IPayment, "paymentId">>) => {
        try {
            const updatedPayment = await update(id, data)
            setPayments((prev) =>
                prev.map((p) => (p.paymentId === id ? updatedPayment : p))
            )
            toast.success("Cập nhật thanh toán thành công!")
            return updatedPayment
        } catch (error) {
            console.error("Error updating payment:", error)
            toast.error("Không thể cập nhật thanh toán")
            throw error
        }
    }

    const deletePayment = async (id: number) => {
        try {
            await remove(id)
            setPayments((prev) => prev.filter((p) => p.paymentId !== id))
            toast.success("Xóa thanh toán thành công!")
        } catch (error) {
            console.error("Error deleting payment:", error)
            toast.error("Không thể xóa thanh toán")
            throw error
        }
    }

    return {
        payments,
        loading,
        searchTerm,
        setSearchTerm,
        selectedPayment,
        setSelectedPayment,
        isDetailDialogOpen,
        setIsDetailDialogOpen,
        filteredPayments,
        paginatedPayments,
        totalPayments,
        fetchPayments,
        addPayment,
        updatePayment,
        deletePayment,
    }
}
