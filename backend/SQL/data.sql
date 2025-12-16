
USE bachhoaxanh
GO

-------------------------------------------------
-- 1️⃣ Roles
-------------------------------------------------
CREATE TABLE roles (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    description NVARCHAR(100)
);
GO

-------------------------------------------------
-- 2️⃣ Employees
-------------------------------------------------
CREATE TABLE employees (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    gender NVARCHAR(10),
    birth_date DATE,
    phone NVARCHAR(20),
    role_position NVARCHAR(50),
    status NVARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')) DEFAULT 'active'
);
GO

-------------------------------------------------
-- 3️⃣ Users
-------------------------------------------------
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    [password] NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100),
    employee_id INT NOT NULL,
    role_id INT NOT NULL DEFAULT 2,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')) DEFAULT 'active',
    created_at DATETIME DEFAULT GETDATE()
);
GO

-------------------------------------------------
-- 4️⃣ Customers
-------------------------------------------------
CREATE TABLE customers (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20),
    email NVARCHAR(100),
    address NVARCHAR(MAX),
    customer_point DECIMAL(10,2) DEFAULT 0,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')) DEFAULT 'active',
    created_at DATETIME DEFAULT GETDATE()
);
GO


-------------------------------------------------
-- 5️⃣ Categories
-------------------------------------------------
CREATE TABLE categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL
);
GO

-------------------------------------------------
-- 6️⃣ Suppliers
-------------------------------------------------
CREATE TABLE suppliers (
    supplier_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20),
    email NVARCHAR(100),
    address NVARCHAR(MAX),
    status NVARCHAR(20) DEFAULT 'active'
);
GO

-------------------------------------------------
-- 7️⃣ Products
-------------------------------------------------
CREATE TABLE products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT,
    supplier_id INT,
    product_name NVARCHAR(100) NOT NULL,
    barcode NVARCHAR(50) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    unit NVARCHAR(20) DEFAULT 'pcs',
    image_url NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')) DEFAULT 'active'
);
GO

-------------------------------------------------
-- 8️⃣ Inventory
-------------------------------------------------
CREATE TABLE inventory (
    inventory_id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT DEFAULT 0,
    updated_at DATETIME DEFAULT GETDATE()
);
GO

-------------------------------------------------
-- 9️⃣ Promotions
-------------------------------------------------
CREATE TABLE promotions (
    promo_id INT IDENTITY(1,1) PRIMARY KEY,
    promo_code NVARCHAR(50) UNIQUE NOT NULL,
    description NVARCHAR(255),
    discount_type NVARCHAR(20) NOT NULL CHECK (discount_type IN ('percent','fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    usage_limit INT DEFAULT 0,
    used_count INT DEFAULT 0,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')) DEFAULT 'active'
);
GO

-------------------------------------------------
-- 🔟 Promotion_Products
-------------------------------------------------
CREATE TABLE promotion_products (
    promotion_product_id INT IDENTITY(1,1) PRIMARY KEY,
    promotion_id INT NOT NULL,
    product_id INT NOT NULL
);
GO

-------------------------------------------------
-- 1️⃣1️⃣ Orders
-------------------------------------------------
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    user_id INT NOT NULL,
    promo_id INT,
    order_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending','paid','canceled')) DEFAULT 'pending',
    total_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0
);
GO

-------------------------------------------------
-- 1️⃣2️⃣ Order Items
-------------------------------------------------
CREATE TABLE order_items (
    order_item_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);
GO

-------------------------------------------------
-- 1️⃣3️⃣ Payments
-------------------------------------------------
CREATE TABLE payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method NVARCHAR(20) NOT NULL CHECK (payment_method IN ('cash','card','bank_transfer','e-wallet')) DEFAULT 'cash',
    payment_date DATETIME DEFAULT GETDATE()
);
GO

