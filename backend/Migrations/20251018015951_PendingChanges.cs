using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class PendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categories",
                columns: table => new
                {
                    category_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    category_name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__categori__D54EE9B45E9FE0CC", x => x.category_id);
                });

            migrationBuilder.CreateTable(
                name: "customers",
                columns: table => new
                {
                    customer_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    address = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    phone = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__customer__CD65CB8576509442", x => x.customer_id);
                });

            migrationBuilder.CreateTable(
                name: "inventory",
                columns: table => new
                {
                    inventory_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__inventor__B59ACC49366891C1", x => x.inventory_id);
                });

            migrationBuilder.CreateTable(
                name: "order_items",
                columns: table => new
                {
                    order_item_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    order_id = table.Column<int>(type: "int", nullable: false),
                    price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false),
                    subtotal = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__order_it__3764B6BCF697D547", x => x.order_item_id);
                });

            migrationBuilder.CreateTable(
                name: "orders",
                columns: table => new
                {
                    order_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    customer_id = table.Column<int>(type: "int", nullable: true),
                    discount_amount = table.Column<decimal>(type: "decimal(10,2)", nullable: true, defaultValue: 0m),
                    order_date = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    promo_id = table.Column<int>(type: "int", nullable: true),
                    status = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true, defaultValue: "pending"),
                    total_amount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    user_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__orders__465962290AC4A363", x => x.order_id);
                });

            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    payment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    amount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    order_id = table.Column<int>(type: "int", nullable: false),
                    payment_date = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    payment_method = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "cash")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__payments__ED1FC9EAA0E144A1", x => x.payment_id);
                });

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    product_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    barcode = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    category_id = table.Column<int>(type: "int", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    price = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    product_name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    supplier_id = table.Column<int>(type: "int", nullable: true),
                    unit = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true, defaultValue: "pcs")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__products__47027DF5CCAB2D15", x => x.product_id);
                });

            migrationBuilder.CreateTable(
                name: "promotion_products",
                columns: table => new
                {
                    promotion_product_id = table.Column<int>(type: "int", nullable: false),
                    product_id = table.Column<int>(type: "int", nullable: false),
                    promo_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__promotio__0236A3A2A70B0794", x => x.promotion_product_id);
                });

            migrationBuilder.CreateTable(
                name: "promotions",
                columns: table => new
                {
                    promo_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    description = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    discount_type = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true),
                    discount_value = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    end_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    min_order_amount = table.Column<decimal>(type: "decimal(10,2)", nullable: true, defaultValue: 0m),
                    promo_code = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true),
                    start_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    status = table.Column<string>(type: "varchar(10)", unicode: false, maxLength: 10, nullable: true, defaultValue: "active"),
                    usage_limit = table.Column<int>(type: "int", nullable: true, defaultValue: 0),
                    used_count = table.Column<int>(type: "int", nullable: true, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__promotio__84EB4CA5D7A26E2B", x => x.promo_id);
                });

            migrationBuilder.CreateTable(
                name: "suppliers",
                columns: table => new
                {
                    supplier_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    address = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    phone = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__supplier__6EE594E8B8133CB3", x => x.supplier_id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    full_name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    role = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    username = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__users__B9BE370FD02ADBBF", x => x.user_id);
                });

            migrationBuilder.CreateIndex(
                name: "UQ__products__C16E36F881E945E0",
                table: "products",
                column: "barcode",
                unique: true,
                filter: "[barcode] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__promotio__C07E2315A0D8A3AF",
                table: "promotions",
                column: "promo_code",
                unique: true,
                filter: "[promo_code] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "UQ__users__F3DBC57203EAC63B",
                table: "users",
                column: "username",
                unique: true,
                filter: "[username] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "categories");

            migrationBuilder.DropTable(
                name: "customers");

            migrationBuilder.DropTable(
                name: "inventory");

            migrationBuilder.DropTable(
                name: "order_items");

            migrationBuilder.DropTable(
                name: "orders");

            migrationBuilder.DropTable(
                name: "payments");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "promotion_products");

            migrationBuilder.DropTable(
                name: "promotions");

            migrationBuilder.DropTable(
                name: "suppliers");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
