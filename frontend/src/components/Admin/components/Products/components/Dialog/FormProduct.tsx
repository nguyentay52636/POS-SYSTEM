"use client"

import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Package, Upload, Plus } from "lucide-react"
import { IProduct, ICategory, ISupplier } from "@/types/types"
import { useCategories } from "@/components/Admin/components/Products/hook/useCategories"
import { useSuppliers } from "@/components/Admin/components/Products/hook/useSuppliers"

interface ProductFormProps {
    editingProduct?: IProduct | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSubmit?: (product: IProduct) => void | Promise<void>
}

type ProductFormValues = {
    product_id?: string
    product_name: string
    barcode: string
    price: string
    unit: string
    status: string
    image_url: string
    categoryId: string
    supplierId: string
}

const createEmptyFormValues = (): ProductFormValues => ({
    product_name: "",
    barcode: "",
    price: "",
    unit: "",
    status: "active",
    image_url: "",
    categoryId: "",
    supplierId: ""
})

const mapProductToFormValues = (product?: IProduct | null): ProductFormValues => ({
    product_id: product?.product_id ? product.product_id.toString() : undefined,
    product_name: product?.product_name ?? "",
    barcode: product?.barcode ?? "",
    price: product?.price != null ? product.price.toString() : "",
    unit: product?.unit != null ? product.unit.toString() : "",
    status: product?.status ?? "active",
    image_url: product?.image_url ?? "",
    categoryId: product?.category_id?.category_id ? product.category_id.category_id.toString() : "",
    supplierId: product?.supplier_id?.supplier_id ? product.supplier_id.supplier_id.toString() : ""
})

