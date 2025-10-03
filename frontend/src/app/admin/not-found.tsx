"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function NotFound() {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith("/admin");
    const router = useRouter();
    const handleGoBack = () => {
        if (isAdminPage) {
            router.push("/admin");
        } else {
            router.push("/");
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
            <h1 className="text-6xl font-bold text-red-600">404</h1>
            <h2 className="text-2xl font-semibold mt-4">Trang không tồn tại</h2>
            <p className="text-gray-600 mt-2">
                Xin lỗi, trang bạn tìm không có hoặc đã bị xóa.
            </p>

            <img
                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMTNxeHdvMXhwdWdzaXcyenU3bTRwYnZyZmJma3RrMDltZGF6NzhjMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/WirhZMBF1AZVK/giphy.gif"
                alt="Funny 404 gif"
                className="w-100 h-100 mt-10 rounded-xl shadow-lg"
            />

            <Link
                onClick={handleGoBack}
                href={isAdminPage ? "/admin" : "/"}
                as={isAdminPage ? "/admin" : "/"}
                className="mt-10 px-6 py-2 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition"
            >
                {isAdminPage ? "Về Trang Quản lý" : "Về Trang Chủ"}
            </Link>
        </div>
    );
}