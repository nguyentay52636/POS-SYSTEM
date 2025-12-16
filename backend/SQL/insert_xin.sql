-- INSERT DATA SCRIPT (REALISTIC, 40 PRODUCTS, REALISTIC SUPPLIERS)
-- (Sẽ được sinh đầy đủ ở các lần cập nhật tiếp theo)

-- FULL INSERT DATA SCRIPT FOR DATABASE mini_sp01
-- Created: realistic mock data for a mini supermarket
-- Contains: 40 products, realistic suppliers, 10 employees, 10 customers with invoices,
-- 1 phiếu nhập per product, inventory, pricing rules, promotions, and history.

USE mini_sp01;
GO

-- 1. Tbl_ThuongHieu (brands)
INSERT INTO Tbl_ThuongHieu (TenThuongHieu, TrangThai) VALUES
(N'Vinamilk', N'Hoạt động'),
(N'Coca-Cola', N'Hoạt động'),
(N'PepsiCo', N'Hoạt động'),
(N'Acecook', N'Hoạt động'),
(N'Kinh Đô', N'Hoạt động'),
(N'Unilever', N'Hoạt động'),
(N'Nestlé', N'Hoạt động'),
(N'P&G', N'Hoạt động'),
(N'TH True Milk', N'Hoạt động'),
(N'Yomost', N'Hoạt động'),
(N'Chinsu', N'Hoạt động'),
(N'Ajinomoto', N'Hoạt động'),
(N'Maggi', N'Hoạt động'),
(N'Knorr', N'Hoạt động'),
(N'Wall''s', N'Hoạt động');
GO

-- 2. Tbl_Loai (categories)
INSERT INTO Tbl_Loai (TenLoai, MoTa, TrangThai) VALUES
(N'Sữa & sữa nước', N'Sữa tươi, sữa tiệt trùng, sữa chua', N'Hoạt động'),
(N'Nước giải khát', N'Nước ngọt, nước suối, trà sữa', N'Hoạt động'),
(N'Mì & đồ ăn nhanh', N'Mì ăn liền, snack', N'Hoạt động'),
(N'Bánh kẹo', N'Bánh, kẹo, chocolate', N'Hoạt động'),
(N'Gia vị & nước chấm', N'Nước mắm, hạt nêm, bột canh', N'Hoạt động'),
(N'Đồ gia dụng', N'Bột giặt, nước rửa chén', N'Hoạt động'),
(N'Hóa mỹ phẩm', N'Dầu gội, sữa tắm, chăm sóc cá nhân', N'Hoạt động'),
(N'Đồ đông lạnh', N'Kem, cá viên, thực phẩm đông lạnh', N'Hoạt động');
GO

-- 3. Tbl_DonVi (units)
INSERT INTO Tbl_DonVi (TenDonVi, MoTa, TrangThai) VALUES
(N'Chai', N'Chai nhựa', N'Hoạt động'),
(N'Lon', N'Lon nhôm', N'Hoạt động'),
(N'Gói', N'Gói nhỏ', N'Hoạt động'),
(N'Thùng', N'Thùng carton', N'Hoạt động'),
(N'Hộp', N'Hộp giấy/nhựa', N'Hoạt động'),
(N'Kg', N'Kilogram', N'Hoạt động'),
(N'Lít', N'Lít', N'Hoạt động'),
(N'Túi', N'Túi nhựa/zip', N'Hoạt động'),
(N'Chai nhỏ', N'Chai 200-300ml', N'Hoạt động'),
(N'Đơn vị', N'Đơn vị chung', N'Hoạt động');
GO

-- 4. Tbl_NhaCungCap (suppliers - realistic names)
INSERT INTO Tbl_NhaCungCap (TenNhaCungCap, DiaChi, SoDienThoai, Email, TrangThai) VALUES
(N'Vinamilk Distribution', N'KCN Tân Tạo, Bình Tân, TP.HCM', '02835000001', 'sales@vinamilk.vn', N'Hoạt động'),
(N'Coca-Cola Vietnam', N'KCN Tân Thới Hiệp, HCM', '02835000002', 'vn@cocacola.com', N'Hoạt động'),
(N'PepsiCo Vietnam', N'Bình Dương', '02743800003', 'pepsico@vn.com', N'Hoạt động'),
(N'Acecook Vietnam', N'KCN Tân Bình, HCM', '02835000004', 'sales@acecook.com.vn', N'Hoạt động'),
(N'Kinh Đô Foods', N'Quận 7, HCM', '02835000005', 'contact@kinhdo.com.vn', N'Hoạt động'),
(N'Unilever Vietnam', N'KCN Long Thành, Đồng Nai', '02513800006', 'unilever@vn.com', N'Hoạt động'),
(N'Nestle Vietnam', N'KCN Biên Hòa, Đồng Nai', '02513800007', 'nestle@vn.com', N'Hoạt động'),
(N'P&G Vietnam', N'Quận 9, HCM', '02835000008', 'pg@vn.com', N'Hoạt động'),
(N'TH True Milk Co.', N'Bình Dương', '02743800009', 'info@thtrue.com', N'Hoạt động'),
(N'Yomost Distributor', N'Quận 12, HCM', '02835000010', 'sales@yomost.vn', N'Hoạt động'),
(N'Chinsu Foods', N'KCN Tân Bình', '02835000011', 'chinsu@vn.com', N'Hoạt động'),
(N'Ajinomoto Vietnam', N'KCN Long Thành, Đồng Nai', '02513800012', 'ajinomoto@vn.com', N'Hoạt động'),
(N'Masan Consumer', N'Quận 1, HCM', '02835000013', 'masan@vn.com', N'Hoạt động'),
(N'Maggi Vietnam', N'KCN Bình Dương', '02743800014', 'maggi@vn.com', N'Hoạt động'),
(N'Wall''s Vietnam', N'KCN Đồng Nai', '02513800015', 'walls@vn.com', N'Hoạt động');
GO

