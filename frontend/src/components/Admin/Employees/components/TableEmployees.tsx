"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IUser } from "@/types/types";
import ActionsEmployee from "./ActionsEmployee";

type Props = {
    employees: IUser[];
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    onEdit: (user: IUser) => void;
    onDelete: (user: IUser) => void;
    busy?: boolean;
};

export default function TableEmployees({
    employees,
    searchQuery,
    setSearchQuery,
    onEdit,
    onDelete,
    busy = false,
}: Props) {
    return (
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="relative w-64!">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm nhân viên..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-64 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent"
                        >
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
                                    <TableHead className="font-semibold">Nhân viên</TableHead>
                                    <TableHead className="font-semibold">Vai trò</TableHead>
                                    <TableHead className="font-semibold">Username</TableHead>
                                    <TableHead className="font-semibold">Ngày tạo</TableHead>
                                    <TableHead className="font-semibold">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {employees.map((emp, index) => (
                                    <TableRow key={emp.user_id ?? `${emp.full_name}-${index}`}>
                                        <TableCell>
                                            <div className="flex items-center space-x-4">
                                                <Avatar className="h-10 w-10 border-2 border-gray-200 dark:border-gray-700">
                                                    <AvatarImage src={emp.avatar || "/placeholder.svg"} alt={emp.full_name || "Employee"} />
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                                                        {(emp.full_name || "?").charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                                                        {emp.full_name ?? "(Chưa có tên)"}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        ID: {emp.user_id ?? "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${emp.role === "admin"
                                                ? "bg-red-100 text-red-700"
                                                : emp.role === "staff"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {emp.role.toUpperCase()}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {emp.username}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-500">
                                                {emp.createdAt ? new Date(emp.createdAt).toLocaleDateString("vi-VN") : "-"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <ActionsEmployee
                                                employee={emp}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                busy={busy}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {employees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                                            Không có nhân viên nào
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
