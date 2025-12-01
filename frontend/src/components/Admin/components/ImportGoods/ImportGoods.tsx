// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { PackagePlus, Trash2, Check, X, FileText, TrendingUp, Package, DollarSign } from "lucide-react"
// import { toast } from "sonner"
// import { DialogAddProduct } from "./components/Dialog/DialogAddProduct"

// interface Supplier {
//     supplierId: number
//     name: string
//     phone: string
//     address: string
// }

// interface Product {
//     productId: number
//     productName: string
//     unit: string
//     currentStock: number
// }

// interface ImportItem {
//     productId: number
//     productName: string
//     quantity: number
//     unitPrice: number
//     subtotal: number
// }

// interface ImportReceipt {
//     importId: number
//     supplierName: string
//     importDate: string
//     totalAmount: number
//     status: "pending" | "completed" | "canceled"
//     itemCount: number
// }

// export default function ImportGoods() {
//     // Mock data
//     const suppliers: Supplier[] = [
//         {
//             supplierId: 1,
//             name: "Công ty TNHH Thực phẩm Sạch",
//             phone: "0901234567",
//             address: "123 Nguyễn Văn Linh, Q7, TP.HCM",
//         },
//         { supplierId: 2, name: "Nhà Cung Cấp Rau Củ Đà Lạt", phone: "0912345678", address: "456 Lê Văn Việt, Q9, TP.HCM" },
//         {
//             supplierId: 3,
//             name: "Công ty CP Thực phẩm An Lành",
//             phone: "0923456789",
//             address: "789 Võ Văn Ngân, Thủ Đức, TP.HCM",
//         },
//     ]

//     const products: Product[] = [
//         { productId: 1, productName: "Gạo ST25", unit: "kg", currentStock: 120 },
//         { productId: 2, productName: "Dầu ăn Neptune", unit: "chai", currentStock: 45 },
//         { productId: 3, productName: "Nước mắm Nam Ngư", unit: "chai", currentStock: 80 },
//         { productId: 4, productName: "Đường trắng", unit: "kg", currentStock: 200 },
//         { productId: 5, productName: "Muối i-ốt", unit: "gói", currentStock: 150 },
//     ]

//     const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null)
//     const [importItems, setImportItems] = useState<ImportItem[]>([])
//     const [note, setNote] = useState<string>("")
//     const [importReceipts, setImportReceipts] = useState<ImportReceipt[]>([
//         {
//             importId: 1,
//             supplierName: "Công ty TNHH Thực phẩm Sạch",
//             importDate: "2024-01-15",
//             totalAmount: 5000000,
//             status: "completed",
//             itemCount: 5,
//         },
//         {
//             importId: 2,
//             supplierName: "Nhà Cung Cấp Rau Củ Đà Lạt",
//             importDate: "2024-01-16",
//             totalAmount: 3500000,
//             status: "pending",
//             itemCount: 3,
//         },
//     ])

//     const selectedSupplierInfo = suppliers.find((s) => s.supplierId === selectedSupplier)
//     const totalAmount = importItems.reduce((sum, item) => sum + item.subtotal, 0)

//     const handleAddProduct = (product: Product, qty: number, price: number) => {
//         if (!product || qty <= 0 || price <= 0) {
//             toast.error("Vui lòng điền đầy đủ thông tin sản phẩm")
//             return
//         }

//         const existingItem = importItems.find((item) => item.productId === product.productId)

//         if (existingItem) {
//             setImportItems(
//                 importItems.map((item) =>
//                     item.productId === product.productId
//                         ? { ...item, quantity: item.quantity + qty, subtotal: (item.quantity + qty) * item.unitPrice }
//                         : item,
//                 ),
//             )
//             toast.success("Đã cập nhật số lượng sản phẩm")
//         } else {
//             setImportItems([
//                 ...importItems,
//                 {
//                     productId: product.productId,
//                     productName: product.productName,
//                     quantity: qty,
//                     unitPrice: price,
//                     subtotal: qty * price,
//                 },
//             ])
//             toast.success("Đã thêm sản phẩm vào phiếu nhập")
//         }
//     }

//     const handleRemoveProduct = (productId: number) => {
//         setImportItems(importItems.filter((item) => item.productId !== productId))
//         toast.info("Đã xóa sản phẩm khỏi phiếu nhập")
//     }

//     const handleCreateReceipt = () => {
//         if (!selectedSupplier) {
//             toast.error("Vui lòng chọn nhà cung cấp")
//             return
//         }

