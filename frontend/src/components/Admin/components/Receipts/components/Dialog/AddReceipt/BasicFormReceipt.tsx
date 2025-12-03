import React, { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Building2, Calendar, FileText, Plus } from "lucide-react"
import type { ISupplier, IProduct } from "@/types/types"
import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form"
import { useProductBySupplier } from "@/hooks/useProductBySupplier"

interface BasicFormReceiptProps {
    suppliers: ISupplier[]
    supplierId?: number
    register: UseFormRegister<any>
    errors: FieldErrors<any>
    setValue: UseFormSetValue<any>
    onOpenProductImportDialog: () => void
    onProductsLoaded: (products: IProduct[]) => void
}

export default function BasicFormReceipt({
    suppliers,
    supplierId,
    register,
    errors,
    setValue,
    onOpenProductImportDialog,
    onProductsLoaded,
}: BasicFormReceiptProps) {
    const { products, loading } = useProductBySupplier(supplierId || null)

    useEffect(() => {
        onProductsLoaded(products)
    }, [products, onProductsLoaded])

    return (
        <Card className="border-l-4 border-l-green-500">
            <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center gap-2 text-green-700">
                    <FileText className="h-5 w-5" />
                    Thông tin phiếu nhập
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 max-w-6xl!">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="supplierId" className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Nhà cung cấp *
                        </Label>
                        <Select
                            onValueChange={(value) => setValue("supplierId", parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn nhà cung cấp" />
                            </SelectTrigger>
                            <SelectContent>
                                {suppliers.map((supplier) => (
                                    <SelectItem
                                        key={supplier.supplierId}
                                        value={supplier.supplierId?.toString() || ""}
                                    >
                                        {supplier.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.supplierId && (
                            <p className="text-sm text-red-600">
                                {String(errors.supplierId.message)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="importDate" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Ngày nhập *
                        </Label>
                        <Input
                            id="importDate"
                            type="date"
                            {...register("importDate")}
                        />
                        {errors.importDate && (
                            <p className="text-sm text-red-600">
                                {String(errors.importDate.message)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="note">
                        Ghi chú
                    </Label>
                    <Textarea
                        id="note"
                        {...register("note")}
                        placeholder="Nhập ghi chú nếu có"
                        rows={3}
                    />
                </div>
                <div className="flex justify-end">
                    <Button
                        type="button"
                        className="bg-green-700"
                        onClick={onOpenProductImportDialog}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm sản phẩm
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
