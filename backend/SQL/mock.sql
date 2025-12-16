-------------------------------------------------
-- 1) ROLES
-------------------------------------------------
INSERT INTO roles (description)
VALUES 
(N'Quản trị viên'),
(N'Nhân viên bán hàng'),
(N'Nhân viên kho');

-------------------------------------------------
-- 2) EMPLOYEES
-------------------------------------------------
INSERT INTO employees (full_name, gender, birth_date, phone, role_position, status)
VALUES
(N'Wes Admin', N'Nam', '1990-01-15', '0909111111', N'Quản lý', 'active'),
(N'Trần Văn Bán', N'Nam', '1995-05-20', '0909222222', N'Nhân viên bán hàng', 'active'),
(N'Nguyễn Kho Hàng', N'Nữ', '1992-08-10', '0909333333', N'Thủ kho', 'active'),
(N'Lê Thị Hoa', N'Nữ', '1998-03-25', '0909444444', N'Nhân viên bán hàng', 'inactive');

-------------------------------------------------
-- 3) USERS
-------------------------------------------------
INSERT INTO users (username, [password], full_name, employee_id, role_id, status)
VALUES
('admin', '123456', N'Wes Admin', 1, 1, 'active'),
('seller01', '123456', N'Trần Văn Bán', 2, 2, 'active'),
('warehouse01', '123456', N'Nguyễn Kho Hàng', 3, 3, 'active');

-------------------------------------------------
-- 4) CUSTOMERS
-------------------------------------------------
INSERT INTO customers (name, phone, email, address, customer_point, status)
VALUES
(N'Nguyễn Văn A', '0901111111', 'a@gmail.com', N'Quận 1', 0, 'active'),
(N'Lê Thị B', '0902222222', 'b@gmail.com', N'Quận 10', 150, 'active'),
(N'Phạm Văn C', '0903333333', 'c@gmail.com', N'Bình Thạnh', 500, 'active'),
(N'Trần Văn D', '0904444444', 'd@gmail.com', N'Quận 5', 0, 'inactive');


-------------------------------------------------
-- 4) CATEGORIES
-------------------------------------------------
INSERT INTO categories (category_name)
VALUES
(N'Đồ uống'),
(N'Bánh kẹo'),
(N'Gia vị');

-------------------------------------------------
-- 5) SUPPLIERS
-------------------------------------------------
INSERT INTO suppliers (name, phone, email, address, status)
VALUES
(N'Công ty Nước Giải Khát ABC', '0904000001', 'abc@drink.com', N'Quận 7', 'active'),
(N'Nhà Cung Cấp Bánh Kẹo XYZ', '0904000002', 'xyz@candy.com', N'Quận 8', 'active');

-------------------------------------------------
-- 6) PRODUCTS
-------------------------------------------------
INSERT INTO products (category_id, supplier_id, product_name, barcode, price, unit, image_url)
VALUES
(1, 1, N'Coca Cola lon', 'SP1001', 10000, 'lon', 'https://example.com/coca.jpg'),
(1, 1, N'Trà xanh O', 'SP1002', 12000, 'chai', 'https://example.com/traxanh.jpg'),
(2, 2, N'Bánh Oreo', 'SP2001', 15000, 'gói', 'https://example.com/oreo.jpg'),
(3, 2, N'Nước mắm Nam Ngư', 'SP3001', 30000, 'chai', 'https://example.com/nuocmam.jpg');

-------------------------------------------------
-- 7) INVENTORY
-------------------------------------------------
INSERT INTO inventory (product_id, quantity, status)
VALUES
(1, 100, 'available'),
(2, 80, 'available'),
(3, 60, 'available'),
(4, 50, 'available');

-------------------------------------------------
-- 8) PROMOTIONS
-------------------------------------------------
INSERT INTO promotions (promo_code, description, discount_type, discount_value, start_date, end_date, min_order_amount, usage_limit, status)
VALUES
('SALE10', N'Giảm 10%', 'percent', 10, '2025-01-01', '2025-12-31', 50000, 100, 'active'),
('GIAM5K', N'Giảm 5.000đ', 'fixed', 5000, '2025-01-01', '2025-06-30', 30000, 200, 'active');

-------------------------------------------------
-- 9) PROMOTION_PRODUCTS
-------------------------------------------------
INSERT INTO promotion_products (promotion_id, product_id)
VALUES
(1, 1),
(1, 3),
(2, 2);

