# 🛍️ Retail Store – Hệ thống bán hàng

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?style=for-the-badge&logo=dotnet)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs)]()
[![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?style=for-the-badge&logo=swagger)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

---

## 📦 Database Diagram
🔗 [Xem chi tiết DB tại dbdiagram](https://dbdiagram.io/d/GO_SYSTEM-68de2ba1d2b621e422eb8965)

---

## 🚀 Giới thiệu

**Retail Store** là hệ thống bán hàng hiện đại cho cửa hàng bán lẻ, với kiến trúc **Frontend + Backend** tách biệt:

- 🎨 **Frontend**: phát triển bằng **Next.js 15** → UI nhanh, mượt, responsive, hỗ trợ SEO tốt.  
- ⚙️ **Backend**: xây dựng trên **ASP.NET Core .NET 9** → cung cấp API mạnh mẽ, dễ mở rộng, tích hợp **Swagger UI** để test & tài liệu hoá API.  

---

## 🛠️ Công nghệ sử dụng

| Phần | Công nghệ |
|------|-----------|
| **Backend** | ASP.NET Core .NET 9, Swagger UI, Entity Framework Core 9, SQL Server |
| **Frontend** | Next.js 15 (React 19 App Router), TailwindCSS, Axios / Fetch API, TypeScript |

---

## ✨ Tính năng chính
- 📦 Quản lý sản phẩm: thêm, sửa, xoá, tìm kiếm  
- 🛒 Giỏ hàng: thêm sản phẩm, cập nhật số lượng, tính tổng tiền  
- 👥 Khách hàng: quản lý thông tin, lịch sử mua hàng  
- 📊 Thống kê bán hàng: báo cáo doanh thu theo ngày / tháng  
- 🔑 Xác thực & phân quyền: Admin, nhân viên bán hàng  

---

## ⚡ Cấu trúc dự án

```bash
📦 NET-1-project
 ┣ 📂 backend   # Backend API (.NET 9 + Swagger)
 ┣ 📂 frontend  # Frontend (Next.js 15 + TailwindCSS)
 ┣ 📜 README.md # Tài liệu dự án
