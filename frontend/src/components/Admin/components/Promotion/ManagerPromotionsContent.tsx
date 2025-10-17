"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { DialogEditPromotions, DialogViewDetailPromotions } from "./components/Dialog"
import PaginationPromotions from "./components/PaginationPromotions"
import TableManagerPromotions from "./components/TableManagerPromotions"
import CardStats from "@/components/Admin/components/Promotion/components/CardStas"
import { Promotion, getAllPromotions, addPromotions, deletePromotions, updatePromotions } from "@/apis/promotionsApi"
import { toast } from "sonner"
// removed unused DialogAddPromotions

export default function ManagerPromotionsContent() {
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const fetchPromotions = async () => {
        try {
            setIsLoading(true)
            const data = await getAllPromotions()
            setPromotions(data)
            setIsLoading(false)
        } catch (error) {
            setError("Không thể tải danh sách khuyến mãi")
            setIsLoading(false)
            toast.error("Không thể tải danh sách khuyến mãi")
        }
    }
    useEffect(() => {
        fetchPromotions()
    }, [])

    useEffect(() => {
        let filtered = promotions
        if (searchTerm) {
            filtered = filtered.filter(
                (p) =>
                    p.promoCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        if (statusFilter !== "all") {
            filtered = filtered.filter((p) => p.status === statusFilter)
        }

        setFilteredPromotions(filtered)
    }, [promotions, searchTerm, statusFilter])

    const stats = {
        total: promotions.length,
        active: promotions.filter((p) => p.status === "active").length,
        expired: promotions.filter((p) => p.status === "expired").length,
        avgDiscount: promotions.length > 0
            ? Math.round(promotions.reduce((sum, p) => sum + p.discountValue, 0) / promotions.length)
            : 0,
    }

    const handleSubmit = async (promotionData: Omit<Promotion, "promoId"> | Promotion) => {
        try {
            if ("promoId" in promotionData && promotionData.promoId) {
                await updatePromotions(promotionData.promoId, promotionData)
                toast.success("Cập nhật khuyến mãi thành công")
            } else {
                await addPromotions(promotionData as Promotion)
                toast.success("Thêm khuyến mãi thành công")
            }
            setIsFormOpen(false)
            fetchPromotions()
        } catch (error) {
            toast.error("Có lỗi xảy ra khi lưu khuyến mãi")
            console.error("Error saving promotion:", error)
        }
    }

    const handleEdit = (promotion: Promotion) => {
        setSelectedPromotion(promotion)
        setIsFormOpen(true)
    }

    const handleViewDetail = (promotion: Promotion) => {
        setSelectedPromotion(promotion)
        setIsDetailOpen(true)
    }

    const handleDelete = async (promoId: number) => {
        if (confirm("Bạn có chắc chắn muốn xóa khuyến mãi này?")) {
            try {
                await deletePromotions(promoId)
                toast.success("Xóa khuyến mãi thành công")
                fetchPromotions()
            } catch (error) {
                toast.error("Không thể xóa khuyến mãi")
                console.error("Error deleting promotion:", error)
            }
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-700 border-green-300">Đang hoạt động</Badge>
            case "inactive":
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Tạm ngưng</Badge>
            case "expired":
                return <Badge className="bg-red-100 text-red-700 border-red-300">Hết hạn</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold">{error}</p>
                    <Button onClick={fetchPromotions} className="mt-4">
                        Thử lại
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="px-4 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Quản lý Khuyến mãi</h1>
                        <p className="text-gray-600 mt-1">Quản lý các chương trình khuyến mãi và giảm giá</p>
                    </div>
                    <Button
                        onClick={() => {
                            setSelectedPromotion(null)
                            setIsFormOpen(true)
                        }}
                        className="bg-green-700 hover:bg-green-800 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm khuyến mãi
                    </Button>
                </div>

                {/* Stats and Filters */}
                <CardStats
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    stats={stats}
                />

                {/* Promotions Table */}
                <TableManagerPromotions
                    filteredPromotions={filteredPromotions}
                    handleViewDetail={handleViewDetail}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    getStatusBadge={getStatusBadge}
                />

                {/* Pagination */}
                <PaginationPromotions totalItems={filteredPromotions.length} />

                {/* Form Dialog */}
                <DialogEditPromotions
                    isFormOpen={isFormOpen}
                    setIsFormOpen={setIsFormOpen}
                    selectedPromotion={selectedPromotion}
                    handleSubmit={handleSubmit}
                    setSelectedPromotion={setSelectedPromotion}
                />

                {/* Detail Dialog */}
                <DialogViewDetailPromotions
                    isDetailOpen={isDetailOpen}
                    setIsDetailOpen={setIsDetailOpen}
                    selectedPromotion={selectedPromotion}
                    getStatusBadge={getStatusBadge}
                />
                {/* Add flow is handled by DialogEditPromotions when selectedPromotion is null */}
            </div>
        </div>
    )
}
