import { useState, useEffect, useCallback } from "react"
import {
    getAllPromotions,
    addPromotions,
    deletePromotions,
    updatePromotions,
    Promotion,
} from "@/apis/promotionsApi"
import { toast } from "sonner"

export const usePromotions = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchPromotions = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getAllPromotions()
            setPromotions(data)
        } catch (err) {
            console.error("Lỗi lấy danh sách khuyến mãi:", err)
            setError("Không thể tải danh sách khuyến mãi")
            toast.error("Không thể tải danh sách khuyến mãi")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchPromotions()
    }, [fetchPromotions])

    const addPromotion = useCallback(async (promotion: Promotion) => {
        try {
            const created = await addPromotions(promotion)
            setPromotions((prev) => [...prev, created])
            toast.success("Thêm khuyến mãi thành công")
        } catch (err) {
            console.error("Lỗi thêm khuyến mãi:", err)
            toast.error("Không thể thêm khuyến mãi")
            throw err
        }
    }, [])

    const updatePromotion = useCallback(async (promoId: number, promotion: Promotion) => {
        try {
            const updated = await updatePromotions(promoId, promotion)
            setPromotions((prev) =>
                prev.map((p) => (p.promoId === promoId ? { ...p, ...updated } : p))
            )
            toast.success("Cập nhật khuyến mãi thành công")
        } catch (err) {
            console.error("Lỗi cập nhật khuyến mãi:", err)
            toast.error("Không thể cập nhật khuyến mãi")
            throw err
        }
    }, [])

    const deletePromotion = useCallback(async (promoId: number) => {
        try {
            await deletePromotions(promoId)
            setPromotions((prev) => prev.filter((p) => p.promoId !== promoId))
            toast.success("Xóa khuyến mãi thành công")
        } catch (err) {
            console.error("Lỗi xóa khuyến mãi:", err)
            toast.error("Không thể xóa khuyến mãi")
            throw err
        }
    }, [])

    return {
        promotions,
        loading,
        error,
        fetchPromotions,
        addPromotion,
        updatePromotion,
        deletePromotion,
    }
}

// Alias to match existing imports if needed
export const usePromotion = usePromotions
