"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2, AlertTriangle, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IEmployee } from "@/apis/employeeApi";

type Props = {
    employee: IEmployee;
    onEdit: (employee: IEmployee) => void;
    onView: (employee: IEmployee) => void;
    busy?: boolean;
};

export default function ActionsEmployee({
    employee,
    onEdit,
    onView,
    busy,
}: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0"
                    disabled={busy}
                    aria-label="Hành động"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onView(employee)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(employee)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

