
"use client"
import React, { useEffect, useState, useMemo } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { getAllEmployee, getAllEmployeeStatus, IEmployee } from '@/apis/employeeApi'
import { toast } from 'sonner'

interface DialogSelectEmployeeProps {
    onSelectEmployee?: (employee: IEmployee) => void
    onClose?: () => void
}

export default function DialogSelectEmployee({ onSelectEmployee, onClose }: DialogSelectEmployeeProps) {
    const [employees, setEmployees] = useState<IEmployee[]>([])
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const fetchEmployees = async () => {
        setLoading(true)
        try {
            let data = []
            if (statusFilter === 'all') {
                data = await getAllEmployee()
            } else {
                data = await getAllEmployeeStatus(statusFilter)
            }
            setEmployees(data || [])
        } catch (error) {
            console.error("Error fetching employees:", error)
            toast.error("Không thể tải danh sách nhân viên")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [statusFilter])

    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            if (!searchTerm) return true
            const q = searchTerm.toLowerCase().trim()
            return (
                employee.fullName?.toLowerCase().includes(q) ||
                employee.phone?.toLowerCase().includes(q) ||
                employee.employeeId?.toString().includes(q) ||
                employee.rolePosition?.toLowerCase().includes(q)
            )
        })
    }, [employees, searchTerm])

    return (
        <div className="space-y-4">


            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Tìm kiếm nhân viên..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="active">Hoạt động</SelectItem>
                        <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md max-h-[400px] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Họ tên</TableHead>
                            <TableHead>Chức vụ</TableHead>
                            <TableHead>SĐT</TableHead>
                            <TableHead>Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : filteredEmployees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Không tìm thấy nhân viên nào
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEmployees.map((employee) => (
                                <TableRow
                                    key={employee.employeeId}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSelectEmployee?.(employee)}
                                >
                                    <TableCell>{employee.employeeId}</TableCell>
                                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                                    <TableCell>{employee.rolePosition}</TableCell>
                                    <TableCell>{employee.phone}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${employee.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {employee.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )

}
