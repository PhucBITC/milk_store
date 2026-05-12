-- SQL Server must use NVARCHAR for Vietnamese text.
-- Run this script once in the MilkStore database.

ALTER TABLE TB_NHOMCHU
ALTER COLUMN TENNHOM NVARCHAR(255) NOT NULL;

ALTER TABLE TB_NHOMCHU
ALTER COLUMN GHICHU NVARCHAR(500) NULL;

-- Data already saved as '?' cannot be recovered automatically.
-- After running the ALTER statements, edit or re-enter those rows.
