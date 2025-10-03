"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock } from "lucide-react"

export interface DateRangeProps {
    startDate: string
    endDate: string
    onChangeStart: (value: string) => void
    onChangeEnd: (value: string) => void
}

export function DateRangeCard({ startDate, endDate, onChangeStart, onChangeEnd }: DateRangeProps) {
    return (
        <Card className="border-orange-200 bg-orange-50/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Thời gian áp dụng
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="ngayBatDau" className="text-orange-700 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Ngày bắt đầu *
                        </Label>
                        <Input
                            id="ngayBatDau"
                            type="datetime-local"
                            value={startDate}
                            onChange={(e) => onChangeStart(e.target.value)}
                            className="border-orange-300 focus:border-orange-500"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="ngayKetThuc" className="text-orange-700 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Ngày kết thúc *
                        </Label>
                        <Input
                            id="ngayKetThuc"
                            type="datetime-local"
                            value={endDate}
                            onChange={(e) => onChangeEnd(e.target.value)}
                            className="border-orange-300 focus:border-orange-500"
                            required
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default DateRangeCard
