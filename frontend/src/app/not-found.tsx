"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 px-6">
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-8xl font-extrabold tracking-tight mb-4 text-green-700"
            >
                404
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg md:text-xl text-gray-600 mb-8 text-center max-w-md"
            >
                Oops 😢 Có vẻ như bạn đã lạc vào vùng không tồn tại.<br />
                Hãy quay lại trang chủ nhé!
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            >
                <Link
                    href="/"
                    className="px-6 py-3 bg-green-700 text-white rounded-full font-semibold hover:bg-green-800 transition-all shadow-md hover:shadow-lg"
                >
                    ⬅ Quay về Trang chủ
                </Link>
            </motion.div>

            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 text-sm text-gray-400"
            >
                © {new Date().getFullYear()} Tay Nguyen • Crafted with ❤️ & Next.js
            </motion.div>
        </div>
    );
}
