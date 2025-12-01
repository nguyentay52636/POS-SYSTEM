// "use client"

// import { useState, useMemo } from "react"
// import useSWR from "swr"
// import { getAllProducts, getProductsBySupplier } from "@/lib/api/products"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent } from "@/components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Search, Plus, Package, Barcode, Filter, X, SortAsc, SortDesc } from "lucide-react"
// import { Badge } from "@/components/ui/badge"
// import { IProduct } from "@/types/types"

// interface AdvancedProductSearchProps {
//     onAddProduct: (product: IProduct, quantity: number, unitPrice: number) => void
//     disabled?: boolean
//     supplierId?: number
// }



// type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc"

// export function AdvancedProductSearch({ onAddProduct, disabled, supplierId }: AdvancedProductSearchProps) {
//     const [searchTerm, setSearchTerm] = useState("")
//     const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
//     const [minPrice, setMinPrice] = useState<string>("")
//     const [maxPrice, setMaxPrice] = useState<string>("")
//     const [sortBy, setSortBy] = useState<SortOption>("name-asc")
//     const [showFilters, setShowFilters] = useState(false)

//     const [selectedProductId, setSelectedProductId] = useState<number>()
//     const [quantity, setQuantity] = useState<number>(1)
//     const [unitPrice, setUnitPrice] = useState<number>(0)

//     const { data: products, isLoading } = useSWR<Product[]>(
//         supplierId ? `products-supplier-${supplierId}` : "products",
//         () => (supplierId ? getProductsBySupplier(supplierId) : getAllProducts()),
//     )

//     // Filter và sort products
//     const filteredProducts = useMemo(() => {
//         if (!products) return []

//         let filtered = [...products]

//         // Tìm kiếm theo tên, barcode
//         if (searchTerm) {
//             const term = searchTerm.toLowerCase()
//             filtered = filtered.filter(
//                 (p) => p.productName.toLowerCase().includes(term) || p.barcode?.toLowerCase().includes(term),
//             )
//         }

//         // Lọc theo danh mục
//         if (selectedCategoryId !== "all") {
//             filtered = filtered.filter((p) => p.categoryId === Number(selectedCategoryId))
//         }

//         // Lọc theo giá
//         if (minPrice) {
//             filtered = filtered.filter((p) => p.price >= Number(minPrice))
//         }
//         if (maxPrice) {
//             filtered = filtered.filter((p) => p.price <= Number(maxPrice))
//         }

//         // Sắp xếp
//         filtered.sort((a, b) => {
//             switch (sortBy) {
//                 case "name-asc":
//                     return a.productName.localeCompare(b.productName, "vi")
//                 case "name-desc":
//                     return b.productName.localeCompare(a.productName, "vi")
//                 case "price-asc":
//                     return a.price - b.price
//                 case "price-desc":
//                     return b.price - a.price
//                 default:
//                     return 0
//             }
//         })

//         return filtered
//     }, [products, searchTerm, selectedCategoryId, minPrice, maxPrice, sortBy])

//     const selectedProduct = products?.find((p) => p.productId === selectedProductId)

//     const handleAddProduct = () => {
//         if (selectedProduct && quantity > 0 && unitPrice > 0) {
//             onAddProduct(selectedProduct, quantity, unitPrice)
//             // Reset
//             setSelectedProductId(undefined)
//             setQuantity(1)
//             setUnitPrice(0)
//         }
//     }

//     const handleClearFilters = () => {
//         setSearchTerm("")
//         setSelectedCategoryId("all")
//         setMinPrice("")
//         setMaxPrice("")
//         setSortBy("name-asc")
//     }

//     const activeFiltersCount = useMemo(() => {
//         let count = 0
//         if (searchTerm) count++
//         if (selectedCategoryId !== "all") count++
//         if (minPrice || maxPrice) count++
//         if (sortBy !== "name-asc") count++
//         return count
//     }, [searchTerm, selectedCategoryId, minPrice, maxPrice, sortBy])

//     return (
//         <div className="space-y-5">
//             {supplierId && (
//                 <div className="rounded-lg bg-green-50 border-2 border-green-200 p-3">
//                     <p className="text-sm text-green-800 font-medium">Đang hiển thị sản phẩm của nhà cung cấp đã chọn</p>
//                 </div>
//             )}

