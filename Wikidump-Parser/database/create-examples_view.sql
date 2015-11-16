CREATE VIEW `examples` AS (
	SELECT s.id, p.title, p.introduction, p.id AS page_id, p.url, s.content_plaintext
    FROM page_sections s
    LEFT JOIN pages p 
    ON s.page_id = p.id
);