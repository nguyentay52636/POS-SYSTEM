"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@/components/ui/custom/toast-custom.css";

export default function ToastProvider() {
    return (
        <ToastContainer
            position="top-right"
            autoClose={2000}
            toastClassName="custom-toast"
            className="custom-toast-container"
            progressClassName="custom-toast-progress"
        />
    );
}
