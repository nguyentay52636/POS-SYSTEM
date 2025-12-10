"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import { Eye, EyeOff, Lock, KeyRound, ShieldCheck, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { changePasswordThunk, resetChangePasswordState } from "@/redux/Slice/authSlice";
import { toast } from "sonner";

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
    const dispatch = useDispatch<AppDispatch>();
    const { changePasswordLoading, changePasswordSuccess, changePasswordError } = useSelector((state: RootState) => state.auth);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormValues>();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const newPassword = watch("newPassword");

    useEffect(() => {
        if (changePasswordSuccess) {
            toast.success("Đổi mật khẩu thành công!");
            reset();
            setIsOpen(false);
            dispatch(resetChangePasswordState());
        }
    }, [changePasswordSuccess, reset, dispatch]);

    useEffect(() => {
        if (changePasswordError) {
            toast.error(changePasswordError);
            dispatch(resetChangePasswordState());
        }
    }, [changePasswordError, dispatch]);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            reset();
            setShowOldPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
            dispatch(resetChangePasswordState());
        }
    };

    const onSubmit = (data: FormValues) => {
        dispatch(changePasswordThunk({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
            confirmPassword: data.confirmPassword
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={triggerVariant} className={triggerClassName}>
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">Đổi mật khẩu</DialogTitle>
                    <DialogDescription className="text-center">
                        Vui lòng nhập mật khẩu cũ và mật khẩu mới của bạn để cập nhật.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
                    {/* Old Password */}
                    <div className="space-y-2">
                        <Label htmlFor="oldPassword" className="flex items-center gap-2 text-sm font-medium">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                            Mật khẩu hiện tại
                        </Label>
                        <div className="relative">
                            <Input
                                id="oldPassword"
                                type={showOldPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu hiện tại"
                                {...register("oldPassword", { required: "Mật khẩu cũ không được để trống" })}
                                className="pr-10 h-11"
                                disabled={changePasswordLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.oldPassword && (
                            <p className="text-destructive text-sm flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
                                {errors.oldPassword.message}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <Label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-medium">
                            <KeyRound className="h-4 w-4 text-muted-foreground" />
                            Mật khẩu mới
                        </Label>
                        <div className="relative">
                            <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Nhập mật khẩu mới"
                                {...register("newPassword", {
                                    required: "Mật khẩu mới không được để trống",
                                    minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
                                })}
                                className="pr-10 h-11"
                                disabled={changePasswordLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="text-destructive text-sm flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
                                {errors.newPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                            Xác nhận mật khẩu mới
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu mới"
                                {...register("confirmPassword", {
                                    required: "Vui lòng xác nhận mật khẩu mới",
                                    validate: value => value === newPassword || "Mật khẩu xác nhận không khớp"
                                })}
                                className="pr-10 h-11"
                                disabled={changePasswordLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-destructive text-sm flex items-center gap-1">
                                <span className="inline-block w-1 h-1 rounded-full bg-destructive"></span>
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-4 gap-2 sm:gap-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={changePasswordLoading}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={changePasswordLoading} className="min-w-[100px]">
                            {changePasswordLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Xác nhận"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
