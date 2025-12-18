import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { IProduct } from "@/types/types"
import ProductTableEmpty from "@/components/Admin/components/Products/components/ProductTableEmpty"

interface TableChoiceProductProps {
  products: IProduct[]
  selectedIds: number[]
  onToggleSelect: (productId: number) => void
  onToggleSelectAll: () => void
}

const TABLE_HEADERS = [
  "Chọn",
  "Mã sản phẩm",
  "Sản phẩm",
  "Barcode",
  "Danh mục",
  "Nhà cung cấp",
  "Giá bán",
  "Đơn vị tính",
  "Trạng thái",
] as const

export default function TableChoiceProduct({
  products,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: TableChoiceProductProps) {
  const allIds = products.map((p) => p.productId).filter((id): id is number => typeof id === "number")
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id))
  const someSelected = allIds.some((id) => selectedIds.includes(id))

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
                {header === "Chọn" ? (
                  <Checkbox
                    checked={allSelected || (someSelected ? "indeterminate" : false)}
                    onCheckedChange={() => onToggleSelectAll()}
                    aria-label="Chọn tất cả sản phẩm"
                  />
                ) : (
                  header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length === 0 ? (
            <ProductTableEmpty />
          ) : (
            products.map((product) => {
              const id = product.productId
              const checked = id != null && selectedIds.includes(id)
              return (
                <TableRow key={product.productId} className="hover:bg-gray-50/60 dark:hover:bg-gray-900/50">
                  {/* Checkbox */}
                  <TableCell>
                    {id != null && (
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => onToggleSelect(id)}
                        aria-label={`Chọn sản phẩm ${product.productName}`}
                      />
                    )}
                  </TableCell>

                  {/* Mã SP */}
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono text-gray-700 dark:bg-gray-900/70 dark:text-gray-300">
                      {product.productId}
                    </code>
                  </TableCell>

                  {/* Sản phẩm */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.productName}
                        className="h-10 w-10 rounded-lg border object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{product.productName}</p>
                        {product.productId && (
                          <span className="text-xs text-gray-500">#{product.productId}</span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Barcode */}
                  <TableCell>
                    <code className="rounded bg-gray-100 px-2 py-1 text-sm font-mono text-gray-700 dark:bg-gray-900/70 dark:text-gray-300">
                      {product.barcode || "-"}
                    </code>
                  </TableCell>

                  {/* Danh mục */}
                  <TableCell>{product.category?.categoryName || "-"}</TableCell>

                  {/* NCC */}
                  <TableCell>{product.supplier?.name || "-"}</TableCell>

                  {/* Giá bán */}
                  <TableCell>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {product.price?.toLocaleString("vi-VN")} ₫
                    </span>
                  </TableCell>

                  {/* Tồn kho */}
                  <TableCell>{product.unit}</TableCell>

                  {/* Trạng thái */}
                  <TableCell>{product.status || "-"}</TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

