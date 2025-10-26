import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Filter, Users, Search, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IUser } from '@/types/types'
import ActionTableUser from './ActionTableUser'

interface TableManagerUserProps {
    users: IUser[];
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    onView: (user: IUser) => void;
    onEdit: (user: IUser) => void;
    onDelete: (user: IUser) => void;
}

export default function TableManagerUser({ users, searchQuery, setSearchQuery, onView, onEdit, onDelete }: TableManagerUserProps) {
    return (
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Users className="h-4 w-4 text-white" />
                            </div>
                            <span>Danh sách tài khoản</span>
                        </CardTitle>
                        <CardDescription>
                            Quản lý tài khoản hệ thống ({users.length} tài khoản)
                        </CardDescription>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm tài khoản..."
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
                                    <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Tài khoản</TableHead>
                                    <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Họ tên</TableHead>
                                    <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Vai trò</TableHead>
                                    <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Tạo lúc</TableHead>
                                    <TableHead className="font-semibold bg-gray-50 dark:bg-gray-800/50">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                                                    <AvatarImage src={u.avatar || "/placeholder.svg"} alt={u.username} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                                        {u.username.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100">{u.username}</div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">ID: {u.user_id}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-gray-900 dark:text-gray-100 font-medium">{u.full_name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800">
                                                <Shield className="h-3 w-3 mr-2 text-blue-600" />
                                                <span className="font-medium capitalize">{u.role}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(u.createdAt).toLocaleDateString('vi-VN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit'
                                                })}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <ActionTableUser 
                                                user={u} 
                                                onView={onView}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                            />
                                        </TableCell>
                                    </TableRow>

                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