-------------------------------------------------
-- 1️⃣4️⃣ Import Receipts
-------------------------------------------------
CREATE TABLE import_receipts (
    import_id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id INT NOT NULL,
    user_id INT NOT NULL,
    import_date DATETIME DEFAULT GETDATE(),
    total_amount DECIMAL(10,2) DEFAULT 0,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending','completed','canceled')) DEFAULT 'pending',
    cancellation_reason NVARCHAR(MAX) NULL,
    note NVARCHAR(255)
);
GO

-------------------------------------------------
-- 1️⃣5️⃣ Import Items
-------------------------------------------------
CREATE TABLE import_items (
    import_item_id INT IDENTITY(1,1) PRIMARY KEY,
    import_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);
GO

-------------------------------------------------
-- 1️⃣6️⃣ Export Receipts
-------------------------------------------------
CREATE TABLE export_receipts (
    export_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    user_id INT NOT NULL,
    export_date DATETIME DEFAULT GETDATE(),
    total_amount DECIMAL(10,2) DEFAULT 0,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending','completed','canceled')) DEFAULT 'pending',
    note NVARCHAR(255)
);
GO

-------------------------------------------------
-- 1️⃣7️⃣ Export Items
-------------------------------------------------
CREATE TABLE export_items (
    export_item_id INT IDENTITY(1,1) PRIMARY KEY,
    export_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);
GO