-------------------------------------------------
-- 10) ORDERS
-------------------------------------------------
INSERT INTO orders (customer_id, user_id, promo_id, status, total_amount, discount_amount)
VALUES
(1, 2, 1, 'paid', 55000, 5500),
(2, 2, NULL, 'paid', 30000, 0);

-------------------------------------------------
-- 11) ORDER ITEMS
-------------------------------------------------
INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
VALUES
(1, 1, 2, 10000, 20000),
(1, 3, 1, 15000, 15000),
(2, 4, 1, 30000, 30000);

-------------------------------------------------
-- 12) PAYMENTS
-------------------------------------------------
INSERT INTO payments (order_id, amount, payment_method)
VALUES
(1, 49500, 'cash'),
(2, 30000, 'card');

-------------------------------------------------
-- 13) IMPORT RECEIPTS
-------------------------------------------------
INSERT INTO import_receipts (supplier_id, user_id, total_amount, status, cancellation_reason, note)
VALUES
(1, 3, 300000, 'completed', NULL, N'Nhập Coca & Trà xanh'),
(2, 3, 200000, 'completed', NULL, N'Nhập Oreo');

-------------------------------------------------
-- 14) IMPORT ITEMS
-------------------------------------------------
INSERT INTO import_items (import_id, product_id, quantity, unit_price, subtotal)
VALUES
(1, 1, 50, 8000, 400000),
(1, 2, 50, 9000, 450000),
(2, 3, 100, 10000, 100000);

-------------------------------------------------
-- 15) EXPORT RECEIPTS
-------------------------------------------------
INSERT INTO export_receipts (customer_id, user_id, total_amount, status, note)
VALUES
(1, 2, 50000, 'completed', N'Xuất hàng cho khách A'),
(3, 2, 30000, 'completed', N'Xuất hàng cho khách C');

-------------------------------------------------
-- 16) EXPORT ITEMS
-------------------------------------------------
INSERT INTO export_items (export_id, product_id, quantity, unit_price, subtotal)
VALUES
(1, 1, 3, 10000, 30000),
(1, 3, 1, 15000, 15000),
(2, 4, 1, 30000, 30000);

-------------------------------------------------
-- 17) FEATURES (Chức năng - có phân cấp cha-con)
-------------------------------------------------
-- Quyền cha (parent features)
INSERT INTO features (feature_name, parent_id, route_path, icon, display_order, description)
VALUES
(N'Quản lý bán hàng', NULL, NULL, 'ShoppingCart', 1, N'Nhóm chức năng bán hàng'),
(N'Quản lý kho', NULL, NULL, 'Warehouse', 2, N'Nhóm chức năng kho'),
(N'Quản lý danh mục', NULL, NULL, 'Building2', 3, N'Nhóm quản lý danh mục'),
(N'Quản lý hệ thống', NULL, NULL, 'Settings', 4, N'Nhóm quản lý hệ thống');

-- Quyền con (child features) - Nhóm Bán hàng
INSERT INTO features (feature_name, parent_id, route_path, icon, display_order, description)
VALUES
(N'Tổng quan', NULL, '/admin/dashboard', 'BarChart3', 0, N'Dashboard tổng quan'),
(N'Bán hàng', 1, '/admin/sells', 'ShoppingCart', 11, N'Chức năng bán hàng'),
(N'Quản lý đơn hàng', 1, '/admin/orders', 'ShoppingCart', 12, N'Quản lý đơn hàng'),
(N'Hoá đơn bán hàng', 1, '/admin/invoices', 'FileDiff', 13, N'Quản lý hoá đơn'),
(N'Quản lý thanh toán', 1, '/admin/payments', 'DollarSign', 14, N'Quản lý thanh toán');

-- Quyền con - Nhóm Kho
INSERT INTO features (feature_name, parent_id, route_path, icon, display_order, description)
VALUES
(N'Quản lý tồn kho', 2, '/admin/inventorys', 'Warehouse', 21, N'Quản lý tồn kho'),
(N'Quản lý phiếu nhập', 2, '/admin/receipts', 'PackagePlus', 22, N'Quản lý phiếu nhập hàng');

-- Quyền con - Nhóm Danh mục
INSERT INTO features (feature_name, parent_id, route_path, icon, display_order, description)
VALUES
(N'Quản lý sản phẩm', 3, '/admin/products', 'Building2', 31, N'Quản lý sản phẩm'),
(N'Quản lý nhà cung cấp', 3, '/admin/suppliers', 'Building2', 32, N'Quản lý nhà cung cấp'),
(N'Quản lý khuyến mãi', 3, '/admin/promotions', 'Gift', 33, N'Quản lý khuyến mãi'),
(N'Khách hàng', 3, '/admin/customers', 'Users', 34, N'Quản lý khách hàng');