-- 5. Tbl_SanPham (40 products)
-- Note: IDs of Thương hiệu/Loại/Đơn vị/NhaCungCap correspond to insertion order above
INSERT INTO Tbl_SanPham (TenSanPham, MaDonVi, MaThuongHieu, MaLoai, MoTa, GiaBan, HinhAnh, XuatXu, HSD, TrangThai) VALUES
-- 1-10: sữa & nước giải khát
(N'Sữa tươi Vinamilk 1L', 1, 1, 1, N'Sữa tươi nguyên kem 1L', 34000, NULL, N'Việt Nam', '2026-06-30', N'Còn hàng'),
(N'Sữa Vinamilk 220ml', 9, 1, 1, N'Sữa tiệt trùng 220ml', 9000, NULL, N'Việt Nam', '2026-04-30', N'Còn hàng'),
(N'Coca-Cola 390ml', 1, 2, 2, N'Nước ngọt có gas 390ml', 12000, NULL, N'Việt Nam', '2026-03-31', N'Còn hàng'),
(N'Pepsi 330ml', 2, 3, 2, N'Nước ngọt có gas 330ml', 11000, NULL, N'Việt Nam', '2026-03-31', N'Còn hàng'),
(N'Nước suối LaVie 500ml', 1, 7, 2, N'Nước khoáng đóng chai 500ml', 7000, NULL, N'Việt Nam', '2027-12-31', N'Còn hàng'),
(N'Milo 180ml', 1, 7, 1, N'Sữa lúa mạch Milo liền uống', 11000, NULL, N'Việt Nam', '2026-09-30', N'Còn hàng'),
(N'Yomost dâu 110ml', 9, 10, 1, N'Sữa chua uống Yomost 110ml', 8000, NULL, N'Việt Nam', '2026-02-28', N'Còn hàng'),
(N'Sữa TH True Milk 1L', 1, 9, 1, N'Sữa tươi TH 1L', 36000, NULL, N'Việt Nam', '2026-08-31', N'Còn hàng'),
(N'Nescafé 3in1 20 gói', 5, 7, 2, N'Cà phê hòa tan 3in1', 45000, NULL, N'Việt Nam', '2026-05-31', N'Còn hàng'),
(N'Pepsi lon 330ml', 2, 3, 2, N'Lon Pepsi 330ml', 12000, NULL, N'Việt Nam', '2026-03-31', N'Còn hàng'),
-- 11-20: mì & bánh kẹo
(N'Mì Omachi tôm 80g', 3, 4, 3, N'Mì ăn liền vị tôm', 9500, NULL, N'Việt Nam', '2026-07-31', N'Còn hàng'),
(N'Mì Acecook 65g', 3, 4, 3, N'Mì ăn liền Acecook', 7000, NULL, N'Việt Nam', '2026-06-30', N'Còn hàng'),
(N'Bánh quy Kinh Đô bơ 200g', 5, 5, 4, N'Bánh quy bơ', 28000, NULL, N'Việt Nam', '2026-11-30', N'Còn hàng'),
(N'Kẹo sữa Nestlé 100g', 5, 7, 4, N'Kẹo chocolate nhỏ', 22000, NULL, N'Việt Nam', '2026-10-30', N'Còn hàng'),
(N'Lay''s vị muối 52g', 3, 11, 4, N'Khoai tây chiên', 15000, NULL, N'Thái Lan', '2026-02-28', N'Còn hàng'),
(N'Bánh quy Oreo 154g', 5, 7, 4, N'Bánh quy kem', 36000, NULL, N'Việt Nam', '2026-09-30', N'Còn hàng'),
(N'Snack Oishi tôm 65g', 3, 4, 4, N'Snack vị tôm', 12000, NULL, N'Việt Nam', '2026-05-31', N'Còn hàng'),
(N'Chips Pringles 107g', 5, 7, 4, N'Khoai tây giá trị', 59000, NULL, N'Mỹ', '2026-01-31', N'Còn hàng'),
(N'Bánh mì sandwich tươi 400g', 5, 5, 4, N'Bánh tươi hằng ngày', 22000, NULL, N'Việt Nam', '2025-12-31', N'Còn hàng'),
(N'Bánh Pía Kinh Đô 300g', 5, 5, 4, N'Bánh Pía truyền thống', 45000, NULL, N'Việt Nam', '2026-10-31', N'Còn hàng'),
-- 21-30: gia vị & đồ gia dụng
(N'Nước mắm Chinsu 500ml', 1, 11, 5, N'Nước mắm nhãn hiệu Chinsu', 32000, NULL, N'Việt Nam', '2027-05-20', N'Còn hàng'),
(N'Hạt nêm Ajinomoto 450g', 3, 12, 5, N'Hạt nêm đa dụng', 28000, NULL, N'Việt Nam', '2027-03-31', N'Còn hàng'),
(N'Bột canh Knorr 200g', 3, 14, 5, N'Gia vị Knorr', 15000, NULL, N'Việt Nam', '2027-04-30', N'Còn hàng'),
(N'Đường trắng 1kg', 6, 5, 5, N'Đường tinh luyện', 24000, NULL, N'Việt Nam', '2027-12-31', N'Còn hàng'),
(N'Bột giặt OMO 3kg', 4, 6, 6, N'Bột giặt gia dụng', 129000, NULL, N'Việt Nam', '2028-01-01', N'Còn hàng'),
(N'Nước rửa chén Sunlight 750ml', 1, 6, 6, N'Nước rửa chén hương chanh', 29000, NULL, N'Việt Nam', '2027-06-30', N'Còn hàng'),
(N'Giấy vệ sinh 4 cuộn', 8, 6, 6, N'Giấy cuộn 2 lớp', 35000, NULL, N'Việt Nam', '2027-12-31', N'Còn hàng'),
(N'Xà phòng Dove 90g', 5, 6, 7, N'Xà phòng dưỡng da', 22000, NULL, N'Việt Nam', '2027-08-31', N'Còn hàng'),
(N'Dầu gội Clear 650ml', 1, 6, 7, N'Dầu gội sạch gàu', 119000, NULL, N'Việt Nam', '2027-02-01', N'Còn hàng'),
(N'Sữa tắm Lifebuoy 500ml', 1, 6, 7, N'Sữa tắm diệt khuẩn', 47000, NULL, N'Việt Nam', '2027-03-01', N'Còn hàng'),
-- 31-40: đồ đông lạnh & thực phẩm tươi
(N'Kem Wall''s Vani 80ml', 1, 15, 8, N'Kem vị vani', 15000, NULL, N'Việt Nam', '2026-08-31', N'Còn hàng'),
(N'Kem Wall''s Socola 80ml', 1, 15, 8, N'Kem vị socola', 15000, NULL, N'Việt Nam', '2026-08-31', N'Còn hàng'),
(N'Chả cá viên đông lạnh 500g', 5, 5, 8, N'Chả cá viên đông lạnh', 46000, NULL, N'Việt Nam', '2026-09-30', N'Còn hàng'),
(N'Thịt heo ba chỉ 1kg', 6, 1, 8, N'Thịt heo tươi ba chỉ', 130000, NULL, N'Việt Nam', NULL, N'Còn hàng'),
(N'Cá basa fillet 500g', 6, 5, 8, N'Cá basa fillet đông lạnh', 85000, NULL, N'Việt Nam', '2026-12-31', N'Còn hàng'),
(N'Rau cải xanh bó 300g', 8, 5, 8, N'Rau sạch', 12000, NULL, N'Việt Nam', '2025-12-31', N'Còn hàng'),
(N'Gà ta nguyên con 1.2kg', 6, 5, 8, N'Gà tươi', 140000, NULL, N'Việt Nam', NULL, N'Còn hàng'),
(N'Pate trứng 200g', 5, 5, 4, N'Pate ăn kèm bánh mì', 18000, NULL, N'Việt Nam', '2026-07-31', N'Còn hàng'),
(N'Kem Wall''s Dâu 80ml', 1, 15, 8, N'Kem vị dâu', 15000, NULL, N'Việt Nam', '2026-08-31', N'Còn hàng'),
(N'Kem Wall''s Sữa 80ml', 1, 15, 8, N'Kem vị sữa', 15000, NULL, N'Việt Nam', '2026-08-31', N'Còn hàng');
GO

