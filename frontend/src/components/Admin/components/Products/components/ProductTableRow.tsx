import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { IProduct } from "@/types/types"
import { formatPrice, getCategoryName, getSupplierName } from "@/utils/productUtils"
import ProductStatusBadge from "./ProductStatusBadge"

interface ProductTableRowProps {
    product: IProduct
    onView: (product: IProduct) => void
    onEdit: (product: IProduct) => void
    onDelete: (productId: string) => void
}

export default function ProductTableRow({
    product,
    onView,
    onEdit,
    onDelete,
}: ProductTableRowProps) {
    return (
        <TableRow key={product.productId} className="hover:bg-gray-50/60 dark:hover:bg-gray-900/50">
            <TableCell>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono text-gray-700 dark:bg-gray-900/70 dark:text-gray-300">
                    {product.productId}
                </code>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-3">
                    <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.productName}
                        className="h-12 w-12 rounded-lg border object-cover shadow-sm"
                    />
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.productName}</p>
                        {product.productId && (
                            <code className="text-xs text-gray-500 dark:text-gray-400">#{product.productId}</code>
                        )}
                    </div>
                </div>
            </TableCell>

            <TableCell>
                <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono text-gray-700 dark:bg-gray-900/70 dark:text-gray-300">
                    {product.barcode}
                </code>
            </TableCell>

            <TableCell>
                <span className="text-sm text-gray-700 dark:text-gray-200">{getCategoryName(product)}</span>
            </TableCell>

            <TableCell>
                <span className="text-sm text-gray-700 dark:text-gray-200">{getSupplierName(product)}</span>
            </TableCell>

            <TableCell>
                <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
            </TableCell>

            <TableCell>
                <span
                    className={
                        product.unit > 0
                            ? "font-medium text-gray-900 dark:text-white"
                            : "font-medium text-red-600"
                    }
                >
                    {product.unit}
                </span>
            </TableCell>

            <TableCell>
                <ProductStatusBadge status={product.status || ""} />
            </TableCell>

            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                        onClick={() => onView(product)}
                    >
                        <Eye className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/40"
                        onClick={() => onEdit(product)}
                    >
                        <Edit className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/40"
                        onClick={() => onDelete(product.productId?.toString() ?? "")}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

