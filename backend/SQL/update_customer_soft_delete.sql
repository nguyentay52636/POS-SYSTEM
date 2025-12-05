
-- Add IsDeleted column to Customers table for soft delete
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID(N'[dbo].[customers]') AND name = 'IsDeleted')
BEGIN
    ALTER TABLE customers ADD IsDeleted BIT NOT NULL DEFAULT 0;
END
GO