-- 6. Tbl_KhoHang: khởi tạo tồn kho cho các sản phẩm đã được insert
INSERT INTO Tbl_KhoHang (MaSanPham, SoLuong, TrangThai, TrangThaiDieuKien)
SELECT MaSanPham, SoLuong, TrangThai, TrangThaiDieuKien
FROM (VALUES
(1, 120, N'Còn hàng', N'Bán'),(2, 200, N'Còn hàng', N'Bán'),(3, 250, N'Còn hàng', N'Bán'),(4, 180, N'Còn hàng', N'Bán'),(5, 400, N'Còn hàng', N'Bán'),
(6, 150, N'Còn hàng', N'Bán'),(7, 140, N'Còn hàng', N'Bán'),(8, 90, N'Còn hàng', N'Bán'),(9, 220, N'Còn hàng', N'Bán'),(10, 210, N'Còn hàng', N'Bán'),
(11, 600, N'Còn hàng', N'Bán'),(12, 500, N'Còn hàng', N'Bán'),(13, 80, N'Còn hàng', N'Bán'),(14, 150, N'Còn hàng', N'Bán'),(15, 140, N'Còn hàng', N'Bán'),
(16, 130, N'Còn hàng', N'Bán'),(17, 110, N'Còn hàng', N'Bán'),(18, 190, N'Còn hàng', N'Bán'),(19, 95, N'Còn hàng', N'Bán'),(20, 85, N'Còn hàng', N'Bán'),
(21, 300, N'Còn hàng', N'Bán'),(22, 260, N'Còn hàng', N'Bán'),(23, 220, N'Còn hàng', N'Bán'),(24, 120, N'Còn hàng', N'Bán'),(25, 80, N'Còn hàng', N'Bán'),
(26, 100, N'Còn hàng', N'Bán'),(27, 70, N'Còn hàng', N'Bán'),(28, 65, N'Còn hàng', N'Bán'),(29, 50, N'Còn hàng', N'Bán'),(30, 45, N'Còn hàng', N'Bán'),
(31, 200, N'Còn hàng', N'Bán'),(32, 200, N'Còn hàng', N'Bán'),(33, 150, N'Còn hàng', N'Bán'),(34, 60, N'Còn hàng', N'Bán'),(35, 90, N'Còn hàng', N'Bán'),
(36, 70, N'Còn hàng', N'Bán'),(37, 110, N'Còn hàng', N'Bán'),(38, 55, N'Còn hàng', N'Bán'),(39, 85, N'Còn hàng', N'Bán'),(40, 140, N'Còn hàng', N'Bán'),
(41, 180, N'Còn hàng', N'Bán'),(42, 180, N'Còn hàng', N'Bán')
) AS v(MaSanPham, SoLuong, TrangThai, TrangThaiDieuKien)
WHERE EXISTS (SELECT 1 FROM Tbl_SanPham WHERE Tbl_SanPham.MaSanPham = v.MaSanPham);
GO

