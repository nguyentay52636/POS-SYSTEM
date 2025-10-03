"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"

export interface DescriptionProps {
    value: string
    onChange: (value: string) => void
}

export function DescriptionCard({ value, onChange }: DescriptionProps) {
    return (
        <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-purple-800 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Mô tả chi tiết
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea
                    id="moTa"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Nhập mô tả chi tiết về chương trình khuyến mãi..."
                    className="border-purple-300 focus:border-purple-500 min-h-[100px]"
                    rows={4}
                />
            </CardContent>
        </Card>
    )
}

export default DescriptionCard