-- Quyền con - Nhóm Hệ thống
INSERT INTO features (feature_name, parent_id, route_path, icon, display_order, description)
VALUES
(N'Tài khoản', 4, '/admin/users', 'Users', 41, N'Quản lý tài khoản'),
(N'Quản lý quyền', 4, '/admin/permissions', 'Lock', 42, N'Quản lý phân quyền');

-------------------------------------------------
-- 18) PERMISSION TYPES (Loại quyền)
-------------------------------------------------
INSERT INTO permission_types (permission_name, permission_code, description)
VALUES
(N'Xem', 'VIEW', N'Quyền xem dữ liệu'),
(N'Thêm', 'CREATE', N'Quyền thêm mới'),
(N'Sửa', 'UPDATE', N'Quyền chỉnh sửa'),
(N'Xóa', 'DELETE', N'Quyền xóa/vô hiệu hóa'),
(N'Xuất Excel', 'EXPORT', N'Quyền xuất báo cáo Excel'),
(N'In', 'PRINT', N'Quyền in tài liệu');

-------------------------------------------------
-- 19) ROLE PERMISSIONS (Phân quyền chi tiết)
-------------------------------------------------
-- Admin (role_id = 1): Full quyền tất cả
INSERT INTO role_permissions (role_id, feature_id, permission_type_id, is_allowed)
SELECT 1, f.feature_id, pt.permission_type_id, 1
FROM features f
CROSS JOIN permission_types pt;

-- Nhân viên bán hàng (role_id = 2): 
-- Cấp quyền cho NHÓM "Quản lý bán hàng" → tự động có quyền tất cả con
INSERT INTO role_permissions (role_id, feature_id, permission_type_id, is_allowed)
VALUES
-- Tổng quan
(2, 5, 1, 1), -- Xem Dashboard
-- Nhóm Bán hàng (quyền cha) - Xem
(2, 1, 1, 1), -- Xem "Quản lý bán hàng" → bao gồm: Bán hàng, Đơn hàng, Hoá đơn, Thanh toán
-- Quyền chi tiết cho từng chức năng con
(2, 6, 1, 1), (2, 6, 2, 1), -- Bán hàng: Xem, Thêm
(2, 7, 1, 1), (2, 7, 2, 1), -- Đơn hàng: Xem, Thêm
(2, 8, 1, 1), (2, 8, 6, 1), -- Hoá đơn: Xem, In
(2, 9, 1, 1), -- Thanh toán: Xem
-- Khách hàng
(2, 14, 1, 1), (2, 14, 2, 1); -- Khách hàng: Xem, Thêm

-- Nhân viên kho (role_id = 3):
-- Cấp quyền cho NHÓM "Quản lý kho" → tự động có quyền tất cả con
INSERT INTO role_permissions (role_id, feature_id, permission_type_id, is_allowed)
VALUES
-- Tổng quan
(3, 5, 1, 1), -- Xem Dashboard
-- Nhóm Kho (quyền cha) - Xem, Thêm, Sửa
(3, 2, 1, 1), (3, 2, 2, 1), (3, 2, 3, 1), -- "Quản lý kho" → bao gồm: Tồn kho, Phiếu nhập
-- Quyền chi tiết
(3, 10, 1, 1), (3, 10, 3, 1), -- Tồn kho: Xem, Sửa
(3, 11, 1, 1), (3, 11, 2, 1), (3, 11, 3, 1), -- Phiếu nhập: Xem, Thêm, Sửa
-- Sản phẩm và Nhà cung cấp (chỉ xem)
(3, 12, 1, 1), -- Sản phẩm: Xem
(3, 13, 1, 1); -- Nhà cung cấp: Xem
GO

-------------------------------------------------
-- 19) CONFIG CUSTOMER POINT
-------------------------------------------------
INSERT INTO ConfigCustomerPoint (points_per_unit, money_per_unit, is_active)
VALUES
(100, 100, 1);

