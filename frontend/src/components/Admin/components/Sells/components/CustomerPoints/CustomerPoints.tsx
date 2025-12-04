import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCustomer } from '@/hooks/useCustomer'
import { ICustomer } from '@/types/types'

type PointsFilter = 'all' | 'gt0' | 'gte100' | 'gte1000'

interface CustomerPointsProps {
    onSelectCustomer?: (customer: ICustomer) => void
}

export default function CustomerPoints({ onSelectCustomer }: CustomerPointsProps) {
    const { customers, loading, searchTerm, setSearchTerm } = useCustomer()
    const [pointsFilter, setPointsFilter] = useState<PointsFilter>('all')

    const filteredByPoints = useMemo(() => {
        return customers.filter((customer) => {
            const points = customer.customerPoints ?? 0
            switch (pointsFilter) {
                case 'gt0':
                    return points > 0
                case 'gte100':
                    return points >= 100
                case 'gte1000':
                    return points >= 1000
                default:
                    return true
            }
        }).filter((customer) => {
            if (!searchTerm) return true
            const q = searchTerm.toLowerCase().trim()
            return (
                customer.name?.toLowerCase().includes(q) ||
                customer.phone?.toLowerCase().includes(q) ||
                customer.email?.toLowerCase().includes(q) ||
                customer.customerId.toString().includes(q)
            )
        })
    }, [customers, pointsFilter, searchTerm])

    return (
        <Card className="shadow-sm">
            <CardHeader>
                <CardTitle className="text-base">Khách hàng tích điểm</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-3">
                {/* Thanh tìm kiếm & lọc */}
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                    <Input
                        placeholder="Tìm khách theo tên, SĐT, email, mã KH..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="md:max-w-sm"
                    />
                    <Select value={pointsFilter} onValueChange={(v) => setPointsFilter(v as PointsFilter)}>
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Lọc theo điểm tích lũy" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả</SelectItem>
                            <SelectItem value="gt0">Có điểm &gt; 0</SelectItem>
                            <SelectItem value="gte100">&ge; 100 điểm</SelectItem>
                            <SelectItem value="gte1000">&ge; 1000 điểm</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {loading ? (
                    <div className="py-4 text-center text-gray-500 text-sm">
                        Đang tải danh sách khách hàng...
                    </div>
                ) : filteredByPoints.length === 0 ? (
                    <div className="py-4 text-center text-gray-500 text-sm">
                        Không tìm thấy khách hàng phù hợp
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden max-h-80 overflow-y-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20">Mã KH</TableHead>
                                    <TableHead>Tên khách hàng</TableHead>
                                    <TableHead>Số điện thoại</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Điểm tích lũy</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredByPoints.map((customer) => (
                                    <TableRow
                                        key={customer.customerId}
                                        className="cursor-pointer hover:bg-green-50"
                                        onClick={() => onSelectCustomer?.(customer)}
                                    >
                                        <TableCell className="font-medium">
                                            {customer.customerId}
                                        </TableCell>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.phone || '-'}</TableCell>
                                        <TableCell>{customer.email || '-'}</TableCell>
                                        <TableCell>{customer.customerPoints ?? 0}</TableCell>
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