-- 7. Tbl_PhieuNhap: one import voucher per product (40 phiếu nhập)
-- We'll assign suppliers roughly by product type/brand
INSERT INTO Tbl_PhieuNhap (NgayNhap, MaNhaCungCap, TongTien, TrangThai, LyDoHuy) VALUES
-- 1..10
(DATEADD(day, -40, GETDATE()), 1, 3600000, N'Nhập thành công', NULL),
(DATEADD(day, -39, GETDATE()), 2, 2200000, N'Nhập thành công', NULL),
(DATEADD(day, -38, GETDATE()), 3, 1500000, N'Nhập thành công', NULL),
(DATEADD(day, -37, GETDATE()), 4, 800000, N'Nhập thành công', NULL),
(DATEADD(day, -36, GETDATE()), 5, 3000000, N'Nhập thành công', NULL),
(DATEADD(day, -35, GETDATE()), 8, 1650000, N'Nhập thành công', NULL),
(DATEADD(day, -34, GETDATE()), 10, 640000, N'Nhập thành công', NULL),
(DATEADD(day, -33, GETDATE()), 9, 2200000, N'Nhập thành công', NULL),
(DATEADD(day, -32, GETDATE()), 7, 450000, N'Nhập thành công', NULL),
(DATEADD(day, -31, GETDATE()), 3, 1200000, N'Nhập thành công', NULL),
-- 11..20
(DATEADD(day, -30, GETDATE()), 4, 900000, N'Nhập thành công', NULL),
(DATEADD(day, -29, GETDATE()), 4, 700000, N'Nhập thành công', NULL),
(DATEADD(day, -28, GETDATE()), 5, 1000000, N'Nhập thành công', NULL),
(DATEADD(day, -27, GETDATE()), 7, 450000, N'Nhập thành công', NULL),
(DATEADD(day, -26, GETDATE()), 11, 350000, N'Nhập thành công', NULL),
(DATEADD(day, -25, GETDATE()), 6, 4800000, N'Nhập thành công', NULL),
(DATEADD(day, -24, GETDATE()), 6, 900000, N'Nhập thành công', NULL),
(DATEADD(day, -23, GETDATE()), 6, 1500000, N'Nhập thành công', NULL),
(DATEADD(day, -22, GETDATE()), 15, 600000, N'Nhập thành công', NULL),
(DATEADD(day, -21, GETDATE()), 13, 2200000, N'Nhập thành công', NULL),
-- 21..30
(DATEADD(day, -20, GETDATE()), 11, 900000, N'Nhập thành công', NULL),
(DATEADD(day, -19, GETDATE()), 12, 700000, N'Nhập thành công', NULL),
(DATEADD(day, -18, GETDATE()), 14, 450000, N'Nhập thành công', NULL),
(DATEADD(day, -17, GETDATE()), 13, 300000, N'Nhập thành công', NULL),
(DATEADD(day, -16, GETDATE()), 6, 250000, N'Nhập thành công', NULL),
(DATEADD(day, -15, GETDATE()), 6, 1200000, N'Nhập thành công', NULL),
(DATEADD(day, -14, GETDATE()), 6, 420000, N'Nhập thành công', NULL),
(DATEADD(day, -13, GETDATE()), 6, 380000, N'Nhập thành công', NULL),
(DATEADD(day, -12, GETDATE()), 15, 240000, N'Nhập thành công', NULL),
(DATEADD(day, -11, GETDATE()), 15, 260000, N'Nhập thành công', NULL),
-- 31..40
(DATEADD(day, -10, GETDATE()), 15, 800000, N'Nhập thành công', NULL),
(DATEADD(day, -9, GETDATE()), 13, 520000, N'Nhập thành công', NULL),
(DATEADD(day, -8, GETDATE()), 13, 860000, N'Nhập thành công', NULL),
(DATEADD(day, -7, GETDATE()), 13, 720000, N'Nhập thành công', NULL),
(DATEADD(day, -6, GETDATE()), 13, 340000, N'Nhập thành công', NULL),
(DATEADD(day, -5, GETDATE()), 13, 500000, N'Nhập thành công', NULL),
(DATEADD(day, -4, GETDATE()), 13, 420000, N'Nhập thành công', NULL),
(DATEADD(day, -3, GETDATE()), 13, 360000, N'Nhập thành công', NULL),
(DATEADD(day, -2, GETDATE()), 13, 200000, N'Nhập thành công', NULL),
(DATEADD(day, -1, GETDATE()), 13, 180000, N'Nhập thành công', NULL),
(DATEADD(day, 0, GETDATE()), 15, 2160000, N'Nhập thành công', NULL),
(DATEADD(day, 0, GETDATE()), 15, 2160000, N'Nhập thành công', NULL);
GO

-- 8. Tbl_ChiTietPhieuNhap: one detail per product linking to corresponding phieu nhap
-- We assume MaPhieuNhap 1..42 correspond to above rows; MaSanPham 1..42
-- DonGiaNhap chosen lower than GiaBan; ThanhTien = SoLuong * DonGiaNhap
INSERT INTO Tbl_ChiTietPhieuNhap (MaSanPham, MaPhieuNhap, SoLuong, DonGiaNhap, ThanhTien)
SELECT v.MaSanPham, v.MaPhieuNhap, v.SoLuong, v.DonGiaNhap, v.ThanhTien
FROM (VALUES
(1, 1, 120, 30000, 120 * 30000),
(2, 2, 200, 7200, 200 * 7200),
(3, 3, 250, 9600, 250 * 9600),
(4, 4, 180, 8200, 180 * 8200),
(5, 5, 400, 5000, 400 * 5000),
(6, 6, 150, 9000, 150 * 9000),
(7, 7, 140, 7500, 140 * 7500),
(8, 8, 90, 11000, 90 * 11000),
(9, 9, 220, 38000, 220 * 38000),
(10, 10, 210, 8000, 210 * 8000),
(11, 11, 600, 3000, 600 * 3000),
(12, 12, 500, 5500, 500 * 5500),
(13, 13, 80, 26000, 80 * 26000),
(14, 14, 150, 14000, 150 * 14000),
(15, 15, 140, 13500, 140 * 13500),
(16, 16, 130, 90000, 130 * 90000),
(17, 17, 110, 60000, 110 * 60000),
(18, 18, 190, 32000, 190 * 32000),
(19, 19, 95, 70000, 95 * 70000),
(20, 20, 85, 45000, 85 * 45000),
(21, 21, 300, 28000, 300 * 28000),
(22, 22, 260, 20000, 260 * 20000),
(23, 23, 220, 18000, 220 * 18000),
(24, 24, 120, 12000, 120 * 12000),
(25, 25, 80, 17000, 80 * 17000),
(26, 26, 100, 32000, 100 * 32000),
(27, 27, 70, 40000, 70 * 40000),
(28, 28, 65, 13000, 65 * 13000),
(29, 29, 50, 100000, 50 * 100000),
(30, 30, 45, 140000, 45 * 140000),
(31, 31, 200, 12000, 200 * 12000),
(32, 32, 200, 12000, 200 * 12000),
(33, 33, 150, 38000, 150 * 38000),
(34, 34, 60, 110000, 60 * 110000),
(35, 35, 90, 75000, 90 * 75000),
(36, 36, 70, 10000, 70 * 10000),
(37, 37, 110, 120000, 110 * 120000),
(38, 38, 55, 120000, 55 * 120000),
(39, 39, 85, 15000, 85 * 15000),
(40, 40, 140, 15000, 140 * 15000),
(41, 41, 180, 12000, 180 * 12000),
(42, 42, 180, 12000, 180 * 12000)
) AS v(MaSanPham, MaPhieuNhap, SoLuong, DonGiaNhap, ThanhTien)
WHERE EXISTS (SELECT 1 FROM Tbl_SanPham WHERE Tbl_SanPham.MaSanPham = v.MaSanPham)
  AND EXISTS (SELECT 1 FROM Tbl_PhieuNhap WHERE Tbl_PhieuNhap.MaPhieuNhap = v.MaPhieuNhap);
