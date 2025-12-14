"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PointsConfig } from "../types"

interface CurrentConfigCardProps {
  config: PointsConfig
}

export function CurrentConfigCard({ config }: CurrentConfigCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình hiện tại</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Tỷ lệ quy đổi:</span>
              <span className="text-lg font-bold text-primary">
                {config.points} điểm = {config.amount.toLocaleString("vi-VN")} đồng
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Giá trị 1 điểm:</span>
              <span className="text-lg font-semibold text-primary">
                {(config.amount / config.points).toLocaleString("vi-VN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                đồng
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Giới hạn:</span>
              <span className="text-lg font-medium">
                {config.minPoints} - {config.maxPoints.toLocaleString("vi-VN")} điểm
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">Thời hạn:</span>
              {config.enableExpiry ? (
                <Badge variant="secondary">{config.expiryDays} ngày</Badge>
              ) : (
                <Badge variant="outline">Không giới hạn</Badge>
              )}
            </div>

            {config.enableBonus && (
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground">Điểm thưởng:</span>
                <Badge className="bg-primary">x{config.bonusMultiplier}</Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

