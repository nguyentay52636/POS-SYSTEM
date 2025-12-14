"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Info, CheckCircle2, Gift } from "lucide-react"
import type { PointsConfig } from "../types"

interface ConfigTabProps {
    tempConfig: PointsConfig
    setTempConfig: (config: PointsConfig) => void
    onConfirm: () => void
    saved: boolean
}

export function ConfigTab({ tempConfig, setTempConfig, onConfirm, saved }: ConfigTabProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Cấu hình quy đổi điểm khách hàng</CardTitle>
                <CardDescription>Cấu hình quy đổi điểm để tính giá trị khi khách hàng sử dụng điểm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                        <div className="space-y-1 text-sm">
                            <p>Ví dụ: 100 điểm = 10,000 đồng (khách hàng dùng 100 điểm sẽ được giảm 10,000 đồng).</p>
                            <p>Lưu ý: Điểm tích lũy tính theo số lượng sản phẩm (1 sản phẩm = 1 điểm).</p>
                        </div>
                    </AlertDescription>
                </Alert>

                {/* Basic Configuration */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Tỷ lệ quy đổi cơ bản</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="points">Số điểm:</Label>
                            <Input
                                id="points"
                                type="number"
                                min="1"
                                value={tempConfig.points}
                                onChange={(e) => setTempConfig({ ...tempConfig, points: Number.parseInt(e.target.value) || 0 })}
                                className="text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Số tiền tương ứng (đồng):</Label>
                            <Input
                                id="amount"
                                type="number"
                                min="0"
                                step="1000"
                                value={tempConfig.amount}
                                onChange={(e) => setTempConfig({ ...tempConfig, amount: Number.parseInt(e.target.value) || 0 })}
                                className="text-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minPoints">Số điểm tối thiểu:</Label>
                            <Input
                                id="minPoints"
                                type="number"
                                min="1"
                                value={tempConfig.minPoints}
                                onChange={(e) =>
                                    setTempConfig({ ...tempConfig, minPoints: Number.parseInt(e.target.value) || 0 })
                                }
                            />
                            <p className="text-xs text-muted-foreground">Số điểm tối thiểu khách hàng cần có để sử dụng</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxPoints">Số điểm tối đa:</Label>
                            <Input
                                id="maxPoints"
                                type="number"
                                min="1"
                                value={tempConfig.maxPoints}
                                onChange={(e) =>
                                    setTempConfig({ ...tempConfig, maxPoints: Number.parseInt(e.target.value) || 0 })
                                }
                            />
                            <p className="text-xs text-muted-foreground">Số điểm tối đa khách hàng có thể sử dụng mỗi lần</p>
                        </div>
                    </div>
                </div>

                {/* Points Expiry Settings */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h3 className="text-lg font-semibold">Thời hạn điểm</h3>
                            <p className="text-sm text-muted-foreground">Cấu hình thời gian hết hạn cho điểm tích lũy</p>
                        </div>
                        <Switch
                            checked={tempConfig.enableExpiry}
                            onCheckedChange={(checked) => setTempConfig({ ...tempConfig, enableExpiry: checked })}
                        />
                    </div>

                    {tempConfig.enableExpiry && (
                        <div className="space-y-2">
                            <Label htmlFor="expiryDays">Số ngày hết hạn:</Label>
                            <Input
                                id="expiryDays"
                                type="number"
                                min="1"
                                value={tempConfig.expiryDays}
                                onChange={(e) =>
                                    setTempConfig({ ...tempConfig, expiryDays: Number.parseInt(e.target.value) || 0 })
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Điểm sẽ hết hạn sau {tempConfig.expiryDays} ngày kể từ ngày tích lũy
                            </p>
                        </div>
                    )}
                </div>

                {/* Bonus Points Settings */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <Gift className="h-5 w-5 text-primary" />
                                Điểm thưởng
                            </h3>
                            <p className="text-sm text-muted-foreground">Tăng giá trị điểm cho các chương trình khuyến mãi</p>
                        </div>
                        <Switch
                            checked={tempConfig.enableBonus}
                            onCheckedChange={(checked) => setTempConfig({ ...tempConfig, enableBonus: checked })}
                        />
                    </div>

                    {tempConfig.enableBonus && (
                        <div className="space-y-2">
                            <Label htmlFor="bonusMultiplier">Hệ số nhân điểm:</Label>
                            <Input
                                id="bonusMultiplier"
                                type="number"
                                min="1"
                                step="0.1"
                                value={tempConfig.bonusMultiplier}
                                onChange={(e) =>
                                    setTempConfig({ ...tempConfig, bonusMultiplier: Number.parseFloat(e.target.value) || 1 })
                                }
                            />
                            <p className="text-xs text-muted-foreground">
                                Ví dụ: Hệ số 1.5 = khách hàng nhận thêm 50% điểm khi mua hàng
                            </p>
                        </div>
                    )}
                </div>

                <Button onClick={onConfirm} size="lg" className="w-full md:w-auto">
                    Lưu cấu hình
                </Button>

                {saved && (
                    <Alert className="border-primary bg-primary/10">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <AlertDescription className="ml-2 text-primary">Cấu hình đã được lưu thành công!</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}

