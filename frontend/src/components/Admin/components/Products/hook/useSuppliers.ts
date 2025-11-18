import { useEffect, useState } from "react"
import { getAllSuppliers } from "@/apis/supplierApi"
import { ISupplier } from "@/types/types"

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<ISupplier[]>([])
  const [loading, setLoading] = useState(true)

  const normalizeSupplier = (rawSupplier: any, index: number): ISupplier => {
    const fallbackId = index + 1
    const supplierId = Number(
      rawSupplier?.supplier_id ?? rawSupplier?.supplierId ?? rawSupplier?.id ?? fallbackId
    )

    return {
      supplier_id: supplierId,
      supplierId,
      name: rawSupplier?.name ?? rawSupplier?.supplierName ?? `Nhà cung cấp ${fallbackId}`,
      phone: rawSupplier?.phone ?? "",
      email: rawSupplier?.email ?? "",
      address: rawSupplier?.address ?? "",
      description: rawSupplier?.description,
      trangThai: rawSupplier?.trangThai ?? rawSupplier?.status,
      createdAt: rawSupplier?.createdAt ?? rawSupplier?.created_at ?? new Date().toISOString(),
      updatedAt: rawSupplier?.updatedAt ?? rawSupplier?.updated_at ?? new Date().toISOString()
    }
  }

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const data = await getAllSuppliers()
      const normalized = Array.isArray(data)
        ? data.map((supplier, index) => normalizeSupplier(supplier, index))
        : []
      setSuppliers(normalized)
    } catch (error) {
      console.error("Error fetching suppliers:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  return {
    suppliers,
    loading,
    fetchSuppliers
  }
}