//         if (importItems.length === 0) {
//             toast.error("Vui lòng thêm ít nhất một sản phẩm")
//             return
//         }

//         // Tạo phiếu nhập mới với status = "pending"
//         const newReceipt: ImportReceipt = {
//             importId: importReceipts.length + 1,
//             supplierName: selectedSupplierInfo?.name || "",
//             importDate: new Date().toISOString().split("T")[0],
//             totalAmount: totalAmount,
//             status: "pending",
//             itemCount: importItems.length,
//         }

//         setImportReceipts([newReceipt, ...importReceipts])
//         toast.success("Đã tạo phiếu nhập thành công")

//         // Reset form but keep the receipt to complete it
//     }

//     const handleCompleteReceipt = () => {
//         if (importReceipts.length === 0) return

//         // Cập nhật trạng thái phiếu nhập thành "completed"
//         // Và cập nhật tồn kho cho các sản phẩm
//         const latestReceipt = importReceipts[0]
//         if (latestReceipt.status === "pending") {
//             setImportReceipts(
//                 importReceipts.map((receipt, index) => (index === 0 ? { ...receipt, status: "completed" } : receipt)),
//             )
//             toast.success("Đã hoàn tất phiếu nhập và cập nhật tồn kho")

//             // Reset form
//             setSelectedSupplier(null)
//             setImportItems([])
//             setNote("")
//         }
//     }

//     const handleCancelReceipt = () => {
//         setSelectedSupplier(null)
//         setImportItems([])
//         setNote("")
//         toast.info("Đã hủy phiếu nhập")
//     }

//     const getStatusBadge = (status: string) => {
//         switch (status) {
//             case "completed":
//                 return (
//                     <Badge className="bg-green-600 hover:bg-green-700">
//                         <Check className="h-3 w-3 mr-1" />
//                         Đã hoàn tất
//                     </Badge>
//                 )
//             case "pending":
//                 return (
//                     <Badge className="bg-yellow-600 hover:bg-yellow-700">
//                         <FileText className="h-3 w-3 mr-1" />
//                         Đang xử lý
//                     </Badge>
//                 )
//             case "canceled":
//                 return (
//                     <Badge variant="destructive">
//                         <X className="h-3 w-3 mr-1" />
//                         Đã hủy
//                     </Badge>
//                 )
//             default:
//                 return <Badge variant="secondary">{status}</Badge>
//         }
//     }

//     const stats = {
//         totalReceipts: importReceipts.length,
//         pendingReceipts: importReceipts.filter((r) => r.status === "pending").length,
//         completedReceipts: importReceipts.filter((r) => r.status === "completed").length,
//         totalValue: importReceipts.reduce((sum, r) => sum + r.totalAmount, 0),
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
//                 <div className="container mx-auto px-6 py-6">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
//                             <PackagePlus className="h-8 w-8" />
//                         </div>
//                         <div>
//                             <h1 className="text-3xl font-bold">Quản Lý Nhập Hàng</h1>
//                             <p className="text-green-100 mt-1">Hệ thống quản lý nhập hàng Bách Hoá Xanh</p>
//                         </div>
//                     </div>

