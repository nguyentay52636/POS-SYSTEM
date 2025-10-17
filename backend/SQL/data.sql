-------------------------------------------------
-- XÓA BẢNG CŨ NẾU TỒN TẠI (đúng thứ tự FK)
-------------------------------------------------
IF DB_ID('system_pos') IS NOT NULL
BEGIN
    USE master;
    DROP DATABASE system_pos;
END;
GO

CREATE DATABASE system_pos;
GO

USE system_pos;
GO

IF OBJECT_ID('order_items', 'U') IS NOT NULL DROP TABLE order_items;
IF OBJECT_ID('payments', 'U') IS NOT NULL DROP TABLE payments;
IF OBJECT_ID('inventory', 'U') IS NOT NULL DROP TABLE inventory;
IF OBJECT_ID('promotion_products', 'U') IS NOT NULL DROP TABLE promotion_products;
IF OBJECT_ID('orders', 'U') IS NOT NULL DROP TABLE orders;
IF OBJECT_ID('products', 'U') IS NOT NULL DROP TABLE products;
IF OBJECT_ID('promotions', 'U') IS NOT NULL DROP TABLE promotions;
IF OBJECT_ID('categories', 'U') IS NOT NULL DROP TABLE categories;
IF OBJECT_ID('suppliers', 'U') IS NOT NULL DROP TABLE suppliers;
IF OBJECT_ID('customers', 'U') IS NOT NULL DROP TABLE customers;
IF OBJECT_ID('users', 'U') IS NOT NULL DROP TABLE users;
GO

-------------------------------------------------
-- 1️⃣ Categories
-------------------------------------------------
CREATE TABLE categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL
);
GO

-------------------------------------------------
-- 2️⃣ Customers
-------------------------------------------------
CREATE TABLE customers (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20) NULL,
    email NVARCHAR(100) NULL,
    address NVARCHAR(MAX) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
GO

-------------------------------------------------
-- 3️⃣ Suppliers
-------------------------------------------------
CREATE TABLE suppliers (
    supplier_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20) NULL,
    email NVARCHAR(100) NULL,
    address NVARCHAR(MAX) NULL
);
GO

-------------------------------------------------
-- 4️⃣ Users (role = INT: 1=admin, 2=staff)
-------------------------------------------------
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL,
    [password] NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NULL,
    role INT NOT NULL CONSTRAINT DF_users_role DEFAULT (2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UQ_users_username UNIQUE (username)
);
GO

-------------------------------------------------
-- 5️⃣ Promotions
-------------------------------------------------
CREATE TABLE promotions (
    promo_id INT IDENTITY(1,1) PRIMARY KEY,
    promo_code NVARCHAR(50) NOT NULL,
    description NVARCHAR(255) NULL,
    discount_type NVARCHAR(20) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    usage_limit INT DEFAULT 0,
    used_count INT DEFAULT 0,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    CONSTRAINT UQ_promotions_promo_code UNIQUE (promo_code)
);
GO

-------------------------------------------------
-- 6️⃣ Products
-------------------------------------------------
CREATE TABLE products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT NULL,
    supplier_id INT NULL,
    product_name NVARCHAR(100) NOT NULL,
    barcode NVARCHAR(50) NULL,
    price DECIMAL(10,2) NOT NULL,
    unit NVARCHAR(20) DEFAULT 'pcs',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_products_categories FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT FK_products_suppliers FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id),
    CONSTRAINT UQ_products_barcode UNIQUE (barcode)
);
GO

-------------------------------------------------
-- 7️⃣ Inventory
-------------------------------------------------
CREATE TABLE inventory (
    inventory_id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_inventory_products FOREIGN KEY (product_id) REFERENCES products(product_id)
);
GO

-------------------------------------------------
-- 8️⃣ Promotion_Products
-------------------------------------------------
CREATE TABLE promotion_products (
    promotion_product_id INT IDENTITY(1,1) PRIMARY KEY,
    promo_id INT NOT NULL,
    product_id INT NOT NULL,
    CONSTRAINT FK_promotion_products_promotions FOREIGN KEY (promo_id) REFERENCES promotions(promo_id),
    CONSTRAINT FK_promotion_products_products FOREIGN KEY (product_id) REFERENCES products(product_id)
);
GO

-------------------------------------------------
-- 9️⃣ Orders
-------------------------------------------------
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NULL,
    user_id INT NULL,
    promo_id INT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'canceled')) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    CONSTRAINT FK_orders_customers FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    CONSTRAINT FK_orders_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_orders_promotions FOREIGN KEY (promo_id) REFERENCES promotions(promo_id)
);
GO

-------------------------------------------------
-- 🔟 Order_Items
-------------------------------------------------
CREATE TABLE order_items (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_order_items_orders FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT FK_order_items_products FOREIGN KEY (product_id) REFERENCES products(product_id)
);
GO

-------------------------------------------------
-- 1️⃣1️⃣ Payments
-------------------------------------------------
CREATE TABLE payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method NVARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'e-wallet')) DEFAULT 'cash',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_payments_orders FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
GO

-------------------------------------------------
-- TẠO CHỈ MỤC (INDEX) ĐỂ CẢI THIỆN HIỆU SUẤT
-------------------------------------------------
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_promotions_promo_code ON promotions(promo_code);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
GO