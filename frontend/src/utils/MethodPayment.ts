import { PaymentMethod } from "@/types/paymentType";

export const mockPaymentMethods: PaymentMethod[] = [
    {
        type: "cash",
        label: "Tiền mặt",
        description: "Thanh toán bằng tiền mặt khi nhận hàng",
        category: "offline",
    },
    {
        type: "card",
        label: "Thẻ tín dụng",
        description: "Thanh toán bằng thẻ Visa, Mastercard",
        category: "offline",
    },
    {
        type: "momo",
        label: "MoMo",
        description: "Thanh toán qua ví điện tử MoMo",
        category: "online",
        accountInfo: {
            bankId: "MOMO",
            bankAccount: "0123456789",
            phoneNumber: "789",
        },
    },
    {
        type: "zalopay",
        label: "ZaloPay",
        description: "Thanh toán qua ví điện tử ZaloPay",
        category: "online",
        accountInfo: {
            bankId: "ZALOPAY",
            bankAccount: "0987654321",
        },
    },
    {
        type: "vnpay",
        label: "VNPay",
        description: "Thanh toán qua cổng VNPay",
        category: "online",
        vnpayInfo: {
            merchantId: "VNPAY001",
            merchantName: "Cửa hàng ABC",
            store: "Store 001",
            terminal: "Terminal 001",
        },
    },
]