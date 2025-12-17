import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableCell } from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    MoreVertical,
    Eye,
    ChevronDown,
    Trash2,
    Check,
    FileDiff,
} from 'lucide-react'
import type { Order } from '@/apis/orderApi'

// Status options
const STATUS_OPTIONS = [
    { ui: "DaDuyet", api: "paid", label: "Đã Duyệt" },
    { ui: "DaHuy", api: "canceled", label: "Đã Hủy" },
]

// Helper functions
const getStatusLabel = (ui: string) =>
    STATUS_OPTIONS.find((o) => o.ui === ui)?.label || ui

const getStatusBadgeClass = (ui: string) => {
    switch (ui) {

        case "DaDuyet":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        case "DaHuy":
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    }
}

interface ActionsOnTableOrderProps {
    order: Order
    currentUi: string
    onStatusChange: (orderId: number, newStatus: string) => void | Promise<void>
    handleViewDetails: (order: Order) => void
    setOrderToDelete: (order: Order | null) => void
    onRowSelect?: (order: Order | null) => void
    isUpdating?: boolean
}

export default function ActionsOnTableOrder({
    order,
    currentUi,
    onStatusChange,
    handleViewDetails,
    setOrderToDelete,
    onRowSelect,
    isUpdating = false,
}: ActionsOnTableOrderProps) {
    const handleStatusChangeLocal = async (orderId: number, newStatus: string) => {
        await onStatusChange(orderId, newStatus)
    }

    return (
        <>
            {/* Status Dropdown */}
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={isUpdating}
                        >
                            <Badge className={getStatusBadgeClass(currentUi)}>
                                {getStatusLabel(currentUi)}
                            </Badge>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="start" className="w-44">
                        {STATUS_OPTIONS.map((opt) => {
                            const isActive = currentUi === opt.ui
                            return (
                                <DropdownMenuItem
                                    key={opt.ui}
                                    onClick={() =>
                                        handleStatusChangeLocal(order.orderId, opt.ui)
                                    }
                                    className="flex items-center gap-2"
                                >
                                    <Check
                                        className={`h-4 w-4 ${isActive ? "opacity-100" : "opacity-0"
                                            }`}
                                    />
                                    <span className={isActive ? "font-medium" : ""}>
                                        {opt.label}
                                    </span>
                                </DropdownMenuItem>
                            )
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>

            {/* Actions Dropdown */}
            <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={isUpdating}>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                            onClick={() => {
                                onRowSelect?.(order)
                                handleViewDetails(order)
                            }}
                        >
                            <Eye className="h-4 w-4 text-green-600" />
                            <span className="ml-2">Xem chi tiết</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {

                            }}
                        >
                            <FileDiff className="h-4 w-4 text-green-600" />
                            <span className="ml-2">Xem lý do hủy</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => setOrderToDelete(order)}
                            className="text-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="ml-2">Huỷ đơn hàng</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </>
    )
}
