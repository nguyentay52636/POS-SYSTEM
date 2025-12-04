import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { User } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ICustomer } from '@/types/types'

interface TableChoiceCustomerProps {
    customers: ICustomer[]
    onSelectCustomer?: (customer: ICustomer) => void
    selectedCustomerId?: number | null
}

export default function TableChoiceCustomer({ customers, onSelectCustomer, selectedCustomerId }: TableChoiceCustomerProps) {
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const enableSelection = Boolean(onSelectCustomer)

    const selectableCustomers = useMemo(
        () => customers.filter((customer) => typeof customer.customerId === "number"),
        [customers]
    )

    const allSelected =
        enableSelection &&
        selectableCustomers.length > 0 &&
        selectableCustomers.every((customer) => selectedIds.includes(customer.customerId))

    const selectedCustomers = customers.filter(
        (customer) => customer.customerId && selectedIds.includes(customer.customerId)
    )

    const toggleSelect = (customerId?: number) => {
        if (!enableSelection || customerId === undefined) return

        const customer = customers.find((c) => c.customerId === customerId)
        if (!customer) return

        setSelectedIds((prev) => {
            const exists = prev.includes(customerId)
            const next = exists ? prev.filter((id) => id !== customerId) : [...prev, customerId]

            // Khi tick chọn (chưa tồn tại trước đó) thì gọi callback
            if (!exists && onSelectCustomer) {
                onSelectCustomer(customer)
            }

            return next
        })
    }

    const toggleSelectAll = () => {
        if (!enableSelection) return
        if (allSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(selectableCustomers.map((customer) => customer.customerId) || [])
        }
    }

    return (
        <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="bg-blue-50">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                    <User className="h-5 w-5" />
                    Danh sách khách hàng
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-6xl! pt-6">
                {enableSelection && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="text-sm text-gray-700">
                            Đã chọn{" "}
                            <span className="font-semibold text-green-700">{selectedCustomers.length}</span>{" "}
                            khách hàng
                        </div>
                    </div>
                )}
                {customers.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                        Không có khách hàng nào
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {enableSelection && (
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={allSelected}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Chọn tất cả khách hàng"
                                            />
                                        </TableHead>
                                    )}
                                    <TableHead>Mã KH</TableHead>
                                    <TableHead>Tên khách hàng</TableHead>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Địa chỉ</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.map((customer) => (
                                    <TableRow
                                        key={customer.customerId}
                                        className={selectedCustomerId === customer.customerId ? "bg-blue-50" : ""}
                                    >
                                        {enableSelection && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={customer.customerId !== undefined && selectedIds.includes(customer.customerId)}
                                                    onCheckedChange={() => toggleSelect(customer.customerId)}
                                                    aria-label={`Chọn khách hàng ${customer.name}`}
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell className="font-medium">{customer.customerId}</TableCell>
                                        <TableCell className="font-medium">{customer.name}</TableCell>
                                        <TableCell>{customer.phone || '-'}</TableCell>
                                        <TableCell>{customer.email || '-'}</TableCell>
                                        <TableCell>{customer.address || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

