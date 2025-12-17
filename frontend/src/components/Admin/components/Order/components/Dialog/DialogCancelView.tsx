"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import type { CancellationHistory } from "@/apis/orderApi"

interface DialogCancelViewProps {
    isOpen: boolean
    onClose: () => void
    history: CancellationHistory[]
    orderId?: number
}

export default function DialogCancelView({ isOpen, onClose, history, orderId }: DialogCancelViewProps) {
    const data = history && history.length > 0 ? history[0] : null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Chi tiết huỷ đơn hàng #{orderId}</DialogTitle>
                    {!data && <DialogDescription>Không có thông tin hủy đơn.</DialogDescription>}
                </DialogHeader>

                {data && (
                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Mã huỷ</Label>
                                <Input value={data.cancellationId} disabled />
                            </div>
                            <div>
                                <Label>Mã đơn hàng</Label>
                                <Input value={data.orderId} disabled />
                            </div>
                        </div>

                        <div>
                            <Label>Lý do huỷ</Label>
                            <Textarea
                                value={data.cancellationReason}
                                disabled
                                className="min-h-[90px]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label>Mã nhân viên huỷ</Label>
                                <Input value={data.canceledByEmployeeId || "N/A"} disabled />
                            </div>
                            <div>
                                <Label>Tên nhân viên huỷ</Label>
                                <Input value={data.canceledByEmployeeName || data.canceledBy || "N/A"} disabled />
                            </div>
                        </div>

                        <div>
                            <Label>Ngày huỷ</Label>
                            <Input
                                value={new Date(data.cancellationDate).toLocaleString("vi-VN")}
                                disabled
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-2">
                    <Button onClick={onClose} className="bg-green-700 hover:bg-green-800">Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
