import { Badge } from "@/components/ui/badge"
import { getStatusConfig } from "@/utils/productUtils"

interface ProductStatusBadgeProps {
    status: string
}

export default function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
    const config = getStatusConfig(status)
    return (
        <Badge className={`${config.className} border`}>
            {config.label}
        </Badge>
    )
}

