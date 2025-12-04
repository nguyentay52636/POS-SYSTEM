import { useState, useEffect, useMemo, useContext } from "react"
import { ICustomer } from "@/types/types"
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer, CustomerInput } from "@/apis/customerApi"
import { toast } from "sonner"
import { PaginationContext } from "@/context/PaginationContext"

export const useCustomer = () => {
    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCustomer, setSelectedCustomer] = useState<ICustomer | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

    // Try to use global pagination if provider exists; otherwise fallback
    const paginationContext = useContext(PaginationContext)
    const paginationState = paginationContext?.paginationState ?? {
        currentPage: 1,
        rowsPerPage: 10,
        totalItems: customers.length,
        totalPages: 1,
    }

    // Fetch customers on component mount
    useEffect(() => {
        fetchCustomers()
    }, [])

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            const data = await getCustomers()
            setCustomers(data)
        } catch (error) {
            console.error("Error fetching customers:", error)
            toast.error("Không thể tải danh sách khách hàng")
        } finally {
            setLoading(false)
        }
    }

    const fetchCustomerById = async (id: number) => {
        try {
            setLoading(true)
            const data = await getCustomerById(id)
            return data
        } catch (error) {
            console.error("Error fetching customer:", error)
            toast.error("Không thể tải thông tin khách hàng")
            throw error
        } finally {
            setLoading(false)
        }
    }

    const filteredCustomers = useMemo(() => {
        return customers.filter((customer) => {
            const customerId = customer.customerId.toString()
            const matchesSearch =
                customerId.includes(searchTerm.toLowerCase()) ||
                customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.address?.toLowerCase().includes(searchTerm.toLowerCase())

            return matchesSearch
        })
    }, [customers, searchTerm])

    const paginatedCustomers = useMemo(() => {
        const startIndex = (paginationState.currentPage - 1) * paginationState.rowsPerPage
        const endIndex = startIndex + paginationState.rowsPerPage
        return filteredCustomers.slice(startIndex, endIndex)
    }, [filteredCustomers, paginationState.currentPage, paginationState.rowsPerPage])

    const totalCustomers = customers.length

    const handleAddCustomer = async (data: CustomerInput) => {
        try {
            const newCustomer = await createCustomer(data)
            setCustomers([...customers, newCustomer])
            setIsAddDialogOpen(false)
            toast.success("Thêm khách hàng thành công!")
            fetchCustomers()
        } catch (error) {
            console.error("Error adding customer:", error)
            toast.error("Không thể thêm khách hàng")
            throw error
        }
    }

    const handleEditCustomer = async (customerId: number, data: CustomerInput) => {
        try {
            const updatedCustomer = await updateCustomer(customerId, data)
            setCustomers(customers.map((c) =>
                c.customerId === customerId ? updatedCustomer : c
            ))
            setIsEditDialogOpen(false)
            setSelectedCustomer(null)
            toast.success("Cập nhật khách hàng thành công!")
            fetchCustomers()
        } catch (error) {
            console.error("Error updating customer:", error)
            toast.error("Không thể cập nhật khách hàng")
            throw error
        }
    }

    const handleDeleteCustomer = async (customerId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) return

        try {
            await deleteCustomer(customerId)
            setCustomers(customers.filter((c) => c.customerId !== customerId))
            toast.success("Xóa khách hàng thành công!")
            fetchCustomers()
        } catch (error) {
            console.error("Error deleting customer:", error)
            toast.error("Không thể xóa khách hàng")
        }
    }

    return {
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
        isDetailDialogOpen,
        setIsDetailDialogOpen,
        filteredCustomers,
        paginatedCustomers,
        totalCustomers,
        handleAddCustomer,
        handleEditCustomer,
        handleDeleteCustomer,
        fetchCustomers,
        fetchCustomerById
    }
}
