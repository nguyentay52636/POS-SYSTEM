import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import type { IProduct } from '@/types/types'
import { formatPrice } from '@/utils/productUtils'

interface ItemImportCardProps {
  product: IProduct
  onAdd: (product: IProduct) => void
}

export default function ItemImportCard({ product, onAdd }: ItemImportCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900">{product.productName}</h4>
        <div className="flex items-center justify-between gap-3 p-2">
          <div className="text-sm text-gray-600 space-y-1">
            <p>Mã SP: {product.productId}</p>
            {product.barcode && <p>Barcode: {product.barcode}</p>}
            <p>Giá nhập: {formatPrice(product.price)}</p>
            <p>Tồn kho: {product.unit}</p>
            {product.category?.categoryName && (
              <p>Danh mục: {product.category.categoryName}</p>
            )}
          </div>
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.productName || 'product image'}
              width={140}
              height={90}
              className="object-cover rounded-md border"
            />
          )}
        </div>
        <Button
          size="sm"
          onClick={() => onAdd(product)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm vào phiếu nhập
        </Button>
      </div>
    </div>
  )
}