#Find most popular categories:

SELECT c.name, count(pc.category_id) AS count
	FROM wikipedia.pages_categories pc
    LEFT JOIN wikipedia.categories c
		ON pc.category_id = c.id
	GROUP BY category_id
    ORDER BY count DESC;