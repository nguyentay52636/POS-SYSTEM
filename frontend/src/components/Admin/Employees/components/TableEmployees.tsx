"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IEmployee } from "@/apis/employeeApi";
import ActionsEmployee from "./ActionsEmployee";

type Props = {
    employees: IEmployee[];
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    onEdit: (employee: IEmployee) => void;
    onDelete: (employee: IEmployee) => void;
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
                                    <TableHead className="font-semibold">ID</TableHead>
                                    <TableHead className="font-semibold">Tên nhân viên</TableHead>
                                    <TableHead className="font-semibold">Chức vụ</TableHead>
                                    <TableHead className="font-semibold">Giới tính</TableHead>
                                    <TableHead className="font-semibold">Ngày sinh</TableHead>
                                    <TableHead className="font-semibold">Điện thoại</TableHead>
                                    <TableHead className="font-semibold">Trạng thái</TableHead>
                                    <TableHead className="font-semibold">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {employees.map((emp, index) => (
                                    <TableRow key={emp.employeeId ?? `${emp.fullName}-${index}`}>
                                        <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                                            {emp.employeeId ?? "-"}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-9 w-9 border border-gray-200 dark:border-gray-700">
                                                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-xs">
                                                        {(emp.fullName || "?").charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {emp.fullName ?? "(Chưa có tên)"}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                                {emp.rolePosition || emp.role?.roleName || "-"}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                {emp.gender || "-"}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                {emp.birthDate ? new Date(emp.birthDate).toLocaleDateString("vi-VN") : "-"}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                                                {emp.phone || "-"}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${emp.status === "active"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                }`}>
                                                {emp.status === "active" ? "Đang làm việc" : "Đã nghỉ"}
                                            </span>
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