-------------------------------------------------
-- 1️⃣8️⃣ Customer Points History
-------------------------------------------------
CREATE TABLE customer_points_history (
    history_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    order_id INT NULL,
    points_earned INT DEFAULT 0,
    points_used INT DEFAULT 0,
    points_balance INT NOT NULL,
    transaction_type NVARCHAR(50) NOT NULL CHECK (transaction_type IN ('earn','redeem','adjust','refund')),
    description NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
GO

-------------------------------------------------
-- 1️⃣9️⃣ Inventory History
-------------------------------------------------
CREATE TABLE inventory_history (
    history_id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    old_quantity INT,
    new_quantity INT,
    difference INT,
    change_type NVARCHAR(50),
    reason NVARCHAR(255),
    note NVARCHAR(255),
    employee_id INT,
    change_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
GO

-------------------------------------------------
-- 2️⃣0️⃣ Order Cancellation History
-------------------------------------------------
CREATE TABLE order_cancellation_history (
    cancellation_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    cancellation_reason NVARCHAR(MAX),
    canceled_by_employee_id INT NOT NULL,
    cancellation_date DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (canceled_by_employee_id) REFERENCES employees(employee_id)
);
GO

-------------------------------------------------
-- 2️⃣1️⃣ Profit Configuration
-------------------------------------------------
CREATE TABLE profit_configuration (
    config_id INT IDENTITY(1,1) PRIMARY KEY,
    default_profit_percentage DECIMAL(5,2) DEFAULT 10.00,
    updated_at DATETIME DEFAULT GETDATE(),
    updated_by_employee_id INT,
    FOREIGN KEY (updated_by_employee_id) REFERENCES employees(employee_id)
);
GO

-------------------------------------------------
-- 2️⃣2️⃣ Profit Rules
-------------------------------------------------
CREATE TABLE profit_rules (
    rule_id INT IDENTITY(1,1) PRIMARY KEY,
    rule_type NVARCHAR(50) NOT NULL DEFAULT 'by_product',
    product_id INT NOT NULL,
    profit_percentage DECIMAL(5,2) NOT NULL,
    priority INT DEFAULT 1,
    status NVARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    employee_id INT,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
GO

-------------------------------------------------
-- 2️⃣3️⃣ Config Customer Point
-------------------------------------------------
CREATE TABLE ConfigCustomerPoint (
    config_id INT IDENTITY(1,1) PRIMARY KEY,
    points_per_unit DECIMAL(10,2) NOT NULL,
    money_per_unit DECIMAL(10,2) NOT NULL,
    is_active BIT DEFAULT 1,
    updated_at DATETIME DEFAULT GETDATE()
);
GO

-------------------------------------------------
-- 2️⃣3️⃣ Features (Chức năng - hỗ trợ phân cấp cha-con)
-------------------------------------------------
CREATE TABLE features (
    feature_id INT IDENTITY(1,1) PRIMARY KEY,
    feature_name NVARCHAR(255) NOT NULL,
    parent_id INT NULL,
    route_path NVARCHAR(255),
    icon NVARCHAR(50),
    display_order INT DEFAULT 0,
    description NVARCHAR(255),
    FOREIGN KEY (parent_id) REFERENCES features(feature_id)
);
GO

-------------------------------------------------
-- 2️⃣4️⃣ Permission Types (Loại quyền)
-------------------------------------------------
CREATE TABLE permission_types (
    permission_type_id INT IDENTITY(1,1) PRIMARY KEY,
    permission_name NVARCHAR(100) NOT NULL,
    permission_code NVARCHAR(50) NOT NULL,
    description NVARCHAR(255)
);
GO

-------------------------------------------------
-- 2️⃣5️⃣ Role Permissions (Phân quyền chi tiết)
-------------------------------------------------
CREATE TABLE role_permissions (
    role_permission_id INT IDENTITY(1,1) PRIMARY KEY,
    role_id INT NOT NULL,
    feature_id INT NOT NULL,
    permission_type_id INT NOT NULL,
    is_allowed BIT DEFAULT 0,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (feature_id) REFERENCES features(feature_id),
    FOREIGN KEY (permission_type_id) REFERENCES permission_types(permission_type_id),
    CONSTRAINT UQ_RolePermissions UNIQUE(role_id, feature_id, permission_type_id)
);
GO

-------------------------------------------------
-- 🔗 Foreign Keys
-------------------------------------------------
ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles(role_id);
ALTER TABLE users ADD FOREIGN KEY (employee_id) REFERENCES employees(employee_id);
ALTER TABLE products ADD FOREIGN KEY (category_id) REFERENCES categories(category_id);
ALTER TABLE products ADD FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id);
ALTER TABLE inventory ADD FOREIGN KEY (product_id) REFERENCES products(product_id);
ALTER TABLE promotion_products ADD FOREIGN KEY (promotion_id) REFERENCES promotions(promo_id);
ALTER TABLE promotion_products ADD FOREIGN KEY (product_id) REFERENCES products(product_id);
ALTER TABLE orders ADD FOREIGN KEY (customer_id) REFERENCES customers(customer_id);
ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE orders ADD FOREIGN KEY (promo_id) REFERENCES promotions(promo_id);
ALTER TABLE order_items ADD FOREIGN KEY (order_id) REFERENCES orders(order_id);
ALTER TABLE order_items ADD FOREIGN KEY (product_id) REFERENCES products(product_id);
ALTER TABLE payments ADD FOREIGN KEY (order_id) REFERENCES orders(order_id);
ALTER TABLE import_receipts ADD FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id);
ALTER TABLE import_receipts ADD FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE import_items ADD FOREIGN KEY (import_id) REFERENCES import_receipts(import_id);
ALTER TABLE import_items ADD FOREIGN KEY (product_id) REFERENCES products(product_id);
ALTER TABLE export_receipts ADD FOREIGN KEY (customer_id) REFERENCES customers(customer_id);
ALTER TABLE export_receipts ADD FOREIGN KEY (user_id) REFERENCES users(user_id);
ALTER TABLE export_items ADD FOREIGN KEY (export_id) REFERENCES export_receipts(export_id);
ALTER TABLE export_items ADD FOREIGN KEY (product_id) REFERENCES products(product_id);
GO

-------------------------------------------------
-- 🔹 Indexes
-------------------------------------------------
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_promotions_code ON promotions(promo_code);
CREATE INDEX idx_users_username ON users(username);
GO

-------------------------------------------------
-- 🔹 Sample Permission Types
-------------------------------------------------
INSERT INTO permission_types (permission_name, permission_code, description)
VALUES 
('View', 'VIEW', 'Permission to view data'),
('Create', 'CREATE', 'Permission to create new records'),
('Update', 'UPDATE', 'Permission to update existing records'),
('Delete', 'DELETE', 'Permission to delete/deactivate records');
GO
