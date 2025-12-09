"use client";

import * as React from "react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface FormValues {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordDialogProps {
    triggerLabel?: string;
    triggerVariant?: "default" | "outline" | "secondary" | "ghost";
    triggerClassName?: string;
}

export function ChangePasswordDialog({
    triggerLabel = "Đổi mật khẩu",
    triggerVariant = "outline",
    triggerClassName,
}: ChangePasswordDialogProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const onSubmit = (data: FormValues) => {
        if (data.newPassword !== data.confirmPassword) {
            alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
            return;
        }
        console.log("Đổi mật khẩu:", data);
        reset();
        alert("Đổi mật khẩu thành công!");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={triggerVariant} className={triggerClassName}>
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                    <DialogDescription>
                        Vui lòng nhập mật khẩu cũ và mật khẩu mới của bạn.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                        <div className="relative">
                            <Input
                                id="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                {...register("oldPassword", { required: "Mật khẩu cũ không được để trống" })}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.oldPassword && (
                            <span className="text-red-500 text-sm">{errors.oldPassword.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                {...register("newPassword", { required: "Mật khẩu mới không được để trống" })}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <span className="text-red-500 text-sm">{errors.newPassword.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                {...register("confirmPassword", { required: "Vui lòng xác nhận mật khẩu mới" })}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="submit">Xác nhận</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