//             <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                     <Label className="text-base font-semibold text-gray-900">
//                         <div className="flex items-center gap-2">
//                             <Search className="h-4 w-4 text-green-700" />
//                             Tìm kiếm sản phẩm
//                         </div>
//                     </Label>
//                     <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
//                         <Filter className="h-4 w-4" />
//                         Bộ lọc
//                         {activeFiltersCount > 0 && <Badge className="bg-green-600 text-white">{activeFiltersCount}</Badge>}
//                     </Button>
//                 </div>

//                 <div className="relative">
//                     <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//                     <Input
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         placeholder="Tìm theo tên sản phẩm hoặc mã vạch..."
//                         className="h-12 border-2 pl-11 pr-4 transition-all hover:border-green-300 focus:border-green-500"
//                         disabled={disabled}
//                     />
//                     {searchTerm && (
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="absolute right-2 top-1/2 -translate-y-1/2"
//                             onClick={() => setSearchTerm("")}
//                         >
//                             <X className="h-4 w-4" />
//                         </Button>
//                     )}
//                 </div>
//             </div>

//             {showFilters && (
//                 <Card className="border-2 border-green-200 bg-green-50/50">
//                     <CardContent className="pt-6 space-y-4">
//                         <div className="flex items-center justify-between">
//                             <h4 className="font-semibold text-green-800">Bộ lọc nâng cao</h4>
//                             {activeFiltersCount > 0 && (
//                                 <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={handleClearFilters}
//                                     className="text-green-700 hover:text-green-800"
//                                 >
//                                     <X className="h-4 w-4 mr-1" />
//                                     Xóa bộ lọc
//                                 </Button>
//                             )}
//                         </div>

//                         {/* Category Filter */}
//                         <div className="space-y-2">
//                             <Label className="text-sm font-semibold">Danh mục</Label>
//                             <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId} disabled={disabled}>
//                                 <SelectTrigger className="h-10 bg-white border-2">
//                                     <SelectValue placeholder="Tất cả danh mục" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">Tất cả danh mục</SelectItem>
//                                     {mockCategories.map((cat) => (
//                                         <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
//                                             {cat.categoryName}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         {/* Price Range Filter */}
//                         <div className="space-y-2">
//                             <Label className="text-sm font-semibold">Khoảng giá (VNĐ)</Label>
//                             <div className="grid grid-cols-2 gap-3">
//                                 <Input
//                                     type="number"
//                                     placeholder="Giá từ"
//                                     value={minPrice}
//                                     onChange={(e) => setMinPrice(e.target.value)}
//                                     className="h-10 bg-white border-2"
//                                     disabled={disabled}
//                                 />
//                                 <Input
//                                     type="number"
//                                     placeholder="Giá đến"
//                                     value={maxPrice}
//                                     onChange={(e) => setMaxPrice(e.target.value)}
//                                     className="h-10 bg-white border-2"
//                                     disabled={disabled}
//                                 />
//                             </div>
//                         </div>