//                     {/* Stats Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
//                         <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                             <div className="flex items-center gap-3">
//                                 <div className="bg-white/20 p-2 rounded-lg">
//                                     <FileText className="h-5 w-5" />
//                                 </div>
//                                 <div>
//                                     <p className="text-green-100 text-sm">Tổng phiếu nhập</p>
//                                     <p className="text-2xl font-bold">{stats.totalReceipts}</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                             <div className="flex items-center gap-3">
//                                 <div className="bg-yellow-500/20 p-2 rounded-lg">
//                                     <TrendingUp className="h-5 w-5" />
//                                 </div>
//                                 <div>
//                                     <p className="text-green-100 text-sm">Đang xử lý</p>
//                                     <p className="text-2xl font-bold">{stats.pendingReceipts}</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                             <div className="flex items-center gap-3">
//                                 <div className="bg-green-500/20 p-2 rounded-lg">
//                                     <Package className="h-5 w-5" />
//                                 </div>
//                                 <div>
//                                     <p className="text-green-100 text-sm">Đã hoàn tất</p>
//                                     <p className="text-2xl font-bold">{stats.completedReceipts}</p>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                             <div className="flex items-center gap-3">
//                                 <div className="bg-blue-500/20 p-2 rounded-lg">
//                                     <DollarSign className="h-5 w-5" />
//                                 </div>
//                                 <div>
//                                     <p className="text-green-100 text-sm">Tổng giá trị</p>
//                                     <p className="text-2xl font-bold">{(stats.totalValue / 1000000).toFixed(1)}M</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="container mx-auto px-6 py-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* Left: Form tạo phiếu nhập */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Card 1: Chọn nhà cung cấp */}
//                         <Card className="border-2 border-green-100 shadow-lg hover:shadow-xl transition-shadow">
//                             <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
//                                 <CardTitle className="text-green-800">Bước 1: Chọn Nhà Cung Cấp</CardTitle>
//                                 <CardDescription>Chọn nhà cung cấp để tạo phiếu nhập hàng</CardDescription>
//                             </CardHeader>
//                             <CardContent className="pt-6">
//                                 <div className="space-y-4">
//                                     <div>
//                                         <Label htmlFor="supplier" className="text-base font-semibold">
//                                             Nhà cung cấp
//                                         </Label>
//                                         <Select
//                                             value={selectedSupplier?.toString()}
//                                             onValueChange={(value) => setSelectedSupplier(Number.parseInt(value))}
//                                         >
//                                             <SelectTrigger className="h-12 border-2 border-green-200 focus:border-green-500">
//                                                 <SelectValue placeholder="Chọn nhà cung cấp..." />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {suppliers.map((supplier) => (
//                                                     <SelectItem key={supplier.supplierId} value={supplier.supplierId.toString()}>
//                                                         <div className="font-medium">{supplier.name}</div>
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>

//                                     {selectedSupplierInfo && (
//                                         <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-2">
//                                             <div className="flex items-start gap-2">
//                                                 <span className="font-semibold text-green-800 min-w-24">Tên:</span>
//                                                 <span className="text-gray-700">{selectedSupplierInfo.name}</span>
//                                             </div>
//                                             <div className="flex items-start gap-2">
//                                                 <span className="font-semibold text-green-800 min-w-24">Điện thoại:</span>
//                                                 <span className="text-gray-700">{selectedSupplierInfo.phone}</span>
//                                             </div>
//                                             <div className="flex items-start gap-2">
//                                                 <span className="font-semibold text-green-800 min-w-24">Địa chỉ:</span>
//                                                 <span className="text-gray-700">{selectedSupplierInfo.address}</span>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </CardContent>
//                         </Card>

//                         {/* Card 2: Thêm sản phẩm */}
//                         <Card className="border-2 border-green-100 shadow-lg hover:shadow-xl transition-shadow">
//                             <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
//                                 <CardTitle className="text-green-800">Bước 2: Thêm Sản Phẩm</CardTitle>
//                                 <CardDescription>Chọn sản phẩm và nhập số lượng, đơn giá</CardDescription>
//                             </CardHeader>
//                             <CardContent className="pt-6">
//                                 <DialogAddProduct
//                                     onAddProduct={handleAddProduct}
//                                     disabled={!selectedSupplier}
//                                     supplierId={selectedSupplier ?? undefined}
//                                 />
//                             </CardContent>
//                         </Card>

//                         {/* Card 3: Danh sách sản phẩm nhập */}
//                         <Card className="border-2 border-green-100 shadow-lg">
//                             <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
//                                 <CardTitle className="text-green-800">Bước 3: Chi Tiết Phiếu Nhập</CardTitle>
//                                 <CardDescription>Danh sách sản phẩm đã thêm vào phiếu nhập</CardDescription>
//                             </CardHeader>
//                             <CardContent className="pt-6">
//                                 {importItems.length === 0 ? (
//                                     <div className="text-center py-12 text-gray-500">
//                                         <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//                                         <p>Chưa có sản phẩm nào trong phiếu nhập</p>
//                                     </div>
//                                 ) : (
//                                     <div className="space-y-4">
//                                         <div className="border-2 border-green-200 rounded-lg overflow-hidden">
//                                             <Table>
//                                                 <TableHeader className="bg-green-50">
//                                                     <TableRow>
//                                                         <TableHead className="font-bold text-green-800">Sản phẩm</TableHead>
//                                                         <TableHead className="font-bold text-green-800 text-center">Số lượng</TableHead>
//                                                         <TableHead className="font-bold text-green-800 text-right">Đơn giá</TableHead>
//                                                         <TableHead className="font-bold text-green-800 text-right">Thành tiền</TableHead>
//                                                         <TableHead className="font-bold text-green-800 text-center">Thao tác</TableHead>
//                                                     </TableRow>
//                                                 </TableHeader>
//                                                 <TableBody>
//                                                     {importItems.map((item) => (
//                                                         <TableRow key={item.productId} className="hover:bg-green-50">
//                                                             <TableCell className="font-medium">{item.productName}</TableCell>
//                                                             <TableCell className="text-center">{item.quantity}</TableCell>
//                                                             <TableCell className="text-right">{item.unitPrice.toLocaleString("vi-VN")}đ</TableCell>
//                                                             <TableCell className="text-right font-semibold text-green-700">
//                                                                 {item.subtotal.toLocaleString("vi-VN")}đ
//                                                             </TableCell>
//                                                             <TableCell className="text-center">
//                                                                 <Button
//                                                                     variant="ghost"
//                                                                     size="sm"
//                                                                     onClick={() => handleRemoveProduct(item.productId)}
//                                                                     className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                                                                 >
//                                                                     <Trash2 className="h-4 w-4" />
//                                                                 </Button>
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))}
//                                                 </TableBody>
//                                             </Table>
//                                         </div>

