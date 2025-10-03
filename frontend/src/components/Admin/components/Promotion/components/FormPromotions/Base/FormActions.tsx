"use client"

import { Button } from "@/components/ui/button"

export interface FormActionsProps {
    submitLabel: string
    onCancel: () => void
}

export function FormActions({ submitLabel, onCancel }: FormActionsProps) {
    return (
        <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-300 hover:bg-gray-50 bg-transparent"
            >
                Hủy
            </Button>
            <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white">
                {submitLabel}
            </Button>
        </div>
    )
}

export default FormActions
