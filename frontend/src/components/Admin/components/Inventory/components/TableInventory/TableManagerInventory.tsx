import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Package, Eye, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { IInventory } from '@/types/types'


interface TableManagerInventoryProps {
    inventories: IInventory[]
    filteredInventories: IInventory[]
    setSelectedInventory: (inventory: IInventory) => void
    setIsDetailDialogOpen: (open: boolean) => void
    setIsEditDialogOpen: (open: boolean) => void
    handleDeleteInventory: (inventoryId: number) => void
}

export default function TableManagerInventory({
    inventories,
    filteredInventories,
    setSelectedInventory,
    setIsDetailDialogOpen,
    setIsEditDialogOpen,
    handleDeleteInventory
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
                                    <TableHead className="font-semibold text-gray-900">Mã sản phẩm</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Số lượng</TableHead>
                                    <TableHead className="font-semibold text-gray-900">Ngày cập nhật</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-900">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInventories.map((inventory) => (
                                    <TableRow key={inventory.inventory_id} className="hover:bg-gray-50">
                                        <TableCell className="font-medium">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                                                {inventory.inventory_id}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Package className="h-4 w-4 text-blue-700" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {inventory.product?.product_name || 'N/A'}
                                                    </div>
                                                    {inventory.product && (
                                                        <div className="text-sm text-gray-500">
                                                            {inventory.product.category_id?.category_name || ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {inventory.product_id}
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
                                        <TableCell className="text-gray-600">
                                            {inventory.updated_at ? new Date(inventory.updated_at).toLocaleDateString('vi-VN') : 'N/A'}
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
                                                    onClick={() => handleDeleteInventory(inventory.inventory_id)}
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
