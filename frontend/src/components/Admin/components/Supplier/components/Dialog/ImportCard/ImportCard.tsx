import React, { useState, useMemo, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Plus, Minus, Trash2, Loader2 } from 'lucide-react'
import { ISupplier, IProduct } from '@/types/types'
import { useProduct } from '@/hooks/useProduct'
import { formatPrice } from '@/utils/productUtils'
import ItemImportCard from './ItemImportCard'
import ActionsImportCard from './ActionsImportCard'
import { PaginationProvider, usePagination } from '@/context/PaginationContext'
import PaginationImportCard from './PaginationImportCard'

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
    product: IProduct
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
    const { products, loading: productsLoading } = useProduct()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [importDate, setImportDate] = useState(new Date().toISOString().split('T')[0])
    const [importItems, setImportItems] = useState<ImportItem[]>([])

    // Filter products by selected supplier + search + status
    const availableProducts = useMemo(() => {
        if (!selectedSupplier) return []
        const supplierId = selectedSupplier.supplierId
        const bySupplier = products.filter((product) => {
            const productSupplierId = product.supplierId || product.supplier?.supplierId
            return productSupplierId === supplierId
        })

        const bySearch = searchTerm
            ? bySupplier.filter(p =>
                (p.productName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.barcode || "").toLowerCase().includes(searchTerm.toLowerCase())
            )
            : bySupplier

        const byStatus = statusFilter === "all"
            ? bySearch
            : bySearch.filter(p => (p.status || "").toLowerCase() === statusFilter)

        return byStatus
    }, [products, selectedSupplier, searchTerm, statusFilter])

    const addProduct = (product: IProduct) => {
        const existingItem = importItems.find(item => item.product.productId === product.productId)
        if (existingItem) {
            setImportItems(items =>
                items.map(item =>
                    item.product.productId === product.productId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            )
        } else {
            // Use price as import price (you might want to add a separate importPrice field)
            setImportItems([...importItems, { product, quantity: 1, price: product.price }])
        }
    }

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            setImportItems(items => items.filter(item => item.product.productId !== productId))
        } else {
            setImportItems(items =>
                items.map(item =>
                    item.product.productId === productId
                        ? { ...item, quantity }
                        : item
                )
            )
        }
    }

    const removeItem = (productId: number) => {
        setImportItems(items => items.filter(item => item.product.productId !== productId))
    }

    const calculateTotal = () => {
        return importItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }

    const handleSubmit = () => {
        const importData = {
            ngayNhap: importDate,
            chiTietPhieuNhap: importItems.map(item => ({
                productId: item.product.productId,
                quantity: item.quantity,
                price: item.price
            })),
            tongTien: calculateTotal()
        }
        handleImportGoods(importData)
        setImportItems([])
    }

    if (!selectedSupplier) return null

    // Inner content uses pagination context
    return (
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogContent className="max-w-6xl! max-h-[90vh] overflow-y-auto">
                <PaginationProvider initialRowsPerPage={9}>
                    <ImportCardContent
                        selectedSupplier={selectedSupplier}
                        importDate={importDate}
                        setImportDate={setImportDate}
                        availableProducts={availableProducts}
                        productsLoading={productsLoading}
                        importItems={importItems}
                        setImportItems={setImportItems}
                        addProduct={addProduct}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                        calculateTotal={calculateTotal}
                        handleSubmit={handleSubmit}
                        setIsImportDialogOpen={setIsImportDialogOpen}
                        setSelectedSupplier={setSelectedSupplier}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                </PaginationProvider>
            </DialogContent>
        </Dialog>
    )
}

interface ImportCardContentProps {
    selectedSupplier: ISupplier
    importDate: string
    setImportDate: (v: string) => void
    availableProducts: IProduct[]
    productsLoading: boolean
    importItems: ImportItem[]
    setImportItems: React.Dispatch<React.SetStateAction<ImportItem[]>>
    addProduct: (p: IProduct) => void
    updateQuantity: (productId: number, quantity: number) => void
    removeItem: (productId: number) => void
    calculateTotal: () => number
    handleSubmit: () => void
    setIsImportDialogOpen: (open: boolean) => void
    setSelectedSupplier: (supplier: ISupplier | null) => void
    searchTerm: string
    setSearchTerm: (v: string) => void
    statusFilter: string
    setStatusFilter: (v: string) => void
}

function ImportCardContent(props: ImportCardContentProps) {
    const {
        selectedSupplier,
        importDate,
        setImportDate,
        availableProducts,
        productsLoading,
        importItems,
        setImportItems,
        addProduct,
        updateQuantity,
        removeItem,
        calculateTotal,
        handleSubmit,
        setIsImportDialogOpen,
        setSelectedSupplier,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
    } = props

    const {
        paginationState,
        setCurrentPage,
        setRowsPerPage,
        setTotalItems,
    } = usePagination()

    // luôn đặt rowsPerPage = 9
    useEffect(() => {
        setRowsPerPage(9)
    }, [setRowsPerPage])

    // cập nhật tổng items khi danh sách thay đổi
    useEffect(() => {
        setTotalItems(availableProducts.length)
    }, [availableProducts.length, setTotalItems])

    const start = (paginationState.currentPage - 1) * paginationState.rowsPerPage
    const end = start + paginationState.rowsPerPage
    const paginatedProducts = availableProducts.slice(start, end)

    return (
        <>
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
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                Sản phẩm có thể nhập ({availableProducts.length})
                            </CardTitle>

                        </div>
                        <ActionsImportCard
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                        />
                    </CardHeader>
                    <CardContent>
                        {productsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-green-700 mr-2" />
                                <p className="text-gray-600">Đang tải sản phẩm...</p>
                            </div>
                        ) : availableProducts.length === 0 ? (<>
                            <div className="text-center py-12">
                                <p className="text-gray-500">Không có sản phẩm nào từ nhà cung cấp này</p>
                            </div>
                            <div>

                            </div>
                        </>
                        ) : (
                            <div className="space-y-4">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {paginatedProducts.map((product) => (
                                        <ItemImportCard
                                            key={product.productId}
                                            product={product}
                                            onAdd={addProduct}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
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
                                        <TableRow key={item.product.productId}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{item.product.productName}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {item.product.productId}
                                                        {item.product.barcode && ` - ${item.product.barcode}`}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateQuantity(item.product.productId!, item.quantity - 1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-12 text-center">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateQuantity(item.product.productId!, item.quantity + 1)}
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
                                                                i.product.productId === item.product.productId
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
                                                    onClick={() => removeItem(item.product.productId!)}
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

                <PaginationImportCard totalItems={availableProducts.length} />
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
        </>
    )
}