//                         {/* Sort Options */}
//                         <div className="space-y-2">
//                             <Label className="text-sm font-semibold">Sắp xếp theo</Label>
//                             <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)} disabled={disabled}>
//                                 <SelectTrigger className="h-10 bg-white border-2">
//                                     <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="name-asc">
//                                         <div className="flex items-center gap-2">
//                                             <SortAsc className="h-4 w-4" />
//                                             Tên A-Z
//                                         </div>
//                                     </SelectItem>
//                                     <SelectItem value="name-desc">
//                                         <div className="flex items-center gap-2">
//                                             <SortDesc className="h-4 w-4" />
//                                             Tên Z-A
//                                         </div>
//                                     </SelectItem>
//                                     <SelectItem value="price-asc">
//                                         <div className="flex items-center gap-2">
//                                             <SortAsc className="h-4 w-4" />
//                                             Giá thấp đến cao
//                                         </div>
//                                     </SelectItem>
//                                     <SelectItem value="price-desc">
//                                         <div className="flex items-center gap-2">
//                                             <SortDesc className="h-4 w-4" />
//                                             Giá cao đến thấp
//                                         </div>
//                                     </SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             <div className="space-y-3">
//                 <Label className="text-base font-semibold text-gray-900">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             <Package className="h-4 w-4 text-green-700" />
//                             Chọn sản phẩm
//                         </div>
//                         <span className="text-sm font-normal text-muted-foreground">
//                             {isLoading ? "Đang tải..." : `${filteredProducts.length} sản phẩm`}
//                         </span>
//                     </div>
//                 </Label>
//                 <Select
//                     value={selectedProductId?.toString()}
//                     onValueChange={(val) => {
//                         const productId = Number(val)
//                         setSelectedProductId(productId)
//                         const product = products?.find((p) => p.productId === productId)
//                         if (product) {
//                             setUnitPrice(product.price)
//                         }
//                     }}
//                     disabled={disabled || isLoading}
//                 >
//                     <SelectTrigger className="h-12 border-2 transition-all hover:border-green-300">
//                         <SelectValue placeholder="Chọn sản phẩm từ danh sách..." />
//                     </SelectTrigger>
//                     <SelectContent className="max-h-[300px]">
//                         {filteredProducts.length === 0 ? (
//                             <div className="py-6 text-center text-sm text-muted-foreground">Không tìm thấy sản phẩm phù hợp</div>
//                         ) : (
//                             filteredProducts.map((product) => (
//                                 <SelectItem key={product.productId} value={product.productId.toString()} className="py-3">
//                                     <div className="flex flex-col gap-1">
//                                         <div className="flex items-center gap-2">
//                                             <span className="font-semibold">{product.productName}</span>
//                                             {product.barcode && (
//                                                 <Badge variant="outline" className="gap-1">
//                                                     <Barcode className="h-3 w-3" />
//                                                     {product.barcode}
//                                                 </Badge>
//                                             )}
//                                         </div>
//                                         <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                                             <span className="font-medium text-green-700">
//                                                 {product.price.toLocaleString("vi-VN")}đ/{product.unit}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </SelectItem>
//                             ))
//                         )}
//                     </SelectContent>
//                 </Select>
//             </div>

//             {/* Quantity and Price Inputs */}
//             <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                     <Label className="font-semibold">Số lượng</Label>
//                     <Input
//                         type="number"
//                         min="1"
//                         value={quantity}
//                         onChange={(e) => setQuantity(Number(e.target.value))}
//                         disabled={disabled || !selectedProductId}
//                         className="h-12 border-2 transition-all hover:border-green-300"
//                     />
//                 </div>
//                 <div className="space-y-2">
//                     <Label className="font-semibold">Đơn giá nhập (VNĐ)</Label>
//                     <Input
//                         type="number"
//                         min="0"
//                         step="1000"
//                         value={unitPrice}
//                         onChange={(e) => setUnitPrice(Number(e.target.value))}
//                         disabled={disabled || !selectedProductId}
//                         className="h-12 border-2 transition-all hover:border-green-300"
//                     />
//                 </div>
//             </div>

//             {/* Subtotal Display */}
//             {selectedProduct && (
//                 <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-5">
//                     <div className="space-y-2">
//                         <div className="flex items-center justify-between text-sm">
//                             <span className="text-green-700">Giá bán lẻ:</span>
//                             <span className="font-medium">{selectedProduct.price.toLocaleString("vi-VN")}đ</span>
//                         </div>
//                         <div className="flex items-center justify-between border-t border-green-200 pt-2">
//                             <span className="text-base font-medium text-green-700">Thành tiền:</span>
//                             <span className="text-2xl font-bold text-green-900">
//                                 {(quantity * unitPrice).toLocaleString("vi-VN")}đ
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add Button */}
//             <Button
//                 onClick={handleAddProduct}
//                 disabled={disabled || !selectedProductId || quantity <= 0 || unitPrice <= 0}
//                 className="h-12 w-full bg-green-700 text-base font-semibold shadow-lg transition-all hover:scale-105 hover:bg-green-800"
//             >
//                 <Plus className="mr-2 h-5 w-5" />
//                 Thêm vào phiếu nhập
//             </Button>
//         </div>
//     )
// }