GO

-- 9. Tbl_CauHinhLoiNhuan (default profit %)
INSERT INTO Tbl_CauHinhLoiNhuan (PhanTramLoiNhuanMacDinh, NgayCapNhat, MaNhanVien) VALUES (15.00, GETDATE(), NULL);
GO

-- 10. Tbl_QuyTacLoiNhuan (a few product-specific margins)
INSERT INTO Tbl_QuyTacLoiNhuan (LoaiQuyTac, MaSanPham, PhanTramLoiNhuan, UuTien, TrangThai, MaNhanVien) VALUES
(N'TheoSanPham', 1, 20.00, 1, N'Hoạt động', NULL),
(N'TheoSanPham', 9, 18.00, 1, N'Hoạt động', NULL),
(N'TheoSanPham', 16, 22.00, 1, N'Hoạt động', NULL),
(N'TheoSanPham', 31, 15.00, 1, N'Hoạt động', NULL);
GO

-- 11. Update GiaBan in Tbl_SanPham: GiaBan = DonGiaNhap (giá nhập)
-- Lưu ý: GiaBan giờ lưu giá nhập, giá bán thực tế sẽ được tính động từ giá nhập + % lợi nhuận
UPDATE sp
SET sp.GiaBan = COALESCE(ctpn.DonGiaNhap, sp.GiaBan)
FROM Tbl_SanPham sp
OUTER APPLY (
    SELECT TOP 1 ctpn.DonGiaNhap
    FROM Tbl_ChiTietPhieuNhap ctpn
    INNER JOIN Tbl_PhieuNhap pn ON ctpn.MaPhieuNhap = pn.MaPhieuNhap
    WHERE ctpn.MaSanPham = sp.MaSanPham
      AND pn.TrangThai = N'Nhập thành công'
    ORDER BY pn.NgayNhap DESC, ctpn.MaChiTietPhieuNhap DESC
) AS ctpn;
GO

-- 12. Tbl_NhanVien (10 random realistic employees)
INSERT INTO Tbl_NhanVien (TenNhanVien, GioiTinh, NgaySinh, SoDienThoai, VaiTro, TrangThai) VALUES
(N'Nguyễn Văn An', N'Nam', '1990-02-15', '0901000111', N'Quản lý', N'Đang làm'),
(N'Trần Thị Bích', N'Nữ', '1995-06-20', '0901000222', N'Thu ngân', N'Đang làm'),
(N'Lê Văn Cường', N'Nam', '1992-09-05', '0901000333', N'Thu ngân', N'Đang làm'),
(N'Phạm Thị Dung', N'Nữ', '1993-12-11', '0901000444', N'Thu ngân', N'Đang làm'),
(N'Hoàng Văn Bình', N'Nam', '1988-07-07', '0901000555', N'Thủ kho', N'Đang làm'),
(N'Võ Thị Hạnh', N'Nữ', '1994-11-03', '0901000666', N'Thủ kho', N'Đang làm'),
(N'Đỗ Văn Khoa', N'Nam', '1991-03-17', '0901000777', N'Thu ngân', N'Đang làm'),
(N'Bùi Thị Lan', N'Nữ', '1997-08-30', '0901000888', N'Thu ngân', N'Đang làm'),
(N'Phan Văn Minh', N'Nam', '1986-05-21', '0901000999', N'Quản lý ca', N'Đang làm'),
(N'Lý Thị Hương', N'Nữ', '1998-01-25', '0901000100', N'Thu ngân', N'Đang làm');
GO

-- 13. Tbl_PhanQuyen (roles)
INSERT INTO Tbl_PhanQuyen (TenQuyen, MoTa) VALUES
(N'Admin', N'Toàn quyền hệ thống'),
(N'Quản lý', N'Quản lý cửa hàng'),
(N'Thu ngân', N'Nhân viên bán hàng'),
(N'Thủ kho', N'Nhân viên kho');
GO

