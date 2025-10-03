"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { KhuyenMai } from "../../ManagerPromotionsContent"
import { SanPham } from "@/types/types"

import { ProductSelectionCard } from "./Feature/ProductSelectionCard"
import { PromotionInfoCard, type PromotionInfo } from "./Feature/PromotionInfoCard"
import { DateRangeCard } from "./Base/DateRangeCard"
import { DescriptionCard } from "./Base/DescriptionCard"

interface PromotionFormProps {
    promotion?: KhuyenMai
    onSubmit: (promotion: Omit<KhuyenMai, "maKhuyenMai"> | KhuyenMai) => void
    onCancel: () => void
}

// Mock data for products
const mockProducts: SanPham[] = [
    {
        maSanPham: "SP001",
        tenSanPham: "Cà chua cherry",
        donVi: "kg",
        soLuongTon: 100,
        maThuongHieu: "LOCAL",
        maDanhMuc: "RAU_CU",
        maLoai: "THUC_PHAM_TUOI",
        moTa: "Cà chua cherry tươi ngon",
        giaBan: 25000,
        giaNhap: 20000,
        hinhAnh: "/cherry-tomatoes.jpg",
        xuatXu: "Đà Lạt",
        hsd: "2025-12-31",
        trangThai: "active",
    },
    {
        maSanPham: "SP002",
        tenSanPham: "Thịt ba chỉ",
        donVi: "kg",
        soLuongTon: 50,
        maThuongHieu: "LOCAL",
        maDanhMuc: "THIT_TUOI",
        maLoai: "THUC_PHAM_TUOI",
        moTa: "Thịt ba chỉ tươi",
        giaBan: 180000,
        giaNhap: 150000,
        hinhAnh: "/pork-belly-meat.jpg",
        xuatXu: "Việt Nam",
        hsd: "2025-12-31",
        trangThai: "active",
    },
    {
        maSanPham: "SP003",
        tenSanPham: "Sữa tươi TH True Milk",
        donVi: "hộp",
        soLuongTon: 200,
        maThuongHieu: "TH",
        maDanhMuc: "SUA",
        maLoai: "DO_UONG",
        moTa: "Sữa tươi tiệt trùng",
        giaBan: 32000,
        giaNhap: 28000,
        hinhAnh: "/milk-carton-th-true-milk.jpg",
        xuatXu: "Việt Nam",
        hsd: "2025-12-31",
        trangThai: "active",
    },
]

export function FormPromotions({ promotion, onSubmit, onCancel }: PromotionFormProps) {
    const [formData, setFormData] = useState({
        maSanPham: promotion?.maSanPham || "",
        tenKhachHangKhuyenMai: promotion?.tenKhachHangKhuyenMai || "",
        phanTramGiamGia: promotion?.phanTramGiamGia || 0,
        ngayBatDau: promotion?.ngayBatDau || "",
        ngayKetThuc: promotion?.ngayKetThuc || "",
        moTa: promotion?.moTa || "",
        trangThai: promotion?.trangThai || ("active" as const),
    })

    const selectedProduct = mockProducts.find((p) => p.maSanPham === formData.maSanPham)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (promotion) {
            onSubmit({ ...formData, maKhuyenMai: promotion.maKhuyenMai })
        } else {
            onSubmit(formData)
        }
    }

    const promotionInfo: PromotionInfo = {
        tenKhachHangKhuyenMai: formData.tenKhachHangKhuyenMai,
        phanTramGiamGia: formData.phanTramGiamGia,
        trangThai: formData.trangThai,
    }

    const priceAfterDiscount = selectedProduct && formData.phanTramGiamGia > 0
        ? `${(selectedProduct.giaBan * (1 - formData.phanTramGiamGia / 100)).toLocaleString("vi-VN")}đ`
        : undefined

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProductSelectionCard
                    products={mockProducts}
                    selectedProductId={formData.maSanPham}
                    onChange={(value) => setFormData((prev) => ({ ...prev, maSanPham: value }))}
                />

                <PromotionInfoCard
                    value={promotionInfo}
                    onChange={(value) => setFormData((prev) => ({ ...prev, ...value }))}
                    priceAfterDiscount={priceAfterDiscount}
                />
            </div>

            <DateRangeCard
                startDate={formData.ngayBatDau}
                endDate={formData.ngayKetThuc}
                onChangeStart={(value) => setFormData((prev) => ({ ...prev, ngayBatDau: value }))}
                onChangeEnd={(value) => setFormData((prev) => ({ ...prev, ngayKetThuc: value }))}
            />

            <DescriptionCard
                value={formData.moTa}
                onChange={(value) => setFormData((prev) => ({ ...prev, moTa: value }))}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                    Hủy
                </Button>
                <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
                    {promotion ? "Cập nhật" : "Tạo mới"}
                </Button>
            </div>
        </form>
    )
}
