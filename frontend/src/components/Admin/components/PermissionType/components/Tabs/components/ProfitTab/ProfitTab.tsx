"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Package, Eye } from "lucide-react"
import { CommonConfigTab } from "./components/CommonConfigTab"
import { PreviewTab } from "./components/PreviewTab"
import { ProfitConfigTab } from "./components/ProfitConfigTab"
import { PaginationProvider } from "@/context/PaginationContext"

export function ProfitTab() {
    return (
        <div className=" p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Quản Lý Lợi Nhuận</h1>
                <p className="text-muted-foreground">Cấu hình và quản lý tỷ lệ lợi nhuận cho sản phẩm của bạn</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-8 bg-card border border-border shadow-sm p-1 h-auto">
                    <TabsTrigger
                        value="general"
                        className="gap-2 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                        <Settings className="h-4 w-4" />
                        Cấu hình chung
                    </TabsTrigger>
                    <TabsTrigger
                        value="product"
                        className="gap-2 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                        <Package className="h-4 w-4" />
                        Theo Sản phẩm
                    </TabsTrigger>
                    <TabsTrigger
                        value="preview"
                        className="gap-2 data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
                    >
                        <Eye className="h-4 w-4" />
                        Bản xem trước
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <PaginationProvider>
                        <CommonConfigTab />
                    </PaginationProvider>
                </TabsContent>

                <TabsContent value="product">
                    <PaginationProvider>
                        <ProfitConfigTab />
                    </PaginationProvider>
                </TabsContent>

                <TabsContent value="preview">
                    <PaginationProvider>
                        <PreviewTab />
                    </PaginationProvider>
                </TabsContent>
            </Tabs>
        </div>
    )
}
