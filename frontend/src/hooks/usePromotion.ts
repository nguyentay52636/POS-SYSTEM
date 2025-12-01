import { useState, useEffect, useCallback } from "react"
import { Promotion, getAllPromotions, addPromotions, updatePromotions, deletePromotions } from "@/apis/promotionsApi"
import { toast } from "sonner"

export const usePromotion = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPromotions = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getAllPromotions()
            setPromotions(data)
        } catch (error: any) {
            console.error("Error fetching promotions:", error)
            const errorMessage = error.response?.data?.message || error.message || "Không thể tải danh sách khuyến mãi"
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPromotions()
    }, [fetchPromotions])

    const addPromotion = async (promotion: Promotion) => {
        try {
            const newPromotion = await addPromotions(promotion)
            setPromotions((prev) => [...prev, newPromotion])
            toast.success("Thêm khuyến mãi thành công")
            return newPromotion
        } catch (error: any) {
            console.error("Error adding promotion:", error)
            toast.error("Có lỗi xảy ra khi thêm khuyến mãi")
            throw error
        }
    }

    const updatePromotion = async (id: number, promotion: Promotion) => {
        try {
            const updatedPromotion = await updatePromotions(id, promotion)
            setPromotions((prev) => prev.map((p) => (p.promoId === id ? updatedPromotion : p)))
            toast.success("Cập nhật khuyến mãi thành công")
            return updatedPromotion
        } catch (error: any) {
            console.error("Error updating promotion:", error)
            toast.error("Có lỗi xảy ra khi cập nhật khuyến mãi")
            throw error
        }
    }

    const deletePromotion = async (id: number) => {
        try {
            await deletePromotions(id)
            setPromotions((prev) => prev.filter((p) => p.promoId !== id))
            toast.success("Xóa khuyến mãi thành công")
        } catch (error: any) {
            console.error("Error deleting promotion:", error)
            toast.error("Không thể xóa khuyến mãi")
            throw error
        }
    }

    return {
        promotions,
        loading,
        error,
        fetchPromotions,
        addPromotion,
        updatePromotion,
        deletePromotion
    }
}