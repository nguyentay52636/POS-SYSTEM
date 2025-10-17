USE system_pos;
GO

-- 1️⃣ Insert data into categories
INSERT INTO categories (category_name) VALUES
(N'Electronics'),
(N'Clothing'),
(N'Food & Beverage'),
(N'Home Appliances'),
(N'Books');
GO

-- 2️⃣ Insert data into customers
INSERT INTO customers (name, phone, email, address) VALUES
(N'Nguyen Van A', '0901234567', 'nguyenvana@gmail.com', N'123 Le Loi, District 1, HCMC'),
(N'Tran Thi B', '0912345678', 'tranthib@gmail.com', N'456 Nguyen Hue, District 3, HCMC'),
(N'Le Van C', '0923456789', 'levanc@gmail.com', N'789 Tran Hung Dao, District 5, HCMC'),
(N'Pham Thi D', '0934567890', 'phamthid@gmail.com', N'101 Vo Van Tan, District 3, HCMC'),
(N'Hoang Van E', '0945678901', 'hoangvane@gmail.com', N'202 Ly Tu Trong, District 1, HCMC');
GO

-- 3️⃣ Insert data into suppliers
INSERT INTO suppliers (name, phone, email, address) VALUES
(N'Samsung Vietnam', '0281234567', 'contact@samsung.vn', N'123 Dien Bien Phu, HCMC'),
(N'Vinamilk', '0282345678', 'info@vinamilk.com.vn', N'456 Nguyen Thi Minh Khai, HCMC'),
(N'Nike Vietnam', '0283456789', 'support@nike.vn', N'789 Le Van Sy, HCMC'),
(N'LG Electronics', '0284567890', 'lg.support@lge.com', N'101 Nguyen Van Troi, HCMC'),
(N'Sony Vietnam', '0285678901', 'sony.vn@sony.com', N'202 Vo Thi Sau, HCMC');
GO

-- 4️⃣ Insert data into users
INSERT INTO users (username, [password], full_name, role) VALUES
('admin1', 'hashed_password_1', N'Nguyen Admin', 1),
('staff1', 'hashed_password_2', N'Tran Staff', 2),
('staff2', 'hashed_password_3', N'Le Staff', 2),
('admin2', 'hashed_password_4', N'Pham Admin', 1),
('staff3', 'hashed_password_5', N'Hoang Staff', 2);
GO

-- 5️⃣ Insert data into promotions
INSERT INTO promotions (promo_code, description, discount_type, discount_value, start_date, end_date, min_order_amount, usage_limit, used_count, status) VALUES
('SALE2023', N'Year-end sale 10%', 'percent', 10.00, '2023-12-01', '2023-12-31', 100.00, 100, 50, 'active'),
('FIXED500', N'Fixed discount 500k', 'fixed', 500.00, '2023-11-01', '2023-11-30', 1000.00, 50, 20, 'active'),
('SUMMER20', N'Summer sale 20%', 'percent', 20.00, '2023-06-01', '2023-08-31', 200.00, 200, 150, 'inactive'),
('NEWUSER', N'New user discount', 'fixed', 100.00, '2023-01-01', '2023-12-31', 0.00, 1000, 800, 'active'),
('BLACKFRIDAY', N'Black Friday 15%', 'percent', 15.00, '2023-11-25', '2023-11-30', 300.00, 300, 250, 'inactive');
GO

-- 6️⃣ Insert data into products
INSERT INTO products (category_id, supplier_id, product_name, barcode, price, unit) VALUES
(1, 1, N'Samsung Galaxy S23', '8936061234567', 2000.00, 'pcs'),
(2, 3, N'Nike T-Shirt', '8936061234568', 50.00, 'pcs'),
(3, 2, N'Vinamilk Yogurt', '8936061234569', 5.00, 'pcs'),
(4, 4, N'LG Refrigerator', '8936061234570', 1500.00, 'pcs'),
(5, NULL, N'Introduction to SQL', '8936061234571', 20.00, 'pcs');
GO

-- 7️⃣ Insert data into inventory
INSERT INTO inventory (product_id, quantity) VALUES
(1, 50),
(2, 100),
(3, 200),
(4, 10),
(5, 75);
GO

-- 8️⃣ Insert data into promotion_products
INSERT INTO promotion_products (promo_id, product_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);
GO

-- 9️⃣ Insert data into orders
INSERT INTO orders (customer_id, user_id, promo_id, order_date, status, total_amount, discount_amount) VALUES
(1, 1, 1, '2023-12-01 10:00:00', 'paid', 2000.00, 200.00),
(2, 2, NULL, '2023-12-02 12:00:00', 'pending', 100.00, 0.00),
(3, 3, 2, '2023-12-03 14:00:00', 'canceled', 1500.00, 500.00),
(4, 4, 3, '2023-12-04 16:00:00', 'paid', 300.00, 60.00),
(5, 5, NULL, '2023-12-05 18:00:00', 'pending', 50.00, 0.00);
GO

-- 🔟 Insert data into order_items
INSERT INTO order_items (order_id, product_id, quantity, price, discount, subtotal) VALUES
(1, 1, 1, 2000.00, 200.00, 1800.00),
(2, 2, 2, 50.00, 0.00, 100.00),
(3, 3, 100, 5.00, 0.00, 500.00),
(4, 4, 1, 1500.00, 0.00, 1500.00),
(5, 5, 2, 20.00, 0.00, 40.00);
GO

-- 1️⃣1️⃣ Insert data into payments
INSERT INTO payments (order_id, amount, payment_method, payment_date) VALUES
(1, 1800.00, 'card', '2023-12-01 10:30:00'),
(2, 100.00, 'cash', '2023-12-02 12:30:00'),
(3, 1500.00, 'bank_transfer', '2023-12-03 14:30:00'),
(4, 1440.00, 'e-wallet', '2023-12-04 16:30:00'),
(5, 50.00, 'cash', '2023-12-05 18:30:00');
GO