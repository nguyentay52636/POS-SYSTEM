import React from 'react'
import { useSelector } from 'react-redux'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { selectCartItems, selectCartTotal } from '@/redux/Slice/cartSlice'
import { formatPrice } from '@/utils/productUtils'

interface ChoiceCustomerPaymentProps {
    onChooseCustomer: () => void
    onSkip: () => void
}

export default function ChoiceCustomerPayment({ onChooseCustomer, onSkip }: ChoiceCustomerPaymentProps) {
    const items = useSelector(selectCartItems)
    const { total } = useSelector(selectCartTotal)

    return (
        <Card className="border-l-4 border-l-green-600 shadow-sm ">
            <CardHeader className="bg-green-50">
                <CardTitle className="flex items-center justify-between text-green-800">
                    <span>Danh sách sản phẩm thanh toán</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 max-w-6xl!">
                {items.length === 0 ? (
                    <div className="py-6 text-center text-gray-500">
                        Không có sản phẩm nào trong giỏ hàng
                    </div>
                ) : (
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sản phẩm</TableHead>
                                    <TableHead>Ảnh</TableHead>
                                    <TableHead className="w-24 text-center">Số lượng</TableHead>
                                    <TableHead className="w-32 text-right">Đơn giá</TableHead>
                                    <TableHead className="w-32 text-right">Thành tiền</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.product.productId}>
                                        <TableCell>
                                            <div className="font-medium">
                                                {item.product.productName}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Mã SP: {item.product.productId}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <img src={item.product.imageUrl} alt={item.product.productName} width={50} height={50} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatPrice(item.product.price)}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-green-700">
                                            {formatPrice(item.subtotal)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className="text-right font-semibold">
                                        Tổng cộng
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-green-800">
                                        {formatPrice(total)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onSkip}
                        className="border-gray-300"
                    >
                        Bỏ qua
                    </Button>
                    <Button
                        className="bg-green-700 hover:bg-green-800"
                        onClick={onChooseCustomer}
                    >
                        Chọn khách hàng
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}