-------------------------------------------------
-- 20) CUSTOMER POINTS HISTORY
-------------------------------------------------
-- Lịch sử tích điểm và sử dụng điểm
INSERT INTO customer_points_history (customer_id, order_id, points_earned, points_used, points_balance, transaction_type, description, created_at)
VALUES
-- Khách hàng 2: Lê Thị B
(2, 1, 5, 0, 5, 'earn', N'Tích điểm từ đơn hàng #1 (49,500đ)', DATEADD(day, -10, GETDATE())),
(2, NULL, 145, 0, 150, 'adjust', N'Điều chỉnh điểm khởi tạo', DATEADD(day, -9, GETDATE())),

-- Khách hàng 3: Phạm Văn C  
(3, 2, 3, 0, 3, 'earn', N'Tích điểm từ đơn hàng #2 (30,000đ)', DATEADD(day, -8, GETDATE())),
(3, NULL, 497, 0, 500, 'adjust', N'Điều chỉnh điểm khởi tạo', DATEADD(day, -7, GETDATE())),

-- Khách hàng 2: Sử dụng điểm
(2, NULL, 0, 50, 100, 'redeem', N'Đổi voucher giảm giá 50,000đ', DATEADD(day, -3, GETDATE())),

-- Khách hàng 3: Hoàn điểm (giả định hủy đơn)
(3, NULL, 3, 0, 503, 'refund', N'Hoàn điểm do hủy đơn hàng', DATEADD(day, -1, GETDATE()));

-------------------------------------------------
-- 21) INVENTORY HISTORY
-------------------------------------------------
-- Lịch sử nhập hàng đầu kỳ
INSERT INTO inventory_history (product_id, old_quantity, new_quantity, difference, change_type, reason, note, employee_id, change_date)
VALUES
-- Nhập hàng đầu kỳ từ phiếu nhập
(1, 0, 100, 100, N'Nhập hàng', N'Nhập đầu kỳ', N'Nhập từ nhà cung cấp Coca-Cola Vietnam', 3, DATEADD(day, -40, GETDATE())),
(2, 0, 80, 80, N'Nhập hàng', N'Nhập đầu kỳ', N'Nhập từ nhà cung cấp Coca-Cola Vietnam', 3, DATEADD(day, -39, GETDATE())),
(3, 0, 60, 60, N'Nhập hàng', N'Nhập đầu kỳ', N'Nhập từ nhà cung cấp Kinh Đô Foods', 3, DATEADD(day, -38, GETDATE())),
(4, 0, 50, 50, N'Nhập hàng', N'Nhập đầu kỳ', N'Nhập từ nhà cung cấp Masan Consumer', 3, DATEADD(day, -37, GETDATE())),

-- Xuất hàng theo đơn
(1, 100, 98, -2, N'Xuất hàng', N'Bán lẻ', N'Xuất theo đơn hàng #1', 2, DATEADD(day, -10, GETDATE())),
(3, 60, 59, -1, N'Xuất hàng', N'Bán lẻ', N'Xuất theo đơn hàng #1', 2, DATEADD(day, -10, GETDATE())),
(4, 50, 49, -1, N'Xuất hàng', N'Bán lẻ', N'Xuất theo đơn hàng #2', 2, DATEADD(day, -9, GETDATE())),

-- Điều chỉnh tồn kho
(1, 98, 100, 2, N'Điều chỉnh', N'Kiểm kê', N'Phát hiện thêm 2 sản phẩm khi kiểm kê', 3, DATEADD(day, -5, GETDATE())),
(2, 80, 78, -2, N'Điều chỉnh', N'Hư hỏng', N'Sản phẩm hư hỏng do quá hạn', 3, DATEADD(day, -3, GETDATE()));

-------------------------------------------------
-- 21) ORDER CANCELLATION HISTORY
-------------------------------------------------
-- Giả sử có 1 đơn hàng bị hủy (chưa có trong orders hiện tại, chỉ mock để demo)
-- INSERT INTO order_cancellation_history (order_id, cancellation_reason, canceled_by_employee_id)
-- VALUES
-- (3, N'Khách hàng yêu cầu hủy do đổi ý', 1);

-------------------------------------------------
-- 22) PROFIT CONFIGURATION
-------------------------------------------------
INSERT INTO profit_configuration (default_profit_percentage, updated_by_employee_id)
VALUES
(15.00, 1);

-------------------------------------------------
-- 23) PROFIT RULES
-------------------------------------------------
INSERT INTO profit_rules (rule_type, product_id, profit_percentage, priority, status, employee_id)
VALUES
('by_product', 1, 20.00, 1, 'active', 1),
('by_product', 2, 25.00, 1, 'active', 1),
('by_product', 3, 30.00, 1, 'active', 1);