-- 14. Tbl_TaiKhoan (accounts) - admin / 123456 default
INSERT INTO Tbl_TaiKhoan (TenDangNhap, MatKhau, MaNhanVien, MaQuyen, TrangThai) VALUES
('admin', '123456', 1, 1, N'Hoạt động'),
('manager', '123456', 9, 2, N'Hoạt động'),
('thungan1', '123456', 2, 3, N'Hoạt động'),
('thungan2', '123456', 3, 3, N'Hoạt động'),
('thungan3', '123456', 4, 3, N'Hoạt động'),
('thukho1', '123456', 5, 4, N'Hoạt động'),
('thukho2', '123456', 6, 4, N'Hoạt động'),
('thungan4', '123456', 7, 3, N'Hoạt động'),
('thungan5', '123456', 8, 3, N'Hoạt động'),
('cashier_extra', '123456', 10, 3, N'Hoạt động');
GO

-- 15. Tbl_KhachHang (10 customers)
INSERT INTO Tbl_KhachHang (TenKhachHang, SoDienThoai, DiaChi, Email, DiemTichLuy, TrangThai) VALUES
(N'Khách lẻ', '0000000000', N'Tại quầy', NULL, 0, N'Hoạt động'),
(N'Nguyễn Văn A', '0987654321', N'123 Lê Lợi, Q1, TP.HCM', 'nguyenvana@email.com', 120, N'Hoạt động'),
(N'Trần Thị B', '0912345679', N'456 Nguyễn Huệ, Q1', 'tranthib@example.com', 80, N'Hoạt động'),
(N'Lê Văn C', '0923456780', N'789 Điện Biên Phủ, Q.Bình Thạnh', 'levanc@example.com', 150, N'Hoạt động'),
(N'Phạm Thị D', '0934567891', N'321 Võ Văn Tần, Q3', 'phamthid@example.com', 60, N'Hoạt động'),
(N'Hoàng Văn E', '0945678902', N'654 Cách Mạng Tháng 8, Q10', 'hoangvane@example.com', 200, N'Hoạt động'),
(N'Võ Thị F', '0956789013', N'987 Lý Thường Kiệt, Q11', 'vothif@example.com', 40, N'Hoạt động'),
(N'Đỗ Văn G', '0967890124', N'147 Trường Chinh, Q.Tân Phú', 'dovang@example.com', 30, N'Hoạt động'),
(N'Bùi Thị H', '0978901235', N'258 Tân Hương, Q.Tân Phú', 'buithih@example.com', 95, N'Hoạt động'),
(N'Ngô Văn I', '0989012346', N'369 Phạm Văn Đồng, Q.Thủ Đức', 'ngovani@example.com', 110, N'Hoạt động');
GO

-- 16. Tbl_HoaDon (10 invoices for 10 customers)
INSERT INTO Tbl_HoaDon (MaNhanVien, MaKhachHang, TongTien, NgayLap, TrangThai) VALUES
(2, 2, 98000, DATEADD(day, -10, GETDATE()), N'Đã xuất'),
(3, 3, 45000, DATEADD(day, -9, GETDATE()), N'Đã xuất'),
(4, 4, 125000, DATEADD(day, -8, GETDATE()), N'Đã xuất'),
(2, 5, 56000, DATEADD(day, -7, GETDATE()), N'Đã xuất'),
(5, 6, 230000, DATEADD(day, -6, GETDATE()), N'Đã xuất'),
(3, 7, 32000, DATEADD(day, -5, GETDATE()), N'Đã xuất'),
(4, 8, 76000, DATEADD(day, -4, GETDATE()), N'Đã xuất'),
(2, 9, 42000, DATEADD(day, -3, GETDATE()), N'Đã xuất'),
(5, 10, 150000, DATEADD(day, -2, GETDATE()), N'Đã xuất'),
(3, 1, 22000, DATEADD(day, -1, GETDATE()), N'Đã xuất');
GO

-- 17. Tbl_ChiTietHoaDon (details for invoices above)
INSERT INTO Tbl_ChiTietHoaDon (MaHoaDon, MaSanPham, SoLuong, GiaBan) VALUES
-- Invoice 1
(1, 1, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=1), 34000)), 
(1, 3, 2, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=3), 12000)),
-- Invoice 2
(2, 11, 2, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=11), 9500)), 
(2, 12, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=12), 7000)),
-- Invoice 3
(3, 16, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=16), 36000)), 
(3, 21, 3, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=21), 32000)),
-- Invoice 4
(4, 5, 4, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=5), 7000)),
-- Invoice 5
(5, 30, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=30), 47000)), 
(5, 16, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=16), 36000)),
-- Invoice 6
(6, 9, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=9), 45000)), 
(6, 2, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=2), 9000)),
-- Invoice 7
(7, 13, 2, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=13), 28000)), 
(7, 14, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=14), 22000)),
-- Invoice 8
(8, 21, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=21), 32000)), 
(8, 22, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=22), 28000)),
-- Invoice 9
(9, 31, 2, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=31), 15000)), 
(9, 32, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=32), 15000)),
-- Invoice 10
(10, 25, 1, ISNULL((SELECT GiaBan FROM Tbl_SanPham WHERE MaSanPham=25), 129000));
GO

-- 18. Tbl_KhuyenMai (several promotions)
INSERT INTO Tbl_KhuyenMai (MaSanPham, TenKhuyenMai, PhanTramGiamGia, NgayBatDau, NgayKetThuc, MoTa, DieuKien)
SELECT v.MaSanPham, v.TenKhuyenMai, v.PhanTramGiamGia, v.NgayBatDau, v.NgayKetThuc, v.MoTa, v.DieuKien
FROM (VALUES
(3, N'Mùa hè sảng khoái - Coca', 10.00, DATEFROMPARTS(YEAR(GETDATE()),6,1), DATEFROMPARTS(YEAR(GETDATE()),8,31), N'Giảm giá Coca 10%', N'Mua >= 2 lon'),
(11, N'Combo mì Omachi', 15.00, DATEADD(month, -1, GETDATE()), DATEADD(month, 6, GETDATE()), N'Giảm giá mì Omachi khi mua sỉ', N'Mua >= 10 gói'),
(29, N'Chăm sóc tóc - Clear', 20.00, DATEADD(month, -3, GETDATE()), DATEADD(month, 1, GETDATE()), N'Giảm Clear 20%', N'Không kèm điều kiện')
) AS v(MaSanPham, TenKhuyenMai, PhanTramGiamGia, NgayBatDau, NgayKetThuc, MoTa, DieuKien)
WHERE EXISTS (SELECT 1 FROM Tbl_SanPham WHERE Tbl_SanPham.MaSanPham = v.MaSanPham);
GO

