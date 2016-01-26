CREATE VIEW `example_meta_data` AS (
	SELECT r.section_id, p.title, COUNT(r.section_id) AS id, title, ref_out 
    FROM page_references r
    LEFT JOIN page_sections s
    ON r.section_id = s.id
    LEFT JOIN pages p
    ON s.page_id = p.id
	GROUP BY r.section_id
    )