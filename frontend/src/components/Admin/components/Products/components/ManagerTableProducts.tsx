import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IProduct } from "@/types/types"
import ProductTableRow from "./ProductTableRow"
import ProductTableEmpty from "./ProductTableEmpty"

interface ManagerTableProductsProps {
    products: IProduct[]
    onEdit: (product: IProduct) => void
    onToggleStatus: (productId: string) => void
    onView: (product: IProduct) => void
    onDelete: (productId: string) => void
}

const TABLE_HEADERS = [
    "Mã sản phẩm",
    "Sản phẩm",
    "Barcode",
    "Danh mục",
    "Nhà cung cấp",
    "Giá bán",
    "Trạng thái",
    "Thao tác",
] as const

export default function ManagerTableProducts({
    products,
    onEdit,
    onToggleStatus,
    onView,
    onDelete,
}: ManagerTableProductsProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900/40">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50/70 dark:bg-gray-900/70">
                        {TABLE_HEADERS.map((header, index) => (
                            <TableHead
                                key={header}
                                className={`font-semibold text-gray-900 dark:text-white ${index === TABLE_HEADERS.length - 1 ? "text-right" : ""
                                    }`}
                            >
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {products.length === 0 ? (
                        <ProductTableEmpty />
                    ) : (
                        products.map((product) => (
                            <ProductTableRow
                                key={product.productId}
                                product={product}
                                onView={onView}
                                onEdit={onEdit}
                                onToggleStatus={onToggleStatus}
                                onDelete={onDelete}
                            />
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
