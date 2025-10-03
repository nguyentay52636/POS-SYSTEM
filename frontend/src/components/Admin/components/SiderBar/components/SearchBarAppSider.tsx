import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TooltipContent } from '@/components/ui/tooltip'
export default function SearchBarAppSider({ isCollapsed, isMobile }: { isCollapsed: any, isMobile: any }) {
    return (
        <div className="px-4 py-2">
            {!isCollapsed && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="pl-10 border-sidebar-border focus:bg-sidebar"
                    />
                </div>
            )}
            {isCollapsed && !isMobile && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-full h-10">
                                <Search className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-popover text-popover-foreground border">
                            <p>Tìm kiếm</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    )
}