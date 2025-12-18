"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Save, TrendingUp, Calculator, ArrowRight, CircleDollarSign, Info } from "lucide-react"
import { getProfitConfigurationGlobal, updateProfitConfigurationGlobal } from "@/apis/profitConfiguration"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { selectAuth } from "@/redux/Slice/authSlice"

export function CommonConfigTab() {
  const [globalProfit, setGlobalProfit] = useState("15")
  const { user } = useSelector(selectAuth)
  const [loading, setLoading] = useState(false)

  const [sampleImportPrice, setSampleImportPrice] = useState<string>("100000")

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getProfitConfigurationGlobal()
        if (data?.defaultProfitPercentage !== undefined) {
          setGlobalProfit(data.defaultProfitPercentage.toString())
        }
      } catch (error) {
        console.error("Failed to fetch profit config:", error)
      }
    }
    fetchConfig()
  }, [])

  const handleApplyGlobal = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này")
      return
    }

    const profit = parseFloat(globalProfit)
    if (isNaN(profit) || profit < 0) {
      toast.error("Vui lòng nhập tỷ lệ lợi nhuận hợp lệ (>= 0)")
      return
    }

    setLoading(true)
    try {
      // updatedByEmployeeId lấy từ CurrentUser (ưu tiên employeeId, fallback sang userId)
      const currentEmployeeId = user.employeeId ?? user.userId

      const payload = {
        defaultProfitPercentage: profit || 10,
        updatedByEmployeeId: currentEmployeeId || 1
      }

      console.log("Applying Global Profit Config with payload:", payload)

      await updateProfitConfigurationGlobal(payload)
      toast.success("Đã cập nhật cấu hình lợi nhuận thành công!")
      toast.info("Đã áp dụng thay đổi cho toàn bộ hệ thống")
    } catch (error) {
      console.error("Failed to update profit config:", error)
      toast.error("Cập nhật thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  // Calculate simulation values
  const profitPercent = parseFloat(globalProfit) || 0
  const importPrice = parseFloat(sampleImportPrice) || 0
  const profitAmount = (importPrice * profitPercent) / 100
  const sellingPrice = importPrice + profitAmount

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="bg-card border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5 text-emerald-600" />
          Cấu hình lợi nhuận chung
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Thiết lập tỷ lệ lợi nhuận mặc định cho toàn bộ sản phẩm trong hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Configuration Column */}
          <div className="space-y-6">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 mb-2">
                <CircleDollarSign className="h-5 w-5" />
                <h3 className="font-semibold text-lg">Thiết lập tham số</h3>
              </div>

              <div className="space-y-3">
                <Label htmlFor="globalProfit" className="text-base font-medium">
                  Tỷ lệ lợi nhuận mong muốn (%)
                </Label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      id="globalProfit"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={globalProfit}
                      onChange={(e) => setGlobalProfit(e.target.value)}
                      className="text-lg font-bold pr-8"
                      placeholder="VD: 15"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">%</span>
                  </div>
                  <Button
                    onClick={handleApplyGlobal}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span> Lưu...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" /> Lưu cấu hình
                      </span>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lưu ý: Thay đổi này sẽ cập nhật giá bán dự kiến cho tất cả các sản phẩm chưa có cấu hình riêng.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex gap-3 text-blue-800 dark:text-blue-300">
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Cơ chế hoạt động:</p>
                <p>Giá bán = Giá nhập + (Giá nhập × Tỷ lệ lợi nhuận)</p>
              </div>
            </div>
          </div>

          {/* Simulation Column */}
          <div className="border rounded-xl p-6 shadow-sm flex flex-col h-full bg-card">
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <Calculator className="h-5 w-5" />
              <h3 className="font-semibold text-lg">Mô phỏng giá bán</h3>
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="samplePrice">Giá nhập mẫu (VND)</Label>
                <Input
                  id="samplePrice"
                  type="number"
                  value={sampleImportPrice}
                  onChange={(e) => setSampleImportPrice(e.target.value)}
                  className="text-right font-mono"
                />
              </div>

              <div className="relative py-2">
                <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-2 border rounded-full text-muted-foreground">
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </div>
                <Separator />
              </div>

              <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Lợi nhuận gộp ({profitPercent}%):</span>
                  <span className="font-medium text-emerald-600">+{formatCurrency(profitAmount)}</span>
                </div>

                <Separator className="bg-dashed" />

                <div className="flex justify-between items-end">
                  <span className="font-semibold text-lg">Giá bán dự kiến:</span>
                  <span className="font-bold text-2xl text-emerald-700 dark:text-emerald-400">
                    {formatCurrency(sellingPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