export function FormProduct({ editingProduct, isOpen, onOpenChange, onSubmit }: ProductFormProps) {
    const [formValues, setFormValues] = useState<ProductFormValues>(createEmptyFormValues)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { categories, loading: loadingCategories } = useCategories()
    const { suppliers, loading: loadingSuppliers } = useSuppliers()
    useEffect(() => {
        if (!isOpen) {
            setFormValues(createEmptyFormValues())
            return
        }
        setFormValues(mapProductToFormValues(editingProduct))
    }, [editingProduct, isOpen])

    const handleInputChange =
        (field: keyof ProductFormValues) => (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value
            setFormValues((prev) => ({ ...prev, [field]: value }))
        }

    const handleSelectChange = (field: keyof ProductFormValues) => (value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }))
    }

    const selectedCategory = useMemo<ICategory | undefined>(() => {
        if (!formValues.categoryId) return undefined
        const fromApi = categories.find((cat) => cat.category_id === Number(formValues.categoryId))
        if (fromApi) return fromApi
        if (
            editingProduct?.category_id &&
            editingProduct.category_id.category_id.toString() === formValues.categoryId
        ) {
            return editingProduct.category_id
        }
        return undefined
    }, [categories, editingProduct, formValues.categoryId])

    const selectedSupplier = useMemo<ISupplier | undefined>(() => {
        if (!formValues.supplierId) return undefined
        const fromApi = suppliers.find((sup) => sup.supplier_id === Number(formValues.supplierId))
        if (fromApi) return fromApi
        if (
            editingProduct?.supplier_id &&
            editingProduct.supplier_id.supplier_id.toString() === formValues.supplierId
        ) {
            return editingProduct.supplier_id
        }
        return undefined
    }, [suppliers, editingProduct, formValues.supplierId])

    const isValidForm = useMemo(() => {
        const numericFieldsValid =
            !!formValues.price &&
            !!formValues.unit &&
            !Number.isNaN(Number(formValues.price)) &&
            !Number.isNaN(Number(formValues.unit))

        return (
            numericFieldsValid &&
            formValues.product_name.trim().length > 0 &&
            formValues.barcode.trim().length > 0 &&
            formValues.image_url.trim().length > 0 &&
            formValues.categoryId !== "" &&
            formValues.supplierId !== ""
        )
    }, [formValues])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!onSubmit || !isValidForm || !selectedCategory || !selectedSupplier) return

        const now = new Date().toISOString()
        const payload: IProduct = {
            product_name: formValues.product_name.trim(),
            barcode: formValues.barcode.trim(),
            price: Number(formValues.price),
            unit: Number(formValues.unit),
            status: formValues.status,
            image_url: formValues.image_url.trim(),
            category_id: selectedCategory,
            supplier_id: selectedSupplier,
            createdAt: editingProduct?.createdAt ?? now,
            updatedAt: now
        }

        if (editingProduct?.product_id) {
            payload.product_id = editingProduct.product_id
        }

        try {
            setIsSubmitting(true)
            await Promise.resolve(onSubmit(payload))
            onOpenChange(false)
        } catch (error) {
            console.error("Lỗi lưu sản phẩm:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center gap-3 text-xl text-gray-900">
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                            {formValues.product_id ? `#${formValues.product_id}` : "New product"}
                        </Badge>
                        {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Điền đầy đủ thông tin theo cấu trúc `IProduct`. Tất cả trường bắt buộc đều đã được đánh dấu.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <section className="rounded-xl border bg-white/80 p-4 shadow-sm">
                        <div className="flex items-center gap-2 pb-4">
                            <Package className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                                Thông tin sản phẩm
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="product_name">Tên sản phẩm *</Label>
                                <Input
                                    id="product_name"
                                    placeholder="Ví dụ: Táo đỏ New Zealand"
                                    value={formValues.product_name}
                                    onChange={handleInputChange("product_name")}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="barcode">Barcode *</Label>
                                <Input
                                    id="barcode"
                                    placeholder="1234567890123"
                                    value={formValues.barcode}
                                    onChange={handleInputChange("barcode")}
                                    className="font-mono"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Giá bán (VNĐ) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    placeholder="0"
                                    value={formValues.price}
                                    onChange={handleInputChange("price")}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="unit">Số lượng/Đơn vị *</Label>
                                <Input
                                    id="unit"
                                    type="number"
                                    min="0"
                                    placeholder="Nhập số lượng trong kho"
                                    value={formValues.unit}
                                    onChange={handleInputChange("unit")}
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border bg-white/80 p-4 shadow-sm">
                        <div className="flex items-center gap-2 pb-4">
                            <Package className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                                Liên kết & trạng thái
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Danh mục *</Label>
                                <Select
                                    value={formValues.categoryId || undefined}
                                    onValueChange={handleSelectChange("categoryId")}
                                    disabled={loadingCategories}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={loadingCategories ? "Đang tải danh mục..." : "Chọn danh mục"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingCategories ? (
                                            <SelectItem value="loading" disabled>
                                                Đang tải danh mục...
                                            </SelectItem>
                                        ) : categories.length === 0 ? (
                                            <SelectItem value="empty" disabled>
                                                Không có danh mục
                                            </SelectItem>
                                        ) : (
                                            categories.map((category, index) => {
                                                const normalizedId =
                                                    category.category_id ?? Number(index + 1)
                                                const value = normalizedId.toString()
                                                const key = `category-${value}`
                                                return (
                                                    <SelectItem key={key} value={value}>
                                                        {category.category_name || `Danh mục ${index + 1}`}
                                                    </SelectItem>
                                                )
                                            })
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Nhà cung cấp *</Label>
                                <Select
                                    value={formValues.supplierId || undefined}
                                    onValueChange={handleSelectChange("supplierId")}
                                    disabled={loadingSuppliers}
                                >
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={loadingSuppliers ? "Đang tải nhà cung cấp..." : "Chọn nhà cung cấp"}
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingSuppliers ? (
                                            <SelectItem value="loading" disabled>
                                                Đang tải nhà cung cấp...
                                            </SelectItem>
                                        ) : suppliers.length === 0 ? (
                                            <SelectItem value="empty" disabled>
                                                Không có nhà cung cấp
                                            </SelectItem>
                                        ) : (
                                            suppliers.map((supplier, index) => {
                                                const normalizedId =
                                                    supplier.supplier_id ?? Number(index + 1)
                                                const value = normalizedId.toString()
                                                const key = `supplier-${value}`
                                                return (
                                                    <SelectItem key={key} value={value}>
                                                        {supplier.name || `Nhà cung cấp ${index + 1}`}
                                                    </SelectItem>
                                                )
                                            })
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Trạng thái *</Label>
                                <Select value={formValues.status} onValueChange={handleSelectChange("status")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Đang bán</SelectItem>
                                        <SelectItem value="inactive">Tạm ngưng</SelectItem>
                                        <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border bg-white/80 p-4 shadow-sm">
                        <div className="flex items-center gap-2 pb-4">
                            <Upload className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                                Ảnh sản phẩm
                            </span>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="image_url">URL ảnh *</Label>
                                <Input
                                    id="image_url"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={formValues.image_url}
                                    onChange={handleInputChange("image_url")}
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    Hỗ trợ PNG, JPG, JPEG. Lưu ý ảnh nên có kích thước tối thiểu 600x600px.
                                </p>
                            </div>
                            <div className="rounded-lg border bg-gray-50 p-4 text-center">
                                <p className="text-sm font-medium text-gray-700 mb-3">Xem trước</p>
                                <div className="flex h-32 items-center justify-center rounded-md bg-white">
                                    {formValues.image_url ? (
                                        <img
                                            src={formValues.image_url}
                                            alt="Product preview"
                                            className="h-28 w-28 rounded-md object-cover"
                                            onError={(event) => {
                                                (event.currentTarget as HTMLImageElement).src = "/placeholder.svg"
                                            }}
                                        />
                                    ) : (
                                        <span className="text-xs text-gray-400">Chưa có ảnh</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
                            disabled={!isValidForm || isSubmitting}
                        >
                            {isSubmitting ? "Đang lưu..." : editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// Trigger button component
export function ProductFormTrigger({ onOpenDialog }: { onOpenDialog: () => void }) {
    return (
        <Button onClick={onOpenDialog} className="bg-green-700 hover:bg-green-800 text-white shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
        </Button>
    )
}
