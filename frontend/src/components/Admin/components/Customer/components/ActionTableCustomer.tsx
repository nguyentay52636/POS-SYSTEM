// components/ActionTableEmployee.tsx
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'

// interface ActionTableEmployeeProps {
//     employee: any;
//     handleView: (employee: any) => void;
//     onEdit: (employee: any) => void;
//     handleDelete?: (employee: any) => void;
// }

export default function ActionTableCustomer() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { }}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { }}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => { }}
                    className="text-red-600"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa Khách hàng
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}