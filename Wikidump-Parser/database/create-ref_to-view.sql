CREATE
    ALGORITHM = UNDEFINED
    DEFINER = `root`@`localhost`
    SQL SECURITY DEFINER
VIEW `wikipedia`.`ref_to` AS
    (SELECT
        `r`.`section_id` AS `id`, `r`.`page_name` AS `title`
    FROM
        `wikipedia`.`page_references` `r`)