SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `civicrm_civiconsession`;

SET FOREIGN_KEY_CHECKS = 1;

-- /*******************************************************
-- *
-- * civicrm_civiconsession
-- *
-- * CiviCon Sessions
-- *
-- *******************************************************/
CREATE TABLE `civicrm_civiconsession` (

  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Unique ID of a Session',
  `title`       VARCHAR(64) COMMENT 'Title of the session',
  `description` TEXT COMMENT 'Description of the session',
  `role`        VARCHAR(64) COMMENT 'Role the session if appropriate for',
  `room`        VARCHAR(64) COMMENT 'Room where the sesion will take place'
  ,
  PRIMARY KEY (`id`)

)
  ENGINE =InnoDB
  DEFAULT CHARACTER SET utf8
  COLLATE utf8_unicode_ci;