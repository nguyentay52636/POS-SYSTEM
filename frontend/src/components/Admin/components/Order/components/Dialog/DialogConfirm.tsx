import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DialogConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function DialogConfirm({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    isLoading = false,
}: DialogConfirmProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md ">
                <DialogHeader className="border-b border-red-200 dark:border-red-700 pb-4">
                    <DialogTitle className="text-red-800 dark:text-red-200 flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <span>{title}</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400 pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-red-700 cursor-pointer hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Đang xử lý...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Trash2 className="h-4 w-4" />
                                <span>{confirmText}</span>
                            </div>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
