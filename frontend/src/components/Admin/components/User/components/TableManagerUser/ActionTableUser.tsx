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
import { IUser } from '@/types/types'

interface ActionTableUserProps {
    user: IUser;
    onView: (user: IUser) => void;
    onEdit: (user: IUser) => void;
    onDelete: (user: IUser) => void;
}

export default function ActionTableUser({ user, onView, onEdit, onDelete }: ActionTableUserProps) {
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
                <DropdownMenuItem onClick={() => onView(user)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(user)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => onDelete(user)}
                    className="text-red-600"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa Tài khoản
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}