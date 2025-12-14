"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { ConfigHistory } from "../types"

interface HistoryTabProps {
    history: ConfigHistory[]
}

export function HistoryTab({ history }: HistoryTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Lịch sử thay đổi
                </CardTitle>
                <CardDescription>Theo dõi các lần thay đổi cấu hình quy đổi điểm</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Tỷ lệ quy đổi</TableHead>
                            <TableHead>Giá trị 1 điểm</TableHead>
                            <TableHead>Người thay đổi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.date}</TableCell>
                                <TableCell>
                                    {item.points} điểm = {item.amount.toLocaleString("vi-VN")} đồng
                                </TableCell>
                                <TableCell className="text-primary font-semibold">
                                    {(item.amount / item.points).toLocaleString("vi-VN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}{" "}
                                    đồng
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{item.changedBy}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

