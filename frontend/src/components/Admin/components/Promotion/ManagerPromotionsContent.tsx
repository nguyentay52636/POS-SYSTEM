"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { DialogEditPromotions, DialogViewDetailPromotions } from "./components/Dialog"
import PaginationPromotions from "./components/PaginationPromotions"
import TableManagerPromotions from "./components/TableManagerPromotions"
import CardStats from "@/components/Admin/components/Promotion/components/CardStas"


// Mock data
export interface KhuyenMai {
    maKhuyenMai: string
    maSanPham: string
    tenKhachHangKhuyenMai: string
    phanTramGiamGia: number
    ngayBatDau: string
    ngayKetThuc: string
    moTa: string
    trangThai: "active" | "inactive" | "expired"
}
const mockPromotions: KhuyenMai[] = [
    {
        maKhuyenMai: "KM001",
        maSanPham: "SP001",
        tenKhachHangKhuyenMai: "Khuyến mãi cà chua cherry cuối tuần",
        phanTramGiamGia: 20,
        ngayBatDau: "2024-01-15T00:00",
        ngayKetThuc: "2024-01-21T23:59",
        moTa: "Giảm giá 20% cho cà chua cherry trong tuần này",
        trangThai: "active",
    },
    {
        maKhuyenMai: "KM002",
        maSanPham: "SP002",
        tenKhachHangKhuyenMai: "Flash sale thịt ba chỉ",
        phanTramGiamGia: 15,
        ngayBatDau: "2024-01-10T00:00",
        ngayKetThuc: "2024-01-20T23:59",
        moTa: "Giảm giá đặc biệt cho thịt ba chỉ tươi",
        trangThai: "active",
    },
    {
        maKhuyenMai: "KM003",
        maSanPham: "SP003",
        tenKhachHangKhuyenMai: "Khuyến mãi sữa tươi TH",
        phanTramGiamGia: 10,
        ngayBatDau: "2024-01-01T00:00",
        ngayKetThuc: "2024-01-10T23:59",
        moTa: "Giảm giá sữa tươi TH True Milk",
        trangThai: "expired",
    },
]

const mockProducts = [
    { maSanPham: "SP001", tenSanPham: "Cà chua cherry", hinhAnh: "/cherry-tomatoes.jpg", giaBan: 25000 },
    { maSanPham: "SP002", tenSanPham: "Thịt ba chỉ", hinhAnh: "/pork-belly-meat.jpg", giaBan: 180000 },
    { maSanPham: "SP003", tenSanPham: "Sữa tươi TH True Milk", hinhAnh: "/milk-carton-th-true-milk.jpg", giaBan: 32000 },
]

export default function ManagerPromotionsContent() {
    const [promotions, setPromotions] = useState<KhuyenMai[]>(mockPromotions)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [selectedPromotion, setSelectedPromotion] = useState<KhuyenMai | null>(null)

    const filteredPromotions = promotions.filter((promotion) => {
        const matchesSearch =
            promotion.tenKhachHangKhuyenMai.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promotion.maKhuyenMai.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || promotion.trangThai === statusFilter
        return matchesSearch && matchesStatus
    })

    // Stats calculations
    const stats = {
        total: promotions.length,
        active: promotions.filter((p) => p.trangThai === "active").length,
        expired: promotions.filter((p) => p.trangThai === "expired").length,
        avgDiscount: Math.round(promotions.reduce((sum, p) => sum + p.phanTramGiamGia, 0) / promotions.length),
    }

    const handleSubmit = (promotionData: Omit<KhuyenMai, "maKhuyenMai"> | KhuyenMai) => {
        if ("maKhuyenMai" in promotionData) {
            // Update existing
            setPromotions((prev) => prev.map((p) => (p.maKhuyenMai === promotionData.maKhuyenMai ? promotionData : p)))
        } else {
            // Add new
            const newPromotion: KhuyenMai = {
                ...promotionData,
                maKhuyenMai: `KM${String(promotions.length + 1).padStart(3, "0")}`,
            }
            setPromotions((prev) => [...prev, newPromotion])
        }
        setIsFormOpen(false)
        setSelectedPromotion(null)
    }

    const handleEdit = (promotion: KhuyenMai) => {
        setSelectedPromotion(promotion)
        setIsFormOpen(true)
    }

    const handleDelete = (maKhuyenMai: string) => {
        setPromotions((prev) => prev.filter((p) => p.maKhuyenMai !== maKhuyenMai))
    }

    const handleViewDetail = (promotion: KhuyenMai) => {
        setSelectedPromotion(promotion)
        setIsDetailOpen(true)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="">Đang hoạt động</Badge>
            case "inactive":
                return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300    ">Tạm ngưng</Badge>
            case "expired":
                return <Badge className="bg-red-100 text-red-700 border-red-300">Hết hạn</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getProductInfo = (maSanPham: string) => {
        return mockProducts.find((p) => p.maSanPham === maSanPham)
    }

    return (
        <div className=" p-6">
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
                    getProductInfo={getProductInfo}
                    handleViewDetail={handleViewDetail}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    getStatusBadge={getStatusBadge}
                />
                <PaginationPromotions
                    totalItems={promotions.length}
                />
                {/* Form Dialog */}
                <DialogEditPromotions
                    isFormOpen={isFormOpen}
                    setIsFormOpen={setIsFormOpen}
                    selectedPromotion={selectedPromotion}
                    handleSubmit={handleSubmit}
                    setSelectedPromotion={setSelectedPromotion}
                />

                <DialogViewDetailPromotions
                    isDetailOpen={isDetailOpen}
                    setIsDetailOpen={setIsDetailOpen}
                    selectedPromotion={selectedPromotion}
                    getProductInfo={getProductInfo}
                    getStatusBadge={getStatusBadge}
                />
            </div>
        </div>
    )
}