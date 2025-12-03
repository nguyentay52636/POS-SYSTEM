-------------------------------------------------
-- 1) ROLES
-------------------------------------------------
INSERT INTO roles (description)
VALUES 
(N'Quản trị viên'),
(N'Nhân viên bán hàng'),
(N'Nhân viên kho');

-------------------------------------------------
-- 2) USERS
-------------------------------------------------
INSERT INTO users (username, [password], full_name, role_id)
VALUES
('admin', '123456', N'Wes Admin', 1),
('seller01', '123456', N'Trần Văn Bán', 2),
('warehouse01', '123456', N'Nguyễn Kho Hàng', 3);

-------------------------------------------------
-- 3) CUSTOMERS
-------------------------------------------------
INSERT INTO customers (name, phone, email, address, customer_point)
VALUES
(N'Nguyễn Văn A', '0901111111', 'a@gmail.com', N'Quận 1', 0),
(N'Lê Thị B', '0902222222', 'b@gmail.com', N'Quận 10', 150),
(N'Phạm Văn C', '0903333333', 'c@gmail.com', N'Bình Thạnh', 500);


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
INSERT INTO suppliers (name, phone, email, address)
VALUES
(N'Công ty Nước Giải Khát ABC', '0904000001', 'abc@drink.com', N'Quận 7'),
(N'Nhà Cung Cấp Bánh Kẹo XYZ', '0904000002', 'xyz@candy.com', N'Quận 8');

-------------------------------------------------
-- 6) PRODUCTS
-------------------------------------------------
INSERT INTO products (category_id, supplier_id, product_name, barcode, price, unit)
VALUES
(1, 1, N'Coca Cola lon', 'SP1001', 10000, 'lon'),
(1, 1, N'Trà xanh O', 'SP1002', 12000, 'chai'),
(2, 2, N'Bánh Oreo', 'SP2001', 15000, 'gói'),
(3, 2, N'Nước mắm Nam Ngư', 'SP3001', 30000, 'chai');

-------------------------------------------------
-- 7) INVENTORY
-------------------------------------------------
INSERT INTO inventory (product_id, quantity)
VALUES
(1, 100),
(2, 80),
(3, 60),
(4, 50);

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
INSERT INTO import_receipts (supplier_id, user_id, total_amount, status, note)
VALUES
(1, 3, 300000, 'completed', N'Nhập Coca & Trà xanh'),
(2, 3, 200000, 'completed', N'Nhập Oreo');

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
-- 17) FEATURES
-------------------------------------------------
INSERT INTO Features (FeatureName)
VALUES
(N'Quản lý người dùng'),
(N'Quản lý sản phẩm'),
(N'Quản lý đơn hàng'),
(N'Quản lý tồn kho'),
(N'Quản lý nhập hàng'),
(N'Quản lý khuyến mãi'),
(N'Quản lý quyền');

-------------------------------------------------
-- 18) ROLE PERMISSIONS (gán mẫu)
-------------------------------------------------
-- Admin: full quyền
INSERT INTO RolePermissions (RoleId, FeatureId, PermissionTypeId, IsAllowed)
SELECT 1, f.FeatureId, p.PermissionTypeId, 1
FROM Features f CROSS JOIN PermissionTypes p;

-- Nhân viên bán hàng: xem + tạo order
INSERT INTO RolePermissions (RoleId, FeatureId, PermissionTypeId, IsAllowed)
VALUES
(2, 3, 1, 1), -- View Orders
(2, 3, 2, 1); -- Create Orders

-- Nhân viên kho: xem/tạo nhập hàng
INSERT INTO RolePermissions (RoleId, FeatureId, PermissionTypeId, IsAllowed)
VALUES
(3, 5, 1, 1),
(3, 5, 2, 1);

-------------------------------------------------
-- 19) CONFIG CUSTOMER POINT
-------------------------------------------------
INSERT INTO ConfigCustomerPoint (points_per_unit, money_per_unit, is_active)
VALUES
(100, 100, 1);
