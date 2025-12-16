# Database Schema Update - Complete Walkthrough

## ✅ Tổng quan thay đổi

Đã cập nhật [data.sql](file:///c:/Users/T480s/Desktop/POS-SYSTEM/backend/SQL/data.sql) với:
- ✅ Giữ nguyên cấu trúc tiếng Anh (tương thích API)
- ✅ Thêm bảng `employees` đơn giản
- ✅ Thêm trường `status` cho soft delete
- ✅ Thêm các bảng còn thiếu từ db01.sql

---

## 🆕 Các bảng đã thêm

### 1. Bảng `employees` (Nhân viên)
```sql
CREATE TABLE employees (
    employee_id INT IDENTITY(1,1) PRIMARY KEY,
    full_name NVARCHAR(100) NOT NULL,
    gender NVARCHAR(10),
    birth_date DATE,
    phone NVARCHAR(20),
    role_position NVARCHAR(50),
    status NVARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')) DEFAULT 'active'
);
```

### 2. Bảng `inventory_history` (Lịch sử kho)
```sql
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
    change_date DATETIME DEFAULT GETDATE()
);
```

### 3. Bảng `order_cancellation_history` (Lịch sử hủy đơn)
```sql
CREATE TABLE order_cancellation_history (
    cancellation_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    cancellation_reason NVARCHAR(MAX),
    canceled_by_employee_id INT NOT NULL,
    cancellation_date DATETIME DEFAULT GETDATE()
);
```

### 4. Bảng `profit_configuration` (Cấu hình lợi nhuận)
```sql
CREATE TABLE profit_configuration (
    config_id INT IDENTITY(1,1) PRIMARY KEY,
    default_profit_percentage DECIMAL(5,2) DEFAULT 10.00,
    updated_at DATETIME DEFAULT GETDATE(),
    updated_by_employee_id INT
);
```

### 5. Bảng `profit_rules` (Quy tắc lợi nhuận)
```sql
CREATE TABLE profit_rules (
    rule_id INT IDENTITY(1,1) PRIMARY KEY,
    rule_type NVARCHAR(50) NOT NULL DEFAULT 'by_product',
    product_id INT NOT NULL,
    profit_percentage DECIMAL(5,2) NOT NULL,
    priority INT DEFAULT 1,
    status NVARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    employee_id INT
);
```

### 6. Bảng `feature_permissions` (Chức năng chi tiết)
```sql
CREATE TABLE feature_permissions (
    permission_id INT IDENTITY(1,1) PRIMARY KEY,
    feature_name NVARCHAR(255) NOT NULL,
    parent_id INT NULL,
    route_path NVARCHAR(255),
    description NVARCHAR(255)
);
```

### 7. Bảng `permission_types_detail` (Loại quyền chi tiết)
```sql
CREATE TABLE permission_types_detail (
    permission_type_id INT IDENTITY(1,1) PRIMARY KEY,
    permission_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(255)
);
```

### 8. Bảng `role_permission_details` (Phân quyền chi tiết)
```sql
CREATE TABLE role_permission_details (
    detail_id INT IDENTITY(1,1) PRIMARY KEY,
    role_id INT NOT NULL,
    feature_permission_id INT NOT NULL,
    permission_type_detail_id INT NOT NULL,
    is_allowed BIT DEFAULT 0
);
```

---

## 🔄 Cập nhật bảng hiện tại

### `users` table
```diff
+ employee_id INT NOT NULL
+ status NVARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')) DEFAULT 'active'
```

### `customers` table
```diff
- IsDeleted BIT NOT NULL DEFAULT 0
+ status NVARCHAR(20) NOT NULL CHECK (status IN ('active','inactive')) DEFAULT 'active'
```

---

## 📊 Tổng số bảng: 28

1. roles
2. employees ✨ NEW
3. users (updated)
4. customers (updated)
5. categories
6. suppliers
7. products
8. inventory
9. promotions
10. promotion_products
11. orders
12. order_items
13. payments
14. import_receipts
15. import_items
16. export_receipts
17. export_items
18. inventory_history ✨ NEW
19. order_cancellation_history ✨ NEW
20. profit_configuration ✨ NEW
21. profit_rules ✨ NEW
22. ConfigCustomerPoint
23. Features
24. PermissionTypes
25. RolePermissions
26. feature_permissions ✨ NEW
27. permission_types_detail ✨ NEW
28. role_permission_details ✨ NEW

---

## 🎯 Nghiệp vụ đã đáp ứng

✅ **Soft Delete**: Dùng `status` thay vì xóa cứng  
✅ **Lịch sử**: Theo dõi thay đổi kho và hủy đơn  
✅ **Lợi nhuận**: Cấu hình và quy tắc linh hoạt  
✅ **Phân quyền**: Hệ thống phân quyền chi tiết  
✅ **Tương thích API**: Giữ nguyên tên tiếng Anh
