// "use client"

// import type { ImportItem } from "@/types/import"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Trash2 } from "lucide-react"

// interface ImportItemsTableProps {
//     items: ImportItem[]
//     onDeleteItem: (importItemId: number) => void
//     disabled?: boolean
// }

// export function ImportItemsTable({ items, onDeleteItem, disabled }: ImportItemsTableProps) {
//     const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0)

//     return (
//         <div className="space-y-6">
//             <div className="overflow-hidden rounded-xl border-2 border-gray-200">
//                 <Table>
//                     <TableHeader>
//                         <TableRow className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100">
//                             <TableHead className="w-[60px] font-bold text-green-900">STT</TableHead>
//                             <TableHead className="font-bold text-green-900">Tên Sản Phẩm</TableHead>
//                             <TableHead className="font-bold text-green-900">Mã Vạch</TableHead>
//                             <TableHead className="text-right font-bold text-green-900">Số Lượng</TableHead>
//                             <TableHead className="text-right font-bold text-green-900">Đơn Giá</TableHead>
//                             <TableHead className="text-right font-bold text-green-900">Thành Tiền</TableHead>
//                             <TableHead className="w-[80px]"></TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {items.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
//                                     Chưa có sản phẩm nào
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             items.map((item, index) => (
//                                 <TableRow key={item.importItemId} className="hover:bg-green-50/50">
//                                     <TableCell className="font-medium">{index + 1}</TableCell>
//                                     <TableCell className="font-semibold">{item.productName}</TableCell>
//                                     <TableCell className="text-muted-foreground">{item.barcode}</TableCell>
//                                     <TableCell className="text-right font-medium">
//                                         {item.quantity} {item.unit}
//                                     </TableCell>
//                                     <TableCell className="text-right">{item.unitPrice.toLocaleString("vi-VN")}đ</TableCell>
//                                     <TableCell className="text-right text-base font-bold text-green-700">
//                                         {item.subtotal.toLocaleString("vi-VN")}đ
//                                     </TableCell>
//                                     <TableCell>
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             onClick={() => onDeleteItem(item.importItemId)}
//                                             disabled={disabled}
//                                             className="h-9 w-9 text-destructive transition-all hover:scale-110 hover:bg-red-50 hover:text-destructive"
//                                         >
//                                             <Trash2 className="h-4 w-4" />
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             <div className="flex justify-end">
//                 <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-6 shadow-lg">
//                     <div className="text-sm font-medium text-green-700">Tổng tiền</div>
//                     <div className="mt-1 text-3xl font-bold text-green-900">{totalAmount.toLocaleString("vi-VN")}đ</div>
//                 </div>
//             </div>
//         </div>
//     )
// }
