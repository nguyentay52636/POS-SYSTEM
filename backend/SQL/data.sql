
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
-- 2️⃣ Users
-------------------------------------------------
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    [password] NVARCHAR(255) NOT NULL,
    full_name NVARCHAR(100),
    role_id INT NOT NULL DEFAULT 2, -- FK sẽ add sau
    created_at DATETIME DEFAULT GETDATE()
);
GO

-------------------------------------------------
-- 3️⃣ Customers
-------------------------------------------------
CREATE TABLE customers (
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20),
    email NVARCHAR(100),
    address NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-------------------------------------------------
-- 4️⃣ Categories
-------------------------------------------------
CREATE TABLE categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL
);
GO

-------------------------------------------------
-- 5️⃣ Suppliers
-------------------------------------------------
CREATE TABLE suppliers (
    supplier_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20),
    email NVARCHAR(100),
    address NVARCHAR(MAX)
);
GO

-------------------------------------------------
-- 6️⃣ Products
-------------------------------------------------
CREATE TABLE products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT,
    supplier_id INT,
    product_name NVARCHAR(100) NOT NULL,
    barcode NVARCHAR(50) UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    unit NVARCHAR(20) DEFAULT 'pcs',
    created_at DATETIME DEFAULT GETDATE()
);
GO

-------------------------------------------------
-- 7️⃣ Inventory
-------------------------------------------------
CREATE TABLE inventory (
    inventory_id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT DEFAULT 0,
    updated_at DATETIME DEFAULT GETDATE()
);
GO

-------------------------------------------------
-- 8️⃣ Promotions
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
-- 9️⃣ Promotion_Products
-------------------------------------------------
CREATE TABLE promotion_products (
    promotion_product_id INT IDENTITY(1,1) PRIMARY KEY,
    promotion_id INT NOT NULL,
    product_id INT NOT NULL
);
GO

-------------------------------------------------
-- 🔟 Orders
-------------------------------------------------
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT,
    user_id INT,
    promo_id INT,
    order_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending','paid','canceled')) DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0
);
GO

-------------------------------------------------
-- 1️⃣1️⃣ Order_Items
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
-- 1️⃣2️⃣ Payments
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
-- 1️⃣3️⃣ Import Receipts
-------------------------------------------------
CREATE TABLE import_receipts (
    import_id INT IDENTITY(1,1) PRIMARY KEY,
    supplier_id INT NOT NULL,
    user_id INT NOT NULL,
    import_date DATETIME DEFAULT GETDATE(),
    total_amount DECIMAL(10,2) DEFAULT 0,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending','completed','canceled')) DEFAULT 'pending',
    note NVARCHAR(255)
);
GO

-------------------------------------------------
-- 1️⃣4️⃣ Import Items
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

CREATE TABLE export_receipts (
    export_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
    user_id INT NOT NULL,
    export_date DATETIME DEFAULT GETDATE(),
    total_amount DECIMAL(10,2) DEFAULT 0,
    status NVARCHAR(20) NOT NULL CHECK (status IN ('pending','completed','canceled')) DEFAULT 'pending',
    note NVARCHAR(255)
);

CREATE TABLE export_items (
    export_item_id INT IDENTITY(1,1) PRIMARY KEY,
    export_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-------------------------------------------------
-- 1️⃣5️⃣ Features & PermissionTypes
-------------------------------------------------
CREATE TABLE Features (
    FeatureId INT IDENTITY(1,1) PRIMARY KEY,
    FeatureName NVARCHAR(255) NOT NULL
);
GO

CREATE TABLE PermissionTypes (
    PermissionTypeId INT IDENTITY(1,1) PRIMARY KEY,
    PermissionName NVARCHAR(100) NOT NULL
);
GO

-------------------------------------------------
-- 1️⃣6️⃣ RolePermissions
-------------------------------------------------
CREATE TABLE RolePermissions (
    RoleId INT NOT NULL,
    FeatureId INT NOT NULL,
    PermissionTypeId INT NOT NULL,
    IsAllowed BIT DEFAULT 0,
    CONSTRAINT FK_RolePermissions_Role FOREIGN KEY (RoleId) REFERENCES roles(role_id),
    CONSTRAINT FK_RolePermissions_Feature FOREIGN KEY (FeatureId) REFERENCES Features(FeatureId),
    CONSTRAINT FK_RolePermissions_PermissionType FOREIGN KEY (PermissionTypeId) REFERENCES PermissionTypes(PermissionTypeId),
    CONSTRAINT UQ_RolePermissions UNIQUE(RoleId, FeatureId, PermissionTypeId)
);
GO

-------------------------------------------------
-- 🔗 Thêm FK
-------------------------------------------------
ALTER TABLE users ADD FOREIGN KEY (role_id) REFERENCES roles(role_id);
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
-- 🔹 Index cơ bản
-------------------------------------------------
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_inventory_product_id ON inventory(product_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_promotions_code ON promotions(promo_code);
CREATE INDEX idx_users_username ON users(username);
GO

-------------------------------------------------
-- 🔹 Thêm dữ liệu PermissionTypes mẫu
-------------------------------------------------
INSERT INTO PermissionTypes (PermissionName)
VALUES ('View'), ('Create'), ('Update'), ('Delete');
GO
