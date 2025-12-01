import { useEffect, useState } from "react"
import { ICategory } from "@/types/types"
import {
    getCategories,
    createCategory as apiCreateCategory,
    updateCategory as apiUpdateCategory,
    deleteCategory as apiDeleteCategory,
    getCategoryById,
} from "@/apis/categoryApi"
import { toast } from "sonner"

export const useCategory = () => {
    const [categories, setCategories] = useState<ICategory[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const data = await getCategories()
            setCategories(data)
        } catch (error) {
            console.error("Error fetching categories:", error)
            toast.error("Không thể tải danh sách danh mục")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const createCategory = async (category: ICategory) => {
        try {
            const newCategory = await apiCreateCategory(category)
            setCategories((prev) => [...prev, newCategory])
            toast.success("Thêm danh mục thành công!")
            return newCategory
        } catch (error) {
            console.error("Error creating category:", error)
            toast.error("Không thể thêm danh mục")
            throw error
        }
    }

    const updateCategory = async (category: ICategory) => {
        try {
            const updated = await apiUpdateCategory(category)
            setCategories((prev) =>
                prev.map((c) => (c.categoryId === updated.categoryId ? updated : c)),
            )
            toast.success("Cập nhật danh mục thành công!")
            return updated
        } catch (error) {
            console.error("Error updating category:", error)
            toast.error("Không thể cập nhật danh mục")
            throw error
        }
    }

    const deleteCategory = async (categoryId: number) => {
        try {
            await apiDeleteCategory(categoryId)
            setCategories((prev) => prev.filter((c) => c.categoryId !== categoryId))
            toast.success("Xóa danh mục thành công!")
        } catch (error) {
            console.error("Error deleting category:", error)
            toast.error("Không thể xóa danh mục")
            throw error
        }
    }

    const fetchCategoryById = async (id: number) => {
        try {
            return await getCategoryById(id)
        } catch (error) {
            console.error("Error fetching category by id:", error)
            toast.error("Không thể tải danh mục")
            throw error
        }
    }

    return {
        categories,
        loading,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        fetchCategoryById,
    }
}