"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Save, TrendingUp } from "lucide-react"

export function CommonConfigTab() {
  const [globalProfit, setGlobalProfit] = useState("15")

  const categories = [
    { id: 1, name: "Điện tử", currentProfit: "12%", products: 45 },
    { id: 2, name: "Thời trang", currentProfit: "20%", products: 120 },
    { id: 3, name: "Gia dụng", currentProfit: "15%", products: 78 },
    { id: 4, name: "Thực phẩm", currentProfit: "8%", products: 200 },
    { id: 5, name: "Mỹ phẩm", currentProfit: "25%", products: 56 },
  ]

  const handleApplyGlobal = () => {

  }

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="bg-card border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Cấu hình lợi nhuận chung
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Áp dụng tỷ lệ lợi nhuận cho toàn bộ sản phẩm trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="globalProfit" className="text-sm font-medium text-foreground">
                Tỷ lệ lợi nhuận (%)
              </Label>
              <Input
                id="globalProfit"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={globalProfit}
                onChange={(e) => setGlobalProfit(e.target.value)}
                className="text-lg font-semibold bg-background border-border"
                placeholder="Nhập % lợi nhuận"
              />
            </div>
            <Button onClick={handleApplyGlobal} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Save className="h-4 w-4" />
              Áp dụng toàn bộ
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Tổng quan danh mục</h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold text-foreground">Danh mục</TableHead>
                  <TableHead className="font-semibold text-foreground">Lợi nhuận hiện tại</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Số sản phẩm</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <Badge variant="outline" className="font-mono">
                        {category.currentProfit}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{category.products} sản phẩm</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Đang hoạt động
                      </Badge>
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
