SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'nguoi_dung'
    AND COLUMN_NAME = 'ma_may'
);

SET @drop_ma_may_sql = IF(
  @column_exists > 0,
  'ALTER TABLE nguoi_dung DROP COLUMN ma_may',
  'SELECT ''Column ma_may does not exist on nguoi_dung'' AS message'
);

PREPARE drop_ma_may_stmt FROM @drop_ma_may_sql;
EXECUTE drop_ma_may_stmt;
DEALLOCATE PREPARE drop_ma_may_stmt;
