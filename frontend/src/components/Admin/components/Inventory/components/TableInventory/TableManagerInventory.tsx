import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Package, Eye, Edit, Trash2 } from 'lucide-react'
import { IInventory } from '@/types/types'
import { Switch } from '@/components/ui/switch'


interface TableManagerInventoryProps {
    inventories: IInventory[]
    filteredInventories: IInventory[]
    setSelectedInventory: (inventory: IInventory) => void
    setIsDetailDialogOpen: (open: boolean) => void
    setIsEditDialogOpen: (open: boolean) => void
    handleDeleteInventory: (inventoryId: number) => void
    onStatusChange: (id: number, status: boolean) => void
}

export default function TableManagerInventory({
    inventories,
    filteredInventories,
    setSelectedInventory,
    setIsDetailDialogOpen,
    setIsEditDialogOpen,
    handleDeleteInventory,
    onStatusChange
}: TableManagerInventoryProps) {
    return (
        <>
            <Card className="">
                <CardHeader>
                    <CardTitle>Danh sách tồn kho</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow >
                                    <TableHead className="font-semibold text-gray-900">Mã tồn kho</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Sản phẩm</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Nhà cung cấp</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Số lượng</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Ngày cập nhật</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInventories.map((inventory) => (
                                    <TableRow key={inventory.inventoryId} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                                                {inventory.inventoryId}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-200">
                                                    {inventory.product?.imageUrl ? (
                                                        <img
                                                            src={inventory.product.imageUrl}
                                                            alt={inventory.productName || inventory.product?.productName}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                                            <Package className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {inventory.productName || inventory.product?.productName || 'N/A'}
                                                    </div>
                                                    {inventory.product?.category?.categoryName && (
                                                        <div className="text-sm text-gray-500">
                                                            {inventory.product.category.categoryName}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {inventory.product?.supplier?.name || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`font-medium px-2 py-1 rounded ${inventory.quantity === 0
                                                ? 'bg-red-100 text-red-700'
                                                : inventory.quantity < 10
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {inventory.quantity}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={inventory.status === "available"}
                                                    onCheckedChange={(checked) => {
                                                        onStatusChange(inventory.productId, checked);
                                                    }}
                                                />
                                                <span className={`text-sm ${inventory.status === "available"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-gray-500 dark:text-gray-400"
                                                    }`}>
                                                    {inventory.status === "available" ? "Hoạt động" : "Ngừng hoạt động"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {inventory.updatedAt ? new Date(inventory.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedInventory(inventory)
                                                        setIsDetailDialogOpen(true)
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedInventory(inventory)
                                                        setIsEditDialogOpen(true)
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteInventory(inventory.inventoryId)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
