import { Button } from '@/components/ui/button'
import { ChevronRight, LeafyGreen, Store } from 'lucide-react'


export default function HeaderAppSider({ isCollapsed, setIsCollapsed, isMobile }: { isCollapsed: any, setIsCollapsed: any, isMobile: any }) {
    return (
        <div className="p-4 border-b border-sidebar-border bg-green-700">
            <div className="flex items-center  ">
                <div className="h-8 w-8 rounded  gap-3 bg-sidebar-primary flex items-center justify-center">
                    <span className="text-sidebar-primary-foreground text-white! bg-green-700 font-bold text-sm p-2"><Store /></span>
                </div>
                {!isCollapsed && (
                    <div >
                        <p className="text-sm text-white font-bold mx-2">Bách hóa xanh</p>
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            {!isMobile && (
                <Button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-sm hover:bg-sidebar-accent"
                >
                    <ChevronRight className={`h-3 w-3 transition-transform ${isCollapsed ? "" : "rotate-180"}`} />
                </Button>
            )}
        </div>
    )
}