using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddImageUrlToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"
IF COL_LENGTH('dbo.products', 'image_url') IS NULL
BEGIN
    ALTER TABLE [products] ADD [image_url] varchar(255) NULL;
END");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"
IF COL_LENGTH('dbo.products', 'image_url') IS NOT NULL
BEGIN
    ALTER TABLE [products] DROP COLUMN [image_url];
END");
        }
    }
}