-- 19. Tbl_LichSuTichDiem (points history)
INSERT INTO Tbl_LichSuTichDiem (MaKhachHang, MaHoaDon, DiemCong, DiemSuDung, NgayCapNhat, MoTa) VALUES
(2, 1, 9, 0, DATEADD(day, -10, GETDATE()), N'Tích điểm hoá đơn 1'),
(3, 2, 4, 0, DATEADD(day, -9, GETDATE()), N'Tích điểm hoá đơn 2'),
(4, 3, 15, 0, DATEADD(day, -8, GETDATE()), N'Tích điểm hoá đơn 3'),
(5, 4, 5, 0, DATEADD(day, -7, GETDATE()), N'Tích điểm hoá đơn 4'),
(6, 5, 30, 0, DATEADD(day, -6, GETDATE()), N'Tích điểm hoá đơn 5');
GO

-- 20. Tbl_LichSuThayDoiKho (stock change history) - a few sample events
INSERT INTO Tbl_LichSuThayDoiKho (MaSanPham, SoLuongCu, SoLuongMoi, ChenhLech, LoaiThayDoi, LyDo, GhiChu, MaNhanVien, NgayThayDoi)
SELECT v.MaSanPham, v.SoLuongCu, v.SoLuongMoi, v.ChenhLech, v.LoaiThayDoi, v.LyDo, v.GhiChu, v.MaNhanVien, v.NgayThayDoi
FROM (VALUES
(1, 0, 120, 120, N'Nhập hàng', N'Nhập đầu kỳ', N'Nhập từ Vinamilk', 5, DATEADD(day, -40, GETDATE())),
(2, 0, 200, 200, N'Nhập hàng', N'Nhập đầu kỳ', N'Nhập từ Coca-Cola', 5, DATEADD(day, -39, GETDATE())),
(1, 120, 118, -2, N'Bán hàng', N'Bán lẻ', N'2 sp bán ra', 2, DATEADD(day, -10, GETDATE()))
) AS v(MaSanPham, SoLuongCu, SoLuongMoi, ChenhLech, LoaiThayDoi, LyDo, GhiChu, MaNhanVien, NgayThayDoi)
WHERE EXISTS (SELECT 1 FROM Tbl_SanPham WHERE Tbl_SanPham.MaSanPham = v.MaSanPham);
GO

-- 21. Tbl_NhaCungCap_SanPham (mapping suppliers to products)
INSERT INTO Tbl_NhaCungCap_SanPham (MaNhaCungCap, MaSanPham)
SELECT v.MaNhaCungCap, v.MaSanPham
FROM (VALUES
(1,1),(1,2),(9,8),(2,3),(3,4),(7,9),(8,6),(10,7),(4,11),(4,12),
(5,13),(7,14),(11,15),(7,16),(6,17),(6,18),(11,21),(12,22),(14,23),(13,24),(15,31),(15,32),(15,33),(13,34),(13,35),(13,36),(13,37),(13,38),(13,39),(13,40)
) AS v(MaNhaCungCap, MaSanPham)
WHERE EXISTS (SELECT 1 FROM Tbl_SanPham WHERE Tbl_SanPham.MaSanPham = v.MaSanPham)
  AND EXISTS (SELECT 1 FROM Tbl_NhaCungCap WHERE Tbl_NhaCungCap.MaNhaCungCap = v.MaNhaCungCap);
GO

-- 22. Tbl_CauHinhQuyDoiDiem (points to money conversion example)
INSERT INTO Tbl_CauHinhQuyDoiDiem (SoDiem, SoTienTuongUng, NgayCapNhat, MaNhanVien) VALUES
(100, 100000, GETDATE(), 1);
GO

-- 23. Tbl_LoaiQuyen (Loại quyền: Xem, Thêm, Sửa, Xóa)
IF NOT EXISTS (SELECT 1 FROM Tbl_LoaiQuyen WHERE MaLoaiQuyen = 1)
BEGIN
    INSERT INTO Tbl_LoaiQuyen (TenQuyen, MoTa) VALUES
    (N'Xem', N'Quyền xem dữ liệu'),
    (N'Thêm', N'Quyền thêm mới dữ liệu'),
    (N'Sửa', N'Quyền sửa dữ liệu'),
    (N'Xóa', N'Quyền xóa dữ liệu');
END
GO

-- 24. Tbl_ChucNang (Chức năng - mapping với sidebar)
-- Lưu ý: DuongDan phải có prefix "Form_" để khớp với database thực tế
IF NOT EXISTS (SELECT 1 FROM Tbl_ChucNang WHERE DuongDan = 'Form_TrangChu')
BEGIN
    -- Xóa dữ liệu cũ nếu có (để insert lại với DuongDan đúng)
    DELETE FROM Tbl_PhanQuyenChiTiet; -- Xóa chi tiết phân quyền trước
    DELETE FROM Tbl_ChucNang; -- Xóa chức năng cũ
    
    INSERT INTO Tbl_ChucNang (TenChucNang, MaCha, DuongDan, MoTa) VALUES
    -- Chức năng cha (sidebar buttons) - 13 chức năng
    (N'Trang Chủ', NULL, 'Form_TrangChu', N'Trang chủ hệ thống'),
    (N'Bán Hàng', NULL, 'Form_BanHang', N'Chức năng bán hàng'),
    (N'Hóa Đơn', NULL, 'Form_HoaDon', N'Quản lý hóa đơn'),
    (N'Phiếu Nhập', NULL, 'Form_PhieuNhap', N'Quản lý phiếu nhập'),
    (N'Sản Phẩm', NULL, 'Form_SanPham', N'Quản lý sản phẩm'),
    (N'Kho Hàng', NULL, 'Form_KhoHang', N'Quản lý kho hàng'),
    (N'Loại Sản Phẩm', NULL, 'Form_LoaiSanPham', N'Quản lý loại sản phẩm'),
    (N'Khuyến Mãi', NULL, 'Form_KhuyenMai', N'Quản lý khuyến mãi'),
    (N'Khách Hàng', NULL, 'Form_KhachHang', N'Quản lý khách hàng'),
    (N'Nhà Cung Cấp', NULL, 'Form_NhaCungCap', N'Quản lý nhà cung cấp'),
    (N'Nhân Viên', NULL, 'Form_NhanVien', N'Quản lý nhân viên'),
    (N'Tài Khoản', NULL, 'Form_TaiKhoan', N'Quản lý tài khoản'),
    (N'Quản Lý', NULL, 'Form_QuanLy', N'Quản lý hệ thống');
