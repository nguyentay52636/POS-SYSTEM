import { createProduct } from '@/apis/productApi'
import { IProduct } from '@/types/types'
import { toast } from 'sonner'
import { FormProduct } from './FormProduct'

interface DialogAddProductProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export default function DialogAddProduct({ isOpen, onOpenChange, onSuccess }: DialogAddProductProps) {
    const handleSubmit = async (product: IProduct) => {
        try {
            await createProduct(product)
            toast.success("Thêm sản phẩm thành công")
            onSuccess?.()
        } catch (error) {
            console.error(error)
            toast.error("Thêm sản phẩm thất bại")
        }
    }

    return (
        <FormProduct
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onSubmit={handleSubmit}
        />
    )
}
