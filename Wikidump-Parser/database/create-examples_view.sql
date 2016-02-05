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
        `s`.`header` AS `header`,
        `s`.`content_plaintext` AS `content_plaintext`,
        `s`.`content_markup` AS `content_markup`
    FROM
        (`wikipedia`.`page_sections` `s`
        LEFT JOIN `wikipedia`.`pages` `p` ON ((`s`.`page_id` = `p`.`id`))))