END
GO

-- 25. Tbl_PhanQuyenChiTiet (Chi tiết phân quyền)
-- Mặc định: Admin (MaQuyen = 1) không cần insert vì code sẽ tự động cho quyền tất cả

-- Ví dụ: Cấp quyền cho "Thu ngân" (MaQuyen = 3)
-- Thu ngân có quyền: Xem Bán hàng, Xem Hóa đơn, Xem Khách hàng, Thêm/Sửa Bán hàng, Thêm Hóa đơn
IF NOT EXISTS (SELECT 1 FROM Tbl_PhanQuyenChiTiet WHERE MaQuyen = 3 AND MaChucNang = 2 AND MaLoaiQuyen = 1)
BEGIN
    -- Bán hàng - Xem, Thêm, Sửa
    INSERT INTO Tbl_PhanQuyenChiTiet (MaQuyen, MaChucNang, MaLoaiQuyen, DuocPhep) VALUES
    (3, 2, 1, 1), -- Bán hàng - Xem
    (3, 2, 2, 1), -- Bán hàng - Thêm
    (3, 2, 3, 1), -- Bán hàng - Sửa
    
    -- Hóa đơn - Xem
    (3, 3, 1, 1), -- Hóa đơn - Xem
    
    -- Khách hàng - Xem
    (3, 9, 1, 1); -- Khách hàng - Xem
END
GO

-- Ví dụ: Cấp quyền cho "Thủ kho" (MaQuyen = 4)
-- Thủ kho có quyền: Xem/Thêm/Sửa Phiếu nhập, Xem/Thêm/Sửa Kho hàng, Xem Sản phẩm
IF NOT EXISTS (SELECT 1 FROM Tbl_PhanQuyenChiTiet WHERE MaQuyen = 4 AND MaChucNang = 4 AND MaLoaiQuyen = 1)
BEGIN
    -- Phiếu nhập - Xem, Thêm, Sửa
    INSERT INTO Tbl_PhanQuyenChiTiet (MaQuyen, MaChucNang, MaLoaiQuyen, DuocPhep) VALUES
    (4, 4, 1, 1), -- Phiếu nhập - Xem
    (4, 4, 2, 1), -- Phiếu nhập - Thêm
    (4, 4, 3, 1), -- Phiếu nhập - Sửa
    
    -- Kho hàng - Xem, Thêm, Sửa
    (4, 6, 1, 1), -- Kho hàng - Xem
    (4, 6, 2, 1), -- Kho hàng - Thêm
    (4, 6, 3, 1), -- Kho hàng - Sửa
    
    -- Sản phẩm - Xem
    (4, 5, 1, 1); -- Sản phẩm - Xem
END
GO

-- Ví dụ: Cấp quyền cho "Quản lý" (MaQuyen = 2)
-- Quản lý có quyền hầu hết các chức năng (trừ Quản lý hệ thống)
IF NOT EXISTS (SELECT 1 FROM Tbl_PhanQuyenChiTiet WHERE MaQuyen = 2 AND MaChucNang = 2 AND MaLoaiQuyen = 1)
BEGIN
    -- Quản lý có quyền Xem, Thêm, Sửa cho hầu hết chức năng
    INSERT INTO Tbl_PhanQuyenChiTiet (MaQuyen, MaChucNang, MaLoaiQuyen, DuocPhep) VALUES
    -- Bán hàng
    (2, 2, 1, 1), (2, 2, 2, 1), (2, 2, 3, 1),
    -- Hóa đơn
    (2, 3, 1, 1), (2, 3, 2, 1), (2, 3, 3, 1),
    -- Phiếu nhập
    (2, 4, 1, 1), (2, 4, 2, 1), (2, 4, 3, 1),
    -- Sản phẩm
    (2, 5, 1, 1), (2, 5, 2, 1), (2, 5, 3, 1),
    -- Kho hàng
    (2, 6, 1, 1), (2, 6, 2, 1), (2, 6, 3, 1),
    -- Loại sản phẩm
    (2, 7, 1, 1), (2, 7, 2, 1), (2, 7, 3, 1),
    -- Khuyến mãi
    (2, 8, 1, 1), (2, 8, 2, 1), (2, 8, 3, 1),
    -- Khách hàng
    (2, 9, 1, 1), (2, 9, 2, 1), (2, 9, 3, 1),
    -- Nhà cung cấp
    (2, 10, 1, 1), (2, 10, 2, 1), (2, 10, 3, 1),
    -- Nhân viên
    (2, 11, 1, 1), (2, 11, 2, 1), (2, 11, 3, 1),
    -- Tài khoản
    (2, 12, 1, 1), (2, 12, 2, 1), (2, 12, 3, 1);
END
GO

PRINT N'Hoàn tất: Script INSERT dữ liệu mẫu cho mini_sp01 (40 sản phẩm, suppliers, nhân viên, khách hàng, kho, phiếu nhập, hoá đơn, phân quyền).';
GO