//                                         <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-6">
//                                             <div className="flex justify-between items-center">
//                                                 <span className="text-xl font-semibold">Tổng tiền:</span>
//                                                 <span className="text-3xl font-bold">{totalAmount.toLocaleString("vi-VN")}đ</span>
//                                             </div>
//                                         </div>

//                                         <div>
//                                             <Label htmlFor="note" className="text-base font-semibold">
//                                                 Ghi chú
//                                             </Label>
//                                             <Textarea
//                                                 id="note"
//                                                 placeholder="Nhập ghi chú cho phiếu nhập..."
//                                                 value={note}
//                                                 onChange={(e) => setNote(e.target.value)}
//                                                 className="min-h-24 border-2 border-green-200 focus:border-green-500"
//                                             />
//                                         </div>

//                                         <div className="grid grid-cols-3 gap-3">
//                                             <Button
//                                                 onClick={handleCreateReceipt}
//                                                 className="bg-green-700 hover:bg-green-800 h-12 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
//                                             >
//                                                 <FileText className="h-5 w-5 mr-2" />
//                                                 Tạo Phiếu
//                                             </Button>
//                                             <Button
//                                                 onClick={handleCompleteReceipt}
//                                                 disabled={importReceipts.length === 0 || importReceipts[0]?.status !== "pending"}
//                                                 className="bg-blue-600 hover:bg-blue-700 h-12 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
//                                             >
//                                                 <Check className="h-5 w-5 mr-2" />
//                                                 Hoàn Tất
//                                             </Button>
//                                             <Button
//                                                 onClick={handleCancelReceipt}
//                                                 variant="destructive"
//                                                 className="h-12 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
//                                             >
//                                                 <X className="h-5 w-5 mr-2" />
//                                                 Hủy
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     </div>

//                     {/* Right: Danh sách phiếu nhập */}
//                     <div className="lg:col-span-1">
//                         <Card className="border-2 border-green-100 shadow-lg sticky top-6">
//                             <CardHeader className="bg-gradient-to-r from-green-50 to-white border-b border-green-100">
//                                 <CardTitle className="text-green-800">Phiếu Nhập Gần Đây</CardTitle>
//                                 <CardDescription>Danh sách các phiếu nhập hàng</CardDescription>
//                             </CardHeader>
//                             <CardContent className="pt-6">
//                                 <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
//                                     {importReceipts.map((receipt) => (
//                                         <div
//                                             key={receipt.importId}
//                                             className="bg-white border-2 border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
//                                         >
//                                             <div className="flex justify-between items-start mb-2">
//                                                 <div>
//                                                     <p className="font-bold text-green-800">PN#{receipt.importId.toString().padStart(4, "0")}</p>
//                                                     <p className="text-xs text-gray-500">{receipt.importDate}</p>
//                                                 </div>
//                                                 {getStatusBadge(receipt.status)}
//                                             </div>
//                                             <p className="text-sm font-medium text-gray-700 mb-2">{receipt.supplierName}</p>
//                                             <div className="flex justify-between items-center text-sm">
//                                                 <span className="text-gray-600">{receipt.itemCount} sản phẩm</span>
//                                                 <span className="font-bold text-green-700">{receipt.totalAmount.toLocaleString("vi-VN")}đ</span>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
