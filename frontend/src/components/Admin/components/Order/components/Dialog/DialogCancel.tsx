"use client"
import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface DialogCancelProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (reason: string) => Promise<void>
    isLoading?: boolean
}

export default function DialogCancel({ isOpen, onClose, onConfirm, isLoading = false }: DialogCancelProps) {
    const [reason, setReason] = React.useState("")

    React.useEffect(() => {
        if (isOpen) {
            setReason("")
        }
    }, [isOpen])

    const handleConfirm = async () => {
        if (!reason.trim()) return
        await onConfirm(reason)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>Huỷ đơn hàng</DialogTitle>
                    <DialogDescription>
                        Vui lòng nhập lý do huỷ đơn để chúng tôi hỗ trợ bạn tốt hơn.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3 py-2">
                    <Label htmlFor="reason">Lý do huỷ</Label>
                    <Textarea
                        id="reason"
                        placeholder="Ví dụ: Thay đổi nhu cầu, đặt nhầm sản phẩm..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Đóng
                    </Button>
                    <Button
                        disabled={!reason.trim() || isLoading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleConfirm}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Xác nhận huỷ
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
