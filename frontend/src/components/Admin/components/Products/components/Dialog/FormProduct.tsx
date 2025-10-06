"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Upload, Plus } from "lucide-react"
import { IProduct } from "@/types/types"

interface ProductFormProps {
    editingProduct?: IProduct | null
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSubmit?: (product: IProduct) => void
}

export function FormProduct({ editingProduct, isOpen, onOpenChange, onSubmit }: ProductFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission logic here
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl! max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="text-xl text-gray-900">
                        {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                        {editingProduct ? "Cập nhật thông tin sản phẩm" : "Điền đầy đủ thông tin sản phẩm mới"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {/* Thông tin cơ bản */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Package className="h-4 w-4 mr-2 text-green-700" />
                            Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="maSanPham" className="text-sm font-medium text-gray-700">
                                    Mã sản phẩm *
                                </Label>
                                <Input
                                    id="product_id"
                                    placeholder="VD: 1"
                                    defaultValue={editingProduct?.product_id}
                                    className="font-mono mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="tenSanPham" className="text-sm font-medium text-gray-700">
                                    Tên sản phẩm *
                                </Label>
                                <Input
                                    id="product_name"
                                    placeholder="Nhập tên sản phẩm"
                                    defaultValue={editingProduct?.product_name}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Phân loại sản phẩm */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Package className="h-4 w-4 mr-2 text-blue-700" />
                            Phân loại sản phẩm
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="maDanhMuc" className="text-sm font-medium text-gray-700">
                                    Mã danh mục *
                                </Label>
                                <Select defaultValue={editingProduct?.category_id?.category_name}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DM001">DM001 - Trái cây</SelectItem>
                                        <SelectItem value="DM002">DM002 - Rau củ</SelectItem>
                                        <SelectItem value="DM003">DM003 - Thịt</SelectItem>
                                        <SelectItem value="DM004">DM004 - Hải sản</SelectItem>
                                        <SelectItem value="DM005">DM005 - Đồ uống</SelectItem>
                                        <SelectItem value="DM006">DM006 - Gia vị</SelectItem>
                                        <SelectItem value="DM007">DM007 - Bánh kẹo</SelectItem>
                                        <SelectItem value="DM008">DM008 - Sữa & trứng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="maThuongHieu" className="text-sm font-medium text-gray-700">
                                    Mã thương hiệu *
                                </Label>
                                <Select defaultValue={editingProduct?.supplier_id?.name}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn thương hiệu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TH001">TH001 - Fresh Import</SelectItem>
                                        <SelectItem value="TH002">TH002 - Ninh Thuận Farm</SelectItem>
                                        <SelectItem value="TH003">TH003 - Organic Viet</SelectItem>
                                        <SelectItem value="TH004">TH004 - C.P Vietnam</SelectItem>
                                        <SelectItem value="TH005">TH005 - Nordic Seafood</SelectItem>
                                        <SelectItem value="TH006">TH006 - Vinamilk</SelectItem>
                                        <SelectItem value="TH007">TH007 - Masan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="maLoai" className="text-sm font-medium text-gray-700">
                                    Mã loại *
                                </Label>
                                <Select defaultValue={editingProduct?.supplier_id?.name}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn loại" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ML001">ML001 - Táo</SelectItem>
                                        <SelectItem value="ML002">ML002 - Nho</SelectItem>
                                        <SelectItem value="ML003">ML003 - Cà rốt</SelectItem>
                                        <SelectItem value="ML004">ML004 - Thịt heo</SelectItem>
                                        <SelectItem value="ML005">ML005 - Cá hồi</SelectItem>
                                        <SelectItem value="ML006">ML006 - Rau xanh</SelectItem>
                                        <SelectItem value="ML007">ML007 - Thịt bò</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Giá cả & Kho hàng */}
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Package className="h-4 w-4 mr-2 text-green-700" />
                            Giá cả & Kho hàng
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="giaBan" className="text-sm font-medium text-gray-700">
                                    Giá bán (VNĐ) *
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0"
                                    defaultValue={editingProduct?.price}
                                    min="0"
                                    step="1000"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="soLuongTon" className="text-sm font-medium text-gray-700">
                                    Số lượng tồn kho *
                                </Label>
                                <Input
                                    id="unit"
                                    type="number"
                                    placeholder="0"
                                    defaultValue={editingProduct?.unit}
                                    min="0"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="donVi" className="text-sm font-medium text-gray-700">
                                    Đơn vị tính *
                                </Label>
                                <Select defaultValue={editingProduct?.unit?.toString()}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn đơn vị" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                        <SelectItem value="g">Gram (g)</SelectItem>
                                        <SelectItem value="trái">Trái</SelectItem>
                                        <SelectItem value="hộp">Hộp</SelectItem>
                                        <SelectItem value="gói">Gói</SelectItem>
                                        <SelectItem value="khay">Khay</SelectItem>
                                        <SelectItem value="chai">Chai</SelectItem>
                                        <SelectItem value="lon">Lon</SelectItem>
                                        <SelectItem value="túi">Túi</SelectItem>
                                        <SelectItem value="thùng">Thùng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin bổ sung */}
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Package className="h-4 w-4 mr-2 text-orange-700" />
                            Thông tin bổ sung
                        </h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label htmlFor="xuatXu" className="text-sm font-medium text-gray-700">
                                    Xuất xứ *
                                </Label>
                                <Select defaultValue={editingProduct?.xuatXu}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Chọn xuất xứ" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Việt Nam">Việt Nam</SelectItem>
                                        <SelectItem value="Thái Lan">Thái Lan</SelectItem>
                                        <SelectItem value="New Zealand">New Zealand</SelectItem>
                                        <SelectItem value="Úc">Úc</SelectItem>
                                        <SelectItem value="Mỹ">Mỹ</SelectItem>
                                        <SelectItem value="Na Uy">Na Uy</SelectItem>
                                        <SelectItem value="Nhật Bản">Nhật Bản</SelectItem>
                                        <SelectItem value="Hàn Quốc">Hàn Quốc</SelectItem>
                                        <SelectItem value="Đà Lạt">Đà Lạt</SelectItem>
                                        <SelectItem value="Ninh Thuận">Ninh Thuận</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="hsd" className="text-sm font-medium text-gray-700">
                                    Hạn sử dụng *
                                </Label>
                                <Input
                                    id="hsd"
                                    type="date"
                                    defaultValue={editingProduct?.hsd}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="trangThai" className="text-sm font-medium text-gray-700">
                                Trạng thái sản phẩm
                            </Label>
                            <Select defaultValue={editingProduct?.status || "active"}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            Đang bán
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                            Tạm ngưng
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="out-of-stock">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                            Hết hàng
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="moTa" className="text-sm font-medium text-gray-700">
                                Mô tả sản phẩm
                            </Label>
                            <Textarea
                                id="moTa"
                                placeholder="Mô tả chi tiết về sản phẩm, thành phần, công dụng..."
                                defaultValue=""
                                rows={4}
                                className="resize-none mt-1"
                            />
                        </div>
                    </div>

                    {/* Hình ảnh sản phẩm */}
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <Upload className="h-4 w-4 mr-2 text-purple-700" />
                            Hình ảnh sản phẩm
                        </h3>
                        <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors bg-white">
                            <div className="space-y-3">
                                <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto">
                                    <Upload className="h-8 w-8 text-purple-600" />
                                </div>
                                <div>
                                    <label htmlFor="hinhAnh" className="cursor-pointer">
                                        <span className="text-green-700 font-medium hover:text-green-800">Nhấp để tải lên</span>
                                        <span className="text-gray-500"> hoặc kéo thả file vào đây</span>
                                    </label>
                                    <Input id="image" type="file" accept="image/*" className="hidden" multiple />
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, JPEG tối đa 5MB. Có thể tải lên nhiều ảnh.</p>
                            </div>
                        </div>
                        {editingProduct?.image && (
                            <div className="mt-4 p-3 bg-white rounded-lg border">
                                <p className="text-sm font-medium text-gray-700 mb-2">Ảnh hiện tại:</p>
                                <img
                                    src={editingProduct.image || "/placeholder.svg"}
                                    alt="Current product"
                                    className="h-24 w-24 object-cover rounded-lg border shadow-sm"
                                />
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t bg-gray-50 -mx-6 px-6 -mb-6 pb-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6">
                            Hủy bỏ
                        </Button>
                        <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-8 shadow-sm">
                            {editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
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
