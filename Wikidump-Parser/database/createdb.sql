
DROP TABLE IF EXISTS `page_references`;
DROP TABLE IF EXISTS `page_sections`;
DROP TABLE IF EXISTS `pages_categories`;
DROP TABLE IF EXISTS `pages`;
DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` varchar(80) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `pages` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` varchar(50) NOT NULL,
    `timestamp` TIMESTAMP NOT NULL,
    `wiki_id` INT NOT NULL,
    `url` varchar(50) NOT NULL,
    `introduction` MEDIUMTEXT NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `pages_categories` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `page_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `page_sections` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `header` varchar(100) NOT NULL,
    `content_markup` MEDIUMTEXT NOT NULL,
    `content_plaintext` MEDIUMTEXT NOT NULL,
    `length` INT NOT NULL,
    `header_type` INT NOT NULL,
    `page_id` INT NOT NULL,
    `ancestors` varchar(400),
    PRIMARY KEY (`id`),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `page_references` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` varchar(80) NOT NULL,
    `page_link` varchar(100) NOT NULL,
    `section_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (section_id) REFERENCES page_sections(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
