import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { ISupplier, SanPham } from '@/types/types'

interface ImportCardProps {
    isImportDialogOpen: boolean
    setIsImportDialogOpen: (open: boolean) => void
    selectedSupplier: ISupplier | null
    setSelectedSupplier: (supplier: ISupplier | null) => void
    handleImportGoods: (data: {
        ngayNhap: string
        chiTietPhieuNhap: any[]
        tongTien: number
    }) => void
}

interface ImportItem {
    product: SanPham
    quantity: number
    price: number
}

export default function ImportCard({
    isImportDialogOpen,
    setIsImportDialogOpen,
    selectedSupplier,
    setSelectedSupplier,
    handleImportGoods
}: ImportCardProps) {
    const [importDate, setImportDate] = useState(new Date().toISOString().split('T')[0])
    const [importItems, setImportItems] = useState<ImportItem[]>([])
    const [availableProducts] = useState<SanPham[]>([
        {
            maSanPham: "SP001",
            tenSanPham: "Cà phê đen",
            donVi: "ly",
            soLuongTon: 50,
            maThuongHieu: "TH001",
            maDanhMuc: "DM001",
            maLoai: "TL001",
            moTa: "Cà phê đen nguyên chất",
            giaBan: 25000,
            giaNhap: 15000,
            hinhAnh: "/images/coffee-black.jpg",
            xuatXu: "Việt Nam",
            hsd: "2025-12-31",
            trangThai: "active",
            categoryName: "Đồ uống",
            brandName: "ABC Coffee",
            typeName: "Cà phê",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-15"
        },
        {
            maSanPham: "SP002",
            tenSanPham: "Bánh mì thịt nướng",
            donVi: "cái",
            soLuongTon: 30,
            maThuongHieu: "TH002",
            maDanhMuc: "DM002",
            maLoai: "TL002",
            moTa: "Bánh mì với thịt nướng thơm ngon",
            giaBan: 35000,
            giaNhap: 20000,
            hinhAnh: "/images/banh-mi.jpg",
            xuatXu: "Việt Nam",
            hsd: "2024-12-31",
            trangThai: "active",
            categoryName: "Đồ ăn",
            brandName: "XYZ Bakery",
            typeName: "Bánh mì",
            createdAt: "2024-02-20",
            updatedAt: "2024-02-20"
        }
    ])

    const addProduct = (product: SanPham) => {
        const existingItem = importItems.find(item => item.product.maSanPham === product.maSanPham)
        if (existingItem) {
            setImportItems(items =>
                items.map(item =>
                    item.product.maSanPham === product.maSanPham
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            )
        } else {
            setImportItems([...importItems, { product, quantity: 1, price: product.giaNhap || product.giaBan }])
        }
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            setImportItems(items => items.filter(item => item.product.maSanPham !== productId))
        } else {
            setImportItems(items =>
                items.map(item =>
                    item.product.maSanPham === productId
                        ? { ...item, quantity }
                        : item
                )
            )
        }
    }

    const removeItem = (productId: string) => {
        setImportItems(items => items.filter(item => item.product.maSanPham !== productId))
    }

    const calculateTotal = () => {
        return importItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const handleSubmit = () => {
        const importData = {
            ngayNhap: importDate,
            chiTietPhieuNhap: importItems.map(item => ({
                productId: item.product.maSanPham,
                quantity: item.quantity,
                price: item.price
            })),
            tongTien: calculateTotal()
        }
        handleImportGoods(importData)
        setImportItems([])
    }

    if (!selectedSupplier) return null

    return (
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                        Nhập hàng từ: {selectedSupplier.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Import Date */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin nhập hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="importDate">Ngày nhập hàng</Label>
                                    <Input
                                        id="importDate"
                                        type="date"
                                        value={importDate}
                                        onChange={(e) => setImportDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Nhà cung cấp</Label>
                                    <div className="p-3 bg-gray-50 rounded-md">
                                        <p className="font-medium">{selectedSupplier.name}</p>
                                        <p className="text-sm text-gray-600">{selectedSupplier.email}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Available Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Sản phẩm có thể nhập</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableProducts.map((product) => (
                                    <div key={product.maSanPham} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-900">{product.tenSanPham}</h4>
                                            <div className="text-sm text-gray-600">
                                                <p>Mã SP: {product.maSanPham}</p>
                                                <p>Giá nhập: {(product.giaNhap || product.giaBan).toLocaleString()} VNĐ</p>
                                                <p>Tồn kho: {product.soLuongTon} {product.donVi}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => addProduct(product)}
                                                className="w-full"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Thêm vào phiếu nhập
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Import Items */}
                    {importItems.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Chi tiết phiếu nhập</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sản phẩm</TableHead>
                                            <TableHead>Số lượng</TableHead>
                                            <TableHead>Giá nhập</TableHead>
                                            <TableHead>Thành tiền</TableHead>
                                            <TableHead>Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {importItems.map((item) => (
                                            <TableRow key={item.product.maSanPham}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{item.product.tenSanPham}</p>
                                                        <p className="text-sm text-gray-600">{item.product.maSanPham}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.product.maSanPham, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-12 text-center">{item.quantity}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => updateQuantity(item.product.maSanPham, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => {
                                                            const newPrice = Number(e.target.value)
                                                            setImportItems(items =>
                                                                items.map(i =>
                                                                    i.product.maSanPham === item.product.maSanPham
                                                                        ? { ...i, price: newPrice }
                                                                        : i
                                                                )
                                                            )
                                                        }}
                                                        className="w-24"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {(item.price * item.quantity).toLocaleString()} VNĐ
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => removeItem(item.product.maSanPham)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium">Tổng tiền:</span>
                                        <span className="text-xl font-bold text-green-600">
                                            {calculateTotal().toLocaleString()} VNĐ
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsImportDialogOpen(false)
                                setSelectedSupplier(null)
                                setImportItems([])
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={importItems.length === 0}
                            className="bg-green-600 text-white hover:bg-green-700"
                        >
                            Xác nhận nhập hàng
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
