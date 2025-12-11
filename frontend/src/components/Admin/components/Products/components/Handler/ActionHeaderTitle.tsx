import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { Download, Package, Upload } from 'lucide-react'
import React from 'react'
import { ProductFormTrigger } from '../Dialog/FormProduct'

interface ActionHeaderTitleProps {
    handleOpenAddDialog: () => void
    onExportExcel: () => void
}

export default function ActionHeaderTitle({ handleOpenAddDialog, onExportExcel }: ActionHeaderTitleProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center">
                    <Package className="h-5 w-5 mr-2 text-green-700 dark:text-white" />
                    Danh sách sản phẩm
                </CardTitle>
                <CardDescription className="mt-1 text-gray-500 dark:text-white">Quản lý tất cả sản phẩm trong cửa hàng</CardDescription>
            </div>
            <div className="flex items-center space-x-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExportExcel}
                    className="hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 hover:border-green-300 bg-transparent"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Xuất Excel
                </Button>
                <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
                    <Upload className="mr-2 h-4 w-4" />
                    Nhập Excel
                </Button>
                <ProductFormTrigger onOpenDialog={handleOpenAddDialog} />
            </div>
        </div>
    )
}
