"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { PointsConfig } from "../types"
import { EXAMPLE_POINTS } from "../types"

interface PreviewTabProps {
    config: PointsConfig
}

export function PreviewTab({ config }: PreviewTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Xem trước quy đổi điểm
                </CardTitle>
                <CardDescription>Dự tính giá trị khi khách hàng sử dụng điểm với cấu hình hiện tại</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Số điểm sử dụng</TableHead>
                            <TableHead>Giá trị quy đổi</TableHead>
                            <TableHead>Giá trị sau bonus (nếu có)</TableHead>
                            <TableHead>Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {EXAMPLE_POINTS.map((points) => {
                            const baseValue = (config.amount / config.points) * points
                            const bonusValue = config.enableBonus ? baseValue * config.bonusMultiplier : baseValue
                            const isValid = points >= config.minPoints && points <= config.maxPoints

                            return (
                                <TableRow key={points}>
                                    <TableCell className="font-medium">{points.toLocaleString("vi-VN")} điểm</TableCell>
                                    <TableCell>{baseValue.toLocaleString("vi-VN")} đồng</TableCell>
                                    <TableCell>
                                        {config.enableBonus ? (
                                            <span className="font-semibold text-primary">
                                                {bonusValue.toLocaleString("vi-VN")} đồng
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {isValid ? (
                                            <Badge variant="default" className="bg-primary">
                                                Hợp lệ
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary">Ngoài giới hạn</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                        <div className="space-y-1 text-sm">
                            <p>
                                Giới hạn sử dụng: {config.minPoints} - {config.maxPoints.toLocaleString("vi-VN")} điểm
                            </p>
                            {config.enableExpiry && <p>Điểm có thời hạn: {config.expiryDays} ngày</p>}
                            {config.enableBonus && <p>Đang áp dụng hệ số thưởng: x{config.bonusMultiplier}</p>}
                        </div>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    )
}

