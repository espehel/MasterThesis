
DROP TABLE IF EXISTS `page_sections`;
DROP TABLE IF EXISTS `pages`;


CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `page_sections` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `header` varchar(100) NOT NULL,
    `content` MEDIUMTEXT NOT NULL,
    `page_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (page_id)
          REFERENCES pages(id)
          ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;