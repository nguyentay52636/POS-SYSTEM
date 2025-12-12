import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download } from 'lucide-react'

export default function HeaderRevenue() {
    return (
        <div className="flex items-center justify-between space-y-2">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Bách Hóa Xanh</h2>
                <p className="text-muted-foreground">Thống kê và phân tích kinh doanh siêu thị</p>
            </div>
         
        </div>
    )
}