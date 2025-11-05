CREATE TABLE [users] (
  [user_id] INT IDENTITY(1,1) PRIMARY KEY,
  [username] VARCHAR(50) UNIQUE NOT NULL,
  [password] VARCHAR(255) NOT NULL,
  [full_name] VARCHAR(100),
  [role] nvarchar(255) NOT NULL CHECK ([role] IN ('admin', 'staff')) DEFAULT 'staff',
  [created_at] DATETIME DEFAULT (GETDATE())
)
GO

CREATE TABLE [customers] (
  [customer_id] INT IDENTITY(1,1) PRIMARY KEY,
  [name] VARCHAR(100) NOT NULL,
  [phone] VARCHAR(20),
  [email] VARCHAR(100),
  [address] TEXT,
  [created_at] DATETIME DEFAULT (GETDATE())
)
GO

CREATE TABLE [categories] (
  [category_id] INT IDENTITY(1,1) PRIMARY KEY,
  [category_name] VARCHAR(100) NOT NULL
)
GO

CREATE TABLE [promotion_products] (
  [promotion_product_id] INT IDENTITY(1,1) PRIMARY KEY,
  [promotion_id] INT,
  [product_id] INT
)
GO

CREATE TABLE [roles] (
  [role_id] INT IDENTITY(1,1) PRIMARY KEY,
  [description] varchar(100)
)
GO

CREATE TABLE [suppliers] (
  [supplier_id] INT IDENTITY(1,1) PRIMARY KEY,
  [name] VARCHAR(100) NOT NULL,
  [phone] VARCHAR(20),
  [email] VARCHAR(100),
  [address] TEXT
)
GO

CREATE TABLE [products] (
  [product_id] INT IDENTITY(1,1) PRIMARY KEY,
  [category_id] INT,
  [supplier_id] INT,
  [product_name] VARCHAR(100) NOT NULL,
  [barcode] VARCHAR(50) UNIQUE,
  [price] DECIMAL(10,2) NOT NULL,
  [unit] VARCHAR(20) DEFAULT 'pcs',
  [created_at] DATETIME DEFAULT (GETDATE())
)
GO

CREATE TABLE [inventory] (
  [inventory_id] INT IDENTITY(1,1) PRIMARY KEY,
  [product_id] INT NOT NULL,
  [quantity] INT DEFAULT (0),
  [updated_at] DATETIME DEFAULT (GETDATE())
)
GO

CREATE TABLE [promotions] (
  [promo_id] INT IDENTITY(1,1) PRIMARY KEY,
  [promo_code] VARCHAR(50) UNIQUE NOT NULL,
  [description] VARCHAR(255),
  [discount_type] nvarchar(255) NOT NULL CHECK ([discount_type] IN ('percent', 'fixed')) NOT NULL,
  [discount_value] DECIMAL(10,2) NOT NULL,
  [start_date] DATE NOT NULL,
  [end_date] DATE NOT NULL,
  [min_order_amount] DECIMAL(10,2) DEFAULT (0),
  [usage_limit] INT DEFAULT (0),
  [used_count] INT DEFAULT (0),
  [status] nvarchar(255) NOT NULL CHECK ([status] IN ('active', 'inactive')) DEFAULT 'active'
)
GO

CREATE TABLE [orders] (
  [order_id] INT IDENTITY(1,1) PRIMARY KEY,
  [customer_id] INT,
  [user_id] INT,
  [promo_id] INT,
  [order_date] DATETIME DEFAULT (GETDATE()),
  [status] nvarchar(255) NOT NULL CHECK ([status] IN ('pending', 'paid', 'canceled')) DEFAULT 'pending',
  [total_amount] DECIMAL(10,2),
  [discount_amount] DECIMAL(10,2) DEFAULT (0)
)
GO

CREATE TABLE [order_items] (
  [order_item_id] INT IDENTITY(1,1) PRIMARY KEY,
  [order_id] INT,
  [product_id] INT,
  [quantity] INT NOT NULL,
  [price] DECIMAL(10,2) NOT NULL,
  [subtotal] DECIMAL(10,2) NOT NULL
)
GO

CREATE TABLE [payments] (
  [payment_id] INT IDENTITY(1,1) PRIMARY KEY,
  [order_id] INT NOT NULL,
  [amount] DECIMAL(10,2) NOT NULL,
  [payment_method] nvarchar(255) NOT NULL CHECK ([payment_method] IN ('cash', 'card', 'bank_transfer', 'e-wallet')) DEFAULT 'cash',
  [payment_date] DATETIME DEFAULT (GETDATE())
)
GO

CREATE TABLE [import_receipts] (
  [import_id] INT IDENTITY(1,1) PRIMARY KEY,
  [supplier_id] INT NOT NULL,
  [user_id] INT NOT NULL,
  [import_date] DATETIME DEFAULT (GETDATE()),
  [total_amount] DECIMAL(10,2) DEFAULT (0),
  [status] nvarchar(255) NOT NULL CHECK ([status] IN ('pending', 'completed', 'canceled')) DEFAULT 'pending',
  [note] VARCHAR(255)
)
GO

CREATE TABLE [import_items] (
  [import_item_id] INT IDENTITY(1,1) PRIMARY KEY,
  [import_id] INT NOT NULL,
  [product_id] INT NOT NULL,
  [quantity] INT NOT NULL,
  [unit_price] DECIMAL(10,2) NOT NULL,
  [subtotal] DECIMAL(10,2) NOT NULL
)
GO

ALTER TABLE [products] ADD FOREIGN KEY ([category_id]) REFERENCES [categories] ([category_id])
GO

ALTER TABLE [products] ADD FOREIGN KEY ([supplier_id]) REFERENCES [suppliers] ([supplier_id])
GO

ALTER TABLE [inventory] ADD FOREIGN KEY ([product_id]) REFERENCES [products] ([product_id])
GO

ALTER TABLE [promotion_products] ADD FOREIGN KEY ([product_id]) REFERENCES [products] ([product_id])
GO

ALTER TABLE [orders] ADD FOREIGN KEY ([customer_id]) REFERENCES [customers] ([customer_id])
GO

ALTER TABLE [orders] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [orders] ADD FOREIGN KEY ([promo_id]) REFERENCES [promotions] ([promo_id])
GO

ALTER TABLE [order_items] ADD FOREIGN KEY ([order_id]) REFERENCES [orders] ([order_id])
GO

ALTER TABLE [order_items] ADD FOREIGN KEY ([product_id]) REFERENCES [products] ([product_id])
GO

ALTER TABLE [payments] ADD FOREIGN KEY ([order_id]) REFERENCES [orders] ([order_id])
GO

ALTER TABLE [import_receipts] ADD FOREIGN KEY ([supplier_id]) REFERENCES [suppliers] ([supplier_id])
GO

ALTER TABLE [import_receipts] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([user_id])
GO

ALTER TABLE [import_items] ADD FOREIGN KEY ([import_id]) REFERENCES [import_receipts] ([import_id])
GO

ALTER TABLE [import_items] ADD FOREIGN KEY ([product_id]) REFERENCES [products] ([product_id])
GO
