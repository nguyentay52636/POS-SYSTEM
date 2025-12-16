"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormEmployee from "./FormEmployee";
import { IEmployee } from "@/apis/employeeApi";

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess: (data: IEmployee, isEdit: boolean) => void;
    editingUser?: IEmployee | null;
    busy?: boolean;
};

export default function DialogAddEmployee({
    open,
    onClose,
    onSuccess,
    editingUser,
    busy,
}: Props) {
    const isEdit = !!editingUser;

    const handleSubmit = async (formData: any) => {
        // FormEmployee returns form data. We map it to IEmployee structure if needed,
        // or assume FormEmployee returns IEmployee compatible object.
        // Let's assume FormEmployee returns object compatible with IEmployee for now
        // or we construct it.
        const employeeData: IEmployee = {
            ...formData,
            // Ensure status/role are handled if FormEmployee deals with them
        };

        onSuccess(employeeData, isEdit);
        // Note: Closing is handled by parent in handleSuccess or separate prop, 
        // but here we might want to wait? handleSuccess in parent is async.
        // current implementation in DialogAddEmployee calls onSuccess then onClose.
        // In parent handleSuccess sets isOpen false.
        // So we probably don't need to call onClose() here if parent does it, 
        // but user might expect it.
        // Parent handleSuccess: await addEmployee; setIsAddDialogOpen(false);
        // So we don't need to call onClose() here if we want to wait for parent.
        // But onSuccess is void in props.
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Chi tiết nhân viên" : "Thêm nhân viên"}</DialogTitle>
                </DialogHeader>

                <FormEmployee
                    id="employee-form"
                    onSubmit={handleSubmit}
                    initialData={editingUser}
                    isEdit={isEdit}
                />

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
                        Hủy
                    </Button>
                    <Button type="submit" form="employee-form" disabled={busy}>
                        {isEdit ? "Lưu thay đổi" : "Thêm nhân viên"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
