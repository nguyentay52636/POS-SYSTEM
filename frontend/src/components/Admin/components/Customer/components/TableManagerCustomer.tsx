import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Phone, Filter, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { INhanVien } from '@/types/types'
import ActionTableEmployee from './ActionTableCustomer'

export default function TableManagerCustomer({ employees, searchQuery, setSearchQuery }: { employees: INhanVien[], searchQuery: string, setSearchQuery: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <>
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <span>Danh sách khách hàng</span>
                            </CardTitle>
                            <CardDescription>
                                Quản lý và theo dõi tất cả khách hàng ({employees.length} khách hàng)
                            </CardDescription>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Tìm kiếm khách hàng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-64 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                                />
                            </div>
                            <Button variant="outline" size="sm" className="hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent">
                                <Filter className="h-4 w-4 mr-2" />
                                Lọc
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="max-h-[600px] overflow-y-auto">
                            <Table>
                                <TableHeader className="sticky top-0 bg-gray-50 dark:bg-gray-800/50 z-10">
                                    <TableRow>
                                        <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Khách hàng</TableHead>
                                        <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Liên hệ</TableHead>
                                        <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Vai trò</TableHead>
                                        <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Trạng thái</TableHead>
                                        <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Hành động</TableHead>

                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employees.map((person) => (
                                        <TableRow key={person.maNhanVien} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                                                            <AvatarImage src={person.anhDaiDien || "/placeholder.svg"} alt={person.tenNhanVien} />
                                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                                                {person.tenNhanVien.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{person.tenNhanVien}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            Mã: {person.maNhanVien}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-1">
                                                        <Phone className="h-3 w-3 mr-2 text-green-600" />
                                                        <span>{person.soDienThoai}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">{person.vaiTro.role}</span>
                                            </TableCell>
                                            <TableCell>{person.trangThai}</TableCell>
                                            <TableCell>
                                                <ActionTableEmployee />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </>
    )
}