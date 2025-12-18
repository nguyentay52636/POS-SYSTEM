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
    productId?: string
    productName: string
    barcode: string
    price: string
    unit: string
    status: string
    imageUrl: string
    categoryId: string
    supplierId: string
}

const createEmptyFormValues = (): ProductFormValues => ({
    productName: "",
    barcode: "",
    price: "",
    unit: "",
    status: "active",
    imageUrl: "",
    categoryId: "",
    supplierId: ""
})

const mapProductToFormValues = (product?: IProduct | null): ProductFormValues => ({
    productId: product?.productId ? product.productId.toString() : undefined,
    productName: product?.productName ?? "",
    barcode: product?.barcode ?? "",
    price: product?.price != null ? product.price.toString() : "",
    unit: product?.unit || "",
    status: product?.status ?? "active",
    imageUrl: product?.imageUrl ?? "",
    categoryId: product?.category?.categoryId ? product.category.categoryId.toString() : (product?.categoryId?.toString() || ""),
    supplierId: product?.supplier?.supplierId ? product.supplier.supplierId.toString() : (product?.supplierId?.toString() || "")
})

import { uploadLocalImage } from "@/apis/uploadApi"
import { toast } from "sonner"

// ... existing code ...

export function FormProduct({ editingProduct, isOpen, onOpenChange, onSubmit }: ProductFormProps) {
    const [formValues, setFormValues] = useState<ProductFormValues>(createEmptyFormValues)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

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
        const fromApi = categories.find((cat) => cat.categoryId === Number(formValues.categoryId))
        if (fromApi) return fromApi
        if (
            editingProduct?.category &&
            editingProduct.category.categoryId?.toString() === formValues.categoryId
        ) {
            return editingProduct.category
        }
        return undefined
    }, [categories, editingProduct, formValues.categoryId])

    const selectedSupplier = useMemo<ISupplier | undefined>(() => {
        if (!formValues.supplierId) return undefined
        const fromApi = suppliers.find((sup) => sup.supplierId === Number(formValues.supplierId))
        if (fromApi) return fromApi
        if (
            editingProduct?.supplier &&
            editingProduct.supplier.supplierId?.toString() === formValues.supplierId
        ) {
            return editingProduct.supplier
        }
        return undefined
    }, [suppliers, editingProduct, formValues.supplierId])

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            setIsUploading(true)
            const response = await uploadLocalImage(file)
            if (response && response.url) {
                setFormValues(prev => ({ ...prev, imageUrl: response.url }))
                toast.success("Tải ảnh lên thành công")
            }
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Tải ảnh thất bại")
        } finally {
            setIsUploading(false)
            // Reset input value to allow selecting same file again
            e.target.value = ''
        }
    }

    const isValidForm = useMemo(() => {
        const numericFieldsValid =
            !!formValues.price &&
            !Number.isNaN(Number(formValues.price))

        return (
            numericFieldsValid &&
            formValues.productName.trim().length > 0 &&
            formValues.unit.trim().length > 0 &&
            formValues.barcode.trim().length > 0 &&
            formValues.imageUrl.trim().length > 0 &&
            formValues.categoryId !== "" &&
            formValues.supplierId !== ""
        )
    }, [formValues])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!onSubmit || !isValidForm || !selectedCategory || !selectedSupplier) return

        const now = new Date().toISOString()
        const payload: IProduct = {
            productName: formValues.productName.trim(),
            barcode: formValues.barcode.trim(),
            price: Number(formValues.price),
            unit: formValues.unit.trim(),  // Changed to string
            status: formValues.status,
            imageUrl: formValues.imageUrl.trim(),
            category: selectedCategory,
            categoryId: Number(formValues.categoryId),
            supplier: selectedSupplier,
            supplierId: Number(formValues.supplierId),
            createdAt: editingProduct?.createdAt ?? now,
            updatedAt: now
        }

        if (editingProduct?.productId) {
            payload.productId = editingProduct.productId
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
            <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center gap-3 text-xl text-gray-900">
                        <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                            {formValues.productId ? `#${formValues.productId}` : "New product"}
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
                                <Label htmlFor="productName">Tên sản phẩm *</Label>
                                <Input
                                    id="productName"
                                    placeholder="Ví dụ: Táo đỏ New Zealand"
                                    value={formValues.productName}
                                    onChange={handleInputChange("productName")}
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
                                <Label htmlFor="unit">Đơn vị tính *</Label>
                                <Input
                                    id="unit"
                                    type="text"
                                    placeholder="Ví dụ: Cái, Hộp, Chai..."
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
                                                    category.categoryId ?? Number(index + 1)
                                                const value = normalizedId.toString()
                                                const key = `category-${value}`
                                                return (
                                                    <SelectItem key={key} value={value}>
                                                        {category.categoryName || `Danh mục ${index + 1}`}
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
                                                    supplier.supplierId ?? Number(index + 1)
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
                                <Label htmlFor="imageUrl">URL ảnh *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="imageUrl"
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        value={formValues.imageUrl}
                                        onChange={handleInputChange("imageUrl")}
                                        required
                                        className="flex-1"
                                    />
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            disabled={isUploading}
                                            onClick={() => document.getElementById('file-upload')?.click()}
                                        >
                                            {isUploading ? (
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            ) : (
                                                <Upload className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Nhập URL hoặc tải ảnh lên. Hỗ trợ PNG, JPG, JPEG.
                                </p>
                            </div>
                            <div className="rounded-lg border bg-gray-50 p-4 text-center">
                                <p className="text-sm font-medium text-gray-700 mb-3">Xem trước</p>
                                <div className="flex h-32 items-center justify-center rounded-md bg-white">
                                    {formValues.imageUrl ? (
                                        <img
                                            src={formValues.imageUrl}
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
