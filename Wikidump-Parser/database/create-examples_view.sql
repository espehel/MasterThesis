CREATE VIEW `examples` AS (
	SELECT s.id, p.title, p.introduction, p.id AS page_id, p.url, s.content_plaintext
    FROM page_sections s
    LEFT JOIN pages p 
    ON s.page_id = p.id
);







CREATE
    ALGORITHM = UNDEFINED
    DEFINER = `root`@`localhost`
    SQL SECURITY DEFINER
VIEW `wikipedia`.`examples` AS
    (SELECT
        `s`.`id` AS `id`,
        `p`.`title` AS `title`,
        `p`.`introduction` AS `introduction`,
        `p`.`id` AS `page_id`,
        `p`.`url` AS `url`,
        `s`.`content_plaintext` AS `content_plaintext`,
        `s`.`content_markup` AS `content_plaintext`
    FROM
        (`wikipedia`.`page_sections` `s`
        LEFT JOIN `wikipedia`.`pages` `p` ON ((`s`.`page_id` = `p`.`id`))))