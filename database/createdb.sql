
DROP TABLE IF EXISTS `page_sections`;
DROP TABLE IF EXISTS `pages_categories`;
DROP TABLE IF EXISTS `pages`;
DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(80) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `pages` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(50) NOT NULL,
    `timestamp` TIMESTAMP NOT NULL,
    `wiki_id` INT NOT NULL,
    `url` varchar(50) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `pages_categories` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `page_id` INT NOT NULL,
    `category_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `page_sections` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `header` varchar(100) NOT NULL,
    `content_markup` MEDIUMTEXT NOT NULL,
    `content_plaintext` MEDIUMTEXT NOT NULL,
    `length` INT NOT NULL,
    `page_id` INT NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;