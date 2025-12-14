"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Settings, TrendingUp } from "lucide-react"
import { ConfigTab, CurrentConfigCard, PreviewTab, HistoryTab } from "./components"
import type { PointsConfig, ConfigHistory } from "./types"
import { DEFAULT_CONFIG } from "./types"

export function PointsConversion() {
    const [config, setConfig] = useState<PointsConfig>(DEFAULT_CONFIG)
    const [tempConfig, setTempConfig] = useState<PointsConfig>({ ...config })
    const [saved, setSaved] = useState(false)

    const [history] = useState<ConfigHistory[]>([
        {
            id: "1",
            date: "2025-01-10 14:30",
            points: 100,
            amount: 10000,
            changedBy: "Admin",
        },
        {
            id: "2",
            date: "2025-01-05 09:15",
            points: 100,
            amount: 5000,
            changedBy: "Admin",
        },
        {
            id: "3",
            date: "2024-12-20 16:45",
            points: 50,
            amount: 5000,
            changedBy: "Admin",
        },
    ])

    const handleConfirm = () => {
        setConfig({ ...tempConfig })
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="space-y-6">
            <Tabs defaultValue="config" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="config" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Cấu hình
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Xem trước
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2">
                        <History className="h-4 w-4" />
                        Lịch sử
                    </TabsTrigger>
                </TabsList>

                {/* Configuration Tab */}
                <TabsContent value="config" className="space-y-6 mt-6">
                    <ConfigTab
                        tempConfig={tempConfig}
                        setTempConfig={setTempConfig}
                        onConfirm={handleConfirm}
                        saved={saved}
                    />
                    <CurrentConfigCard config={config} />
                </TabsContent>

                {/* Preview Tab */}
                <TabsContent value="preview" className="space-y-6 mt-6">
                    <PreviewTab config={config} />
                </TabsContent>

                {/* History Tab */}
                <TabsContent value="history" className="space-y-6 mt-6">
                    <HistoryTab history={history} />
                </TabsContent>
            </Tabs>
        </div>
    )
}
