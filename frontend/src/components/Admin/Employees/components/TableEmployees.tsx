"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { IEmployee } from "@/apis/employeeApi";
import ActionsEmployee from "./ActionsEmployee";
import FilterEmployees from "./FilterEmployees";

type Props = {
    employees: IEmployee[];
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    onEdit: (employee: IEmployee) => void;
    onView: (employee: IEmployee) => void;
    onStatusChange: (id: number, checked: boolean) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    busy?: boolean;
};

export default function TableEmployees({
    employees,
    searchQuery,
    setSearchQuery,
    onEdit,
    onView,
    onStatusChange,
    filterStatus,
    setFilterStatus,
    busy = false,
}: Props) {

    return (
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <FilterEmployees
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
            />

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
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={emp.status === "active"}
                                                    onCheckedChange={(checked) => {
                                                        if (emp.employeeId) {
                                                            onStatusChange(emp.employeeId, checked);
                                                        }
                                                    }}
                                                    disabled={busy}
                                                />
                                                <span className={`text-sm ${emp.status === "active"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-gray-500 dark:text-gray-400"
                                                    }`}>
                                                    {emp.status === "active" ? "Đang làm việc" : "Đã nghỉ"}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <ActionsEmployee
                                                employee={emp}
                                                onEdit={onEdit}
                                                onView={onView}
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
