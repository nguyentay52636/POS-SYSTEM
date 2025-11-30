import { useEffect, useState } from "react"
import { getCategories } from "@/apis/categoryApi"
import { ICategory } from "@/types/types"

export function useCategories() {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(true)

  const normalizeCategory = (rawCategory: any, index: number): ICategory => {
    const fallbackId = index + 1
    const categoryId = Number(
      rawCategory?.category_id ?? rawCategory?.categoryId ?? rawCategory?.id ?? fallbackId
    )

    return {
      categoryId: categoryId,
      categoryName:
        rawCategory?.categoryName ??
        rawCategory?.category_name ??
        rawCategory?.name ??
        `Danh mục ${fallbackId}`,
      createdAt: rawCategory?.createdAt ?? rawCategory?.created_at ?? new Date().toISOString(),
      updatedAt: rawCategory?.updatedAt ?? rawCategory?.updated_at ?? new Date().toISOString()
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      const normalized = Array.isArray(data)
        ? data.map((category, index) => normalizeCategory(category, index))
        : []
      setCategories(normalized)
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    fetchCategories
  }
}
