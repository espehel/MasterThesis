CREATE VIEW `page_id_categories` AS (
SELECT p.page_id, c.name
FROM pages_categories p
LEFT JOIN categories c
ON p.category_id = c.id
);