SELECT * FROM wikipedia.page_references;


SELECT section_id, COUNT(section_id) AS ref_out FROM wikipedia.page_references
group by section_id;



SELECT r.section_id, p.title, COUNT(r.section_id) AS ref_out, 
		( SELECT COUNT(*) FROM page_references r LEFT JOIN page_sections s ON r.section_id = s.id WHERE r.page_name = p.title) AS ref_in
    FROM page_references r
    LEFT JOIN page_sections s
    ON r.section_id = s.id
    LEFT JOIN pages p
    ON s.page_id = p.id
	GROUP BY r.section_id
    ORDER BY ref_in desc;
    
    
SELECT page_name, COUNT(page_name) AS ref_in
 FROM page_references p
 group by page_name
 order by ref_in desc;

SELECT r.section_id AS id, p.title AS title, COUNT(r.section_id) AS ref_out
    FROM page_references r
    LEFT JOIN page_sections s
    ON r.section_id = s.id
    LEFT JOIN pages p
    ON s.page_id = p.id
	GROUP BY r.section_id;
    
    
SELECT s.id, p.title , r.page_name
	FROM page_sections s 
    LEFT JOIN pages p
    ON p.id = s.page_id
    LEFT JOIN page_references r
    ON s.id = r.section_id 
    WHERE p.title = r.page_name;
    
    