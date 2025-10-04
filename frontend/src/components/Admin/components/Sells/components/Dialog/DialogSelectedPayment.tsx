import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Receipt, Banknote, CreditCard, Smartphone, Wallet } from "lucide-react"

interface DialogSelectedPaymentProps {
    isPaymentOpen: boolean
    setIsPaymentOpen: (open: boolean) => void
    paymentMethod: "cash" | "card" | "transfer"
    setPaymentMethod: (method: "cash" | "card" | "transfer") => void
    selectedEWallet: string
    setSelectedEWallet: (wallet: string) => void
    receivedAmount: number
    setReceivedAmount: (amount: number) => void
    total: number
    completeTransaction: () => void
}

export default function DialogSelectedPayment({
    isPaymentOpen,
    setIsPaymentOpen,
    paymentMethod,
    setPaymentMethod,
    selectedEWallet,
    setSelectedEWallet,
    receivedAmount,
    setReceivedAmount,
    total,
    completeTransaction
}: DialogSelectedPaymentProps) {
    return (
        <>
            <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                            <div className="p-2.5 bg-green-100 rounded-xl">
                                <Receipt className="h-5 w-5 text-green-700" />
                            </div>
                            Thanh toán
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm">
                            <p className="text-sm font-medium text-gray-600 mb-2">Tổng thanh toán</p>
                            <p className="text-3xl font-bold text-green-700">{total.toLocaleString("vi-VN")}đ</p>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-700 mb-4 block uppercase tracking-wide">
                                Phương thức thanh toán
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                <Button
                                    variant={paymentMethod === "cash" ? "default" : "outline"}
                                    onClick={() => setPaymentMethod("cash")}
                                    className={`h-24 flex-col gap-2 border-2 ${paymentMethod === "cash"
                                        ? "bg-green-700 hover:bg-green-800 border-green-700 shadow-lg"
                                        : "border-gray-300 hover:border-green-500"
                                        }`}
                                >
                                    <Banknote className="h-7 w-7" />
                                    <span className="text-sm font-semibold">Tiền mặt</span>
                                </Button>
                                <Button
                                    variant={paymentMethod === "card" ? "default" : "outline"}
                                    onClick={() => setPaymentMethod("card")}
                                    className={`h-24 flex-col gap-2 border-2 ${paymentMethod === "card"
                                        ? "bg-green-700 hover:bg-green-800 border-green-700 shadow-lg"
                                        : "border-gray-300 hover:border-green-500"
                                        }`}
                                >
                                    <CreditCard className="h-7 w-7" />
                                    <span className="text-sm font-semibold">Thẻ</span>
                                </Button>
                                <Button
                                    variant={paymentMethod === "transfer" ? "default" : "outline"}
                                    onClick={() => setPaymentMethod("transfer")}
                                    className={`h-24 flex-col gap-2 border-2 ${paymentMethod === "transfer"
                                        ? "bg-green-700 hover:bg-green-800 border-green-700 shadow-lg"
                                        : "border-gray-300 hover:border-green-500"
                                        }`}
                                >
                                    <Smartphone className="h-7 w-7" />
                                    <span className="text-sm font-semibold">Chuyển khoản</span>
                                </Button>
                            </div>
                        </div>

                        {/* E-Wallet Selection (for transfer payment method) */}
                        {paymentMethod === "transfer" && (
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 block uppercase tracking-wide">Chọn ví điện tử</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant={selectedEWallet === "momo" ? "default" : "outline"}
                                        onClick={() => setSelectedEWallet("momo")}
                                        className={`h-20 flex items-center justify-center gap-3 border-2 font-bold ${selectedEWallet === "momo"
                                            ? "bg-pink-600 hover:bg-pink-700 text-white border-pink-600 shadow-lg"
                                            : "border-gray-300 hover:border-pink-500"
                                            }`}
                                    >
                                        <Wallet className="h-6 w-6" />
                                        <span className="text-base">MoMo</span>
                                    </Button>

                                    <Button
                                        variant={selectedEWallet === "zalopay" ? "default" : "outline"}
                                        onClick={() => setSelectedEWallet("zalopay")}
                                        className={`h-20 flex items-center justify-center gap-3 border-2 font-bold ${selectedEWallet === "zalopay"
                                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-lg"
                                            : "border-gray-300 hover:border-blue-500"
                                            }`}
                                    >
                                        <Wallet className="h-6 w-6" />
                                        <span className="text-base">ZaloPay</span>
                                    </Button>

                                    <Button
                                        variant={selectedEWallet === "mbbank" ? "default" : "outline"}
                                        onClick={() => setSelectedEWallet("mbbank")}
                                        className={`h-20 flex items-center justify-center gap-3 border-2 font-bold ${selectedEWallet === "mbbank"
                                            ? "bg-blue-700 hover:bg-blue-800 text-white border-blue-700 shadow-lg"
                                            : "border-gray-300 hover:border-blue-600"
                                            }`}
                                    >
                                        <Wallet className="h-6 w-6" />
                                        <span className="text-base">MB Bank</span>
                                    </Button>

                                    <Button
                                        variant={selectedEWallet === "vnpay" ? "default" : "outline"}
                                        onClick={() => setSelectedEWallet("vnpay")}
                                        className={`h-20 flex items-center justify-center gap-3 border-2 font-bold ${selectedEWallet === "vnpay"
                                            ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-lg"
                                            : "border-gray-300 hover:border-red-500"
                                            }`}
                                    >
                                        <Wallet className="h-6 w-6" />
                                        <span className="text-base">VNPay</span>
                                    </Button>
                                </div>

                                {selectedEWallet && (
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border-2 border-dashed border-gray-300">
                                        <div className="text-center">
                                            <div className="w-56 h-56 mx-auto bg-white rounded-xl shadow-xl flex items-center justify-center mb-4 border-4 border-gray-200">
                                                <div className="text-gray-400">
                                                    <Smartphone className="h-20 w-20 mx-auto mb-3" />
                                                    <p className="text-base font-semibold">Mã QR thanh toán</p>
                                                    <p className="text-sm mt-2 font-bold text-gray-600">
                                                        {selectedEWallet === "momo" && "MoMo"}
                                                        {selectedEWallet === "zalopay" && "ZaloPay"}
                                                        {selectedEWallet === "mbbank" && "MB Bank"}
                                                        {selectedEWallet === "vnpay" && "VNPay"}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 font-semibold mb-2">Quét mã QR để thanh toán</p>
                                            <div className="bg-white p-3 rounded-lg inline-block border-2 border-green-300">
                                                <p className="text-2xl font-bold text-green-700">{total.toLocaleString("vi-VN")}đ</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Received Amount (for cash) */}
                        {paymentMethod === "cash" && (
                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-3 block uppercase tracking-wide">
                                    Tiền khách đưa
                                </label>
                                <Input
                                    type="number"
                                    value={receivedAmount || ""}
                                    onChange={(e) => setReceivedAmount(Number(e.target.value))}
                                    placeholder="Nhập số tiền"
                                    className="text-xl text-center h-14 border-2 focus:border-green-500 font-bold"
                                />
                                {receivedAmount > 0 && (
                                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-bold text-gray-700">Tiền thừa:</span>
                                            <span className="text-2xl font-bold text-blue-700">
                                                {Math.max(0, receivedAmount - total).toLocaleString("vi-VN")}đ
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4 pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsPaymentOpen(false)}
                                className="flex-1 h-12 border-2 font-semibold hover:bg-gray-50"
                            >
                                Hủy
                            </Button>
                            <Button
                                onClick={completeTransaction}
                                disabled={
                                    (paymentMethod === "cash" && receivedAmount < total) ||
                                    (paymentMethod === "transfer" && !selectedEWallet)
                                }
                                className="flex-1 h-12 bg-green-700 hover:bg-green-800 font-bold shadow-lg"
                            >
                                <Receipt className="mr-2 h-5 w-5" />
                                Hoàn tất
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
