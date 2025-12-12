"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download } from 'lucide-react'

type PeriodType = "week" | "month" | "year"

interface SelectDashBoardChartProps {
    selectedPeriod: PeriodType
    onPeriodChange: (period: PeriodType) => void
}

export default function SelectDashBoardChart({ selectedPeriod, onPeriodChange }: SelectDashBoardChartProps) {
    return (
        <>
            <div className="flex items-center space-x-2">
                <Select value={selectedPeriod} onValueChange={(value) => onPeriodChange(value as PeriodType)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week">Tuần này</SelectItem>
                        <SelectItem value="month">Tháng này</SelectItem>
                        <SelectItem value="year">Năm này</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Xuất báo cáo
                </Button>
            </div>
        </>
    )
}
