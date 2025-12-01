import { TableCell, TableRow } from "@/components/ui/table"

export default function ProductTableEmpty() {
    return (
        <TableRow>
            <TableCell colSpan={9} className="py-10 text-center text-gray-500">
                Không có sản phẩm nào
            </TableCell>
        </TableRow>
    )
}

