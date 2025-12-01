// "use client"

// import { useState } from "react"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
// // import { AdvancedProductSearch } from "./advanced-product-search"

// interface AddProductDialogProps {
//     onAddProduct: (product: Product, quantity: number, unitPrice: number) => void
//     disabled?: boolean
//     supplierId?: number
// }

// export function DialogAddProduct({ onAddProduct, disabled, supplierId }: AddProductDialogProps) {
//     const [open, setOpen] = useState(false)

//     const handleAddProduct = (product: Product, quantity: number, unitPrice: number) => {
//         onAddProduct(product, quantity, unitPrice)
//         setOpen(false)
//     }

//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button
//                     disabled={disabled}
//                     className="h-12 w-full bg-green-700 text-base font-semibold shadow-lg transition-all hover:scale-105 hover:bg-green-800"
//                 >
//                     <Plus className="mr-2 h-5 w-5" />
//                     Thêm Sản Phẩm
//                 </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle className="text-2xl font-bold text-green-800">Tìm kiếm và thêm sản phẩm</DialogTitle>
//                     <DialogDescription>Tìm kiếm sản phẩm, nhập số lượng và đơn giá nhập hàng</DialogDescription>
//                 </DialogHeader>
//                 <div className="py-4">
//                     <AdvancedProductSearch onAddProduct={handleAddProduct} disabled={disabled} supplierId={supplierId} />
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }
