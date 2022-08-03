-- MySQL dump 10.13  Distrib 8.0.30, for macos12 (x86_64)
--
-- Host: localhost    Database: testing
-- ------------------------------------------------------
-- Server version	8.0.29

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `models::core_store`
--

DROP TABLE IF EXISTS `models::core_store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models::core_store` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `value` text,
  `type` varchar(255) DEFAULT NULL,
  `env` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models::core_store`
--

LOCK TABLES `models::core_store` WRITE;
/*!40000 ALTER TABLE `models::core_store` DISABLE KEYS */;
INSERT INTO `models::core_store` VALUES (1,'model::models::plugins','{\"connection\":\"mysql\",\"modelName\":\"models::plugins\",\"type\":\"collection\",\"target\":\"models\",\"originalModelName\":\"plugins\",\"schema\":{\"collectionName\":\"models::plugins\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"path\":{\"type\":\"text\",\"options\":{\"notNull\":true}},\"version\":{\"type\":\"string\",\"length\":11,\"options\":{\"notNull\":true}},\"source\":{\"type\":\"string\",\"length\":8,\"options\":{\"notNull\":true}},\"isInstalled\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"isDisabled\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"isSetUp\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"needsSetUp\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"isUninstalled\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"isBroken\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"hasUpdate\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"name\",\"path\",\"version\",\"source\",\"isInstalled\",\"isDisabled\",\"isSetUp\",\"needsSetUp\",\"isUninstalled\",\"isBroken\",\"hasUpdate\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(2,'model::models::providers','{\"connection\":\"mysql\",\"modelName\":\"models::providers\",\"type\":\"collection\",\"target\":\"models\",\"originalModelName\":\"providers\",\"schema\":{\"collectionName\":\"models::providers\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"path\":{\"type\":\"text\",\"options\":{\"notNull\":true}},\"version\":{\"type\":\"string\",\"length\":11,\"options\":{\"notNull\":true}},\"source\":{\"type\":\"string\",\"length\":8,\"options\":{\"notNull\":true}},\"isInstalled\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"isDisabled\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"isSetUp\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"needsSetUp\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"isUninstalled\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"isBroken\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"hasUpdate\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"name\",\"path\",\"version\",\"source\",\"isInstalled\",\"isDisabled\",\"isSetUp\",\"needsSetUp\",\"isUninstalled\",\"isBroken\",\"hasUpdate\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(3,'model::plugins_common::currentVersions','{\"connection\":\"mysql\",\"modelName\":\"plugins_common::currentVersions\",\"type\":\"collection\",\"target\":\"plugins.common\",\"originalModelName\":\"currentVersions\",\"schema\":{\"collectionName\":\"plugins_common::currentVersions\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"published\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"published\",\"type\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(4,'model::plugins_common::tags','{\"connection\":\"mysql\",\"modelName\":\"plugins_common::tags\",\"type\":\"collection\",\"target\":\"plugins.common\",\"originalModelName\":\"tags\",\"schema\":{\"collectionName\":\"plugins_common::tags\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"tag\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"value\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"type\",\"tag\",\"value\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(5,'model::plugins_common::versions','{\"connection\":\"mysql\",\"modelName\":\"plugins_common::versions\",\"type\":\"collection\",\"target\":\"plugins.common\",\"originalModelName\":\"versions\",\"schema\":{\"collectionName\":\"plugins_common::versions\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"uuid\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"major\":{\"type\":\"number\",\"options\":{\"notNull\":true}},\"minor\":{\"type\":\"number\",\"options\":{\"notNull\":true}},\"patch\":{\"type\":\"number\",\"options\":{\"notNull\":true}},\"published\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"uuid\",\"major\",\"minor\",\"patch\",\"published\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(6,'model::plugins_emails::config','{\"connection\":\"mysql\",\"modelName\":\"plugins_emails::config\",\"type\":\"collection\",\"target\":\"plugins.emails\",\"originalModelName\":\"config\",\"schema\":{\"collectionName\":\"plugins_emails::config\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"value\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"value\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(7,'model::plugins_emails::email-template','{\"connection\":\"mysql\",\"modelName\":\"plugins_emails::email-template\",\"type\":\"collection\",\"target\":\"plugins.emails\",\"originalModelName\":\"email-template\",\"schema\":{\"collectionName\":\"plugins_emails::email-template\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"templateName\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"templateName\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(8,'model::plugins_emails::email-template-detail','{\"connection\":\"mysql\",\"modelName\":\"plugins_emails::email-template-detail\",\"type\":\"collection\",\"target\":\"plugins.emails\",\"originalModelName\":\"email-template-detail\",\"schema\":{\"collectionName\":\"plugins_emails::email-template-detail\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"template\":{\"references\":{\"collection\":\"plugins_emails::email-template\"}},\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"language\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"subject\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"html\":{\"type\":\"richtext\",\"textType\":\"mediumtext\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"template\",\"type\",\"language\",\"subject\",\"html\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(9,'model::plugins_comunica::room','{\"connection\":\"mysql\",\"modelName\":\"plugins_comunica::room\",\"type\":\"collection\",\"target\":\"plugins.comunica\",\"originalModelName\":\"room\",\"schema\":{\"collectionName\":\"plugins_comunica::room\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"useEncrypt\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"useEncrypt\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(10,'model::plugins_comunica::message','{\"connection\":\"mysql\",\"modelName\":\"plugins_comunica::message\",\"type\":\"collection\",\"target\":\"plugins.comunica\",\"originalModelName\":\"message\",\"schema\":{\"collectionName\":\"plugins_comunica::message\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"room\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"userAgent\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"message\":{\"type\":\"json\"},\"isEncrypt\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"room\",\"userAgent\",\"message\",\"isEncrypt\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(11,'model::plugins_comunica::roomMessagesUnRead','{\"connection\":\"mysql\",\"modelName\":\"plugins_comunica::roomMessagesUnRead\",\"type\":\"collection\",\"target\":\"plugins.comunica\",\"originalModelName\":\"roomMessagesUnRead\",\"schema\":{\"collectionName\":\"plugins_comunica::roomMessagesUnRead\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"room\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"userAgent\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"message\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"room\",\"userAgent\",\"message\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(12,'model::plugins_comunica::userAgentInRoom','{\"connection\":\"mysql\",\"modelName\":\"plugins_comunica::userAgentInRoom\",\"type\":\"collection\",\"target\":\"plugins.comunica\",\"originalModelName\":\"userAgentInRoom\",\"schema\":{\"collectionName\":\"plugins_comunica::userAgentInRoom\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"room\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"userAgent\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"encryptKey\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"room\",\"userAgent\",\"encryptKey\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(13,'model::plugins_scores::periods','{\"connection\":\"mysql\",\"modelName\":\"plugins_scores::periods\",\"type\":\"collection\",\"target\":\"plugins.scores\",\"originalModelName\":\"periods\",\"schema\":{\"collectionName\":\"plugins_scores::periods\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"center\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"program\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"course\":{\"type\":\"uuid\"},\"name\":{\"type\":\"string\"},\"startDate\":{\"type\":\"datetime\"},\"endDate\":{\"type\":\"datetime\"},\"createdBy\":{\"type\":\"uuid\"},\"public\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"center\",\"program\",\"course\",\"name\",\"startDate\",\"endDate\",\"createdBy\",\"public\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(14,'model::plugins_widgets::widget-item-profile','{\"connection\":\"mysql\",\"modelName\":\"plugins_widgets::widget-item-profile\",\"type\":\"collection\",\"target\":\"plugins.widgets\",\"originalModelName\":\"widget-item-profile\",\"schema\":{\"collectionName\":\"plugins_widgets::widget-item-profile\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"zoneKey\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"key\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"profile\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"zoneKey\",\"key\",\"profile\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(15,'model::plugins_widgets::widget-item','{\"connection\":\"mysql\",\"modelName\":\"plugins_widgets::widget-item\",\"type\":\"collection\",\"target\":\"plugins.widgets\",\"originalModelName\":\"widget-item\",\"schema\":{\"collectionName\":\"plugins_widgets::widget-item\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"zoneKey\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"key\":{\"type\":\"string\",\"options\":{\"unique\":true,\"notNull\":true}},\"url\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"pluginName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"name\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"order\":{\"type\":\"number\"},\"properties\":{\"type\":\"text\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"zoneKey\",\"key\",\"url\",\"pluginName\",\"name\",\"description\",\"order\",\"properties\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(16,'model::plugins_widgets::widget-zone','{\"connection\":\"mysql\",\"modelName\":\"plugins_widgets::widget-zone\",\"type\":\"collection\",\"target\":\"plugins.widgets\",\"originalModelName\":\"widget-zone\",\"schema\":{\"collectionName\":\"plugins_widgets::widget-zone\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"unique\":true,\"notNull\":true}},\"name\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"name\",\"description\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(17,'model::plugins_timetable::timetable','{\"connection\":\"mysql\",\"modelName\":\"plugins_timetable::timetable\",\"type\":\"collection\",\"target\":\"plugins.timetable\",\"originalModelName\":\"timetable\",\"schema\":{\"collectionName\":\"plugins_timetable::timetable\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"class\":{\"type\":\"uuid\",\"options\":{\"required\":true}},\"day\":{\"type\":\"string\",\"options\":{\"required\":true}},\"dayWeek\":{\"type\":\"integer\",\"options\":{\"required\":true}},\"start\":{\"type\":\"string\",\"options\":{\"required\":true}},\"end\":{\"type\":\"string\",\"options\":{\"required\":true}},\"duration\":{\"type\":\"integer\",\"options\":{\"required\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"class\",\"day\",\"dayWeek\",\"start\",\"end\",\"duration\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(18,'model::plugins_timetable::settings','{\"connection\":\"mysql\",\"modelName\":\"plugins_timetable::settings\",\"type\":\"collection\",\"target\":\"plugins.timetable\",\"originalModelName\":\"settings\",\"schema\":{\"collectionName\":\"plugins_timetable::settings\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"hideWelcome\":{\"type\":\"boolean\"},\"configured\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"hideWelcome\",\"configured\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(19,'model::plugins_timetable::config','{\"connection\":\"mysql\",\"modelName\":\"plugins_timetable::config\",\"type\":\"collection\",\"target\":\"plugins.timetable\",\"originalModelName\":\"config\",\"schema\":{\"collectionName\":\"plugins_timetable::config\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"days\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"start\":{\"type\":\"time\",\"options\":{\"notNull\":true}},\"end\":{\"type\":\"time\",\"options\":{\"notNull\":true}},\"slot\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"entities\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"entityTypes\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"days\",\"start\",\"end\",\"slot\",\"entities\",\"entityTypes\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(20,'model::plugins_timetable::breaks','{\"connection\":\"mysql\",\"modelName\":\"plugins_timetable::breaks\",\"type\":\"collection\",\"target\":\"plugins.timetable\",\"originalModelName\":\"breaks\",\"schema\":{\"collectionName\":\"plugins_timetable::breaks\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"timetable\":{\"references\":{\"collection\":\"plugins_timetable::config\"}},\"name\":{\"type\":\"string\",\"options\":{\"required\":true,\"minLength\":1}},\"start\":{\"type\":\"time\",\"options\":{\"required\":true}},\"end\":{\"type\":\"time\",\"options\":{\"required\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"timetable\",\"name\",\"start\",\"end\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(21,'model::plugins_users::centers','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::centers\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"centers\",\"schema\":{\"collectionName\":\"plugins_users::centers\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"description\":{\"type\":\"string\"},\"locale\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"email\":{\"type\":\"string\"},\"uri\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"timezone\":{\"type\":\"string\"},\"firstDayOfWeek\":{\"type\":\"number\"},\"country\":{\"type\":\"string\"},\"city\":{\"type\":\"string\"},\"postalCode\":{\"type\":\"string\"},\"street\":{\"type\":\"string\"},\"phone\":{\"type\":\"string\"},\"contactEmail\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"description\",\"locale\",\"email\",\"uri\",\"timezone\",\"firstDayOfWeek\",\"country\",\"city\",\"postalCode\",\"street\",\"phone\",\"contactEmail\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(22,'model::plugins_users::actions','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::actions\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"actions\",\"schema\":{\"collectionName\":\"plugins_users::actions\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"actionName\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"order\":{\"type\":\"integer\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"actionName\",\"order\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(23,'model::plugins_users::config','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::config\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"config\",\"schema\":{\"collectionName\":\"plugins_users::config\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"value\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"value\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(24,'model::plugins_users::group-role','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::group-role\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"group-role\",\"schema\":{\"collectionName\":\"plugins_users::group-role\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"group\":{\"references\":{\"collection\":\"plugins_users::groups\"}},\"role\":{\"references\":{\"collection\":\"plugins_users::roles\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"group\",\"role\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(25,'model::plugins_users::group-user-agent','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::group-user-agent\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"group-user-agent\",\"schema\":{\"collectionName\":\"plugins_users::group-user-agent\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"group\":{\"references\":{\"collection\":\"plugins_users::groups\"}},\"userAgent\":{\"references\":{\"collection\":\"plugins_users::user-agent\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"group\",\"userAgent\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(26,'model::plugins_users::groups','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::groups\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"groups\",\"schema\":{\"collectionName\":\"plugins_users::groups\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"type\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(27,'model::plugins_users::item-permissions','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::item-permissions\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"item-permissions\",\"schema\":{\"collectionName\":\"plugins_users::item-permissions\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"permissionName\":{\"type\":\"text\",\"options\":{\"notNull\":true}},\"actionName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"target\":{\"type\":\"string\"},\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"item\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"center\":{\"type\":\"text\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"permissionName\",\"actionName\",\"target\",\"type\",\"item\",\"center\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(28,'model::plugins_users::permission-action','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::permission-action\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"permission-action\",\"schema\":{\"collectionName\":\"plugins_users::permission-action\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"permissionName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"actionName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"permissionName\",\"actionName\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(29,'model::plugins_users::permissions','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::permissions\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"permissions\",\"schema\":{\"collectionName\":\"plugins_users::permissions\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"permissionName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"pluginName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"permissionName\",\"pluginName\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(30,'model::plugins_users::profile-contacts','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::profile-contacts\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"profile-contacts\",\"schema\":{\"collectionName\":\"plugins_users::profile-contacts\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"fromProfile\":{\"references\":{\"collection\":\"plugins_users::profiles\"}},\"toProfile\":{\"references\":{\"collection\":\"plugins_users::profiles\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"fromProfile\",\"toProfile\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(31,'model::plugins_users::profile-role','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::profile-role\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"profile-role\",\"schema\":{\"collectionName\":\"plugins_users::profile-role\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"profile\":{\"references\":{\"collection\":\"plugins_users::profiles\"}},\"role\":{\"references\":{\"collection\":\"plugins_users::roles\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"profile\",\"role\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(32,'model::plugins_users::profiles','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::profiles\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"profiles\",\"schema\":{\"collectionName\":\"plugins_users::profiles\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"description\":{\"type\":\"string\"},\"uri\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"unique\":true}},\"role\":{\"references\":{\"collection\":\"plugins_users::roles\"}},\"indexable\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":true}},\"sysName\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"description\",\"uri\",\"role\",\"indexable\",\"sysName\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(33,'model::plugins_users::role-center','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::role-center\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"role-center\",\"schema\":{\"collectionName\":\"plugins_users::role-center\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"role\":{\"references\":{\"collection\":\"plugins_users::roles\"}},\"center\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"role\",\"center\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(34,'model::plugins_users::role-permission','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::role-permission\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"role-permission\",\"schema\":{\"collectionName\":\"plugins_users::role-permission\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"role\":{\"references\":{\"collection\":\"plugins_users::roles\"}},\"permissionName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"actionName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"target\":{\"type\":\"string\"},\"isCustom\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"role\",\"permissionName\",\"actionName\",\"target\",\"isCustom\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(35,'model::plugins_users::roles','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::roles\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"roles\",\"schema\":{\"collectionName\":\"plugins_users::roles\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"description\":{\"type\":\"string\"},\"uri\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"type\",\"description\",\"uri\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(36,'model::plugins_users::user-agent-contacts','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::user-agent-contacts\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"user-agent-contacts\",\"schema\":{\"collectionName\":\"plugins_users::user-agent-contacts\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"fromUserAgent\":{\"references\":{\"collection\":\"plugins_users::user-agent\"}},\"fromCenter\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"fromProfile\":{\"references\":{\"collection\":\"plugins_users::profiles\"}},\"toUserAgent\":{\"references\":{\"collection\":\"plugins_users::user-agent\"}},\"toCenter\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"toProfile\":{\"references\":{\"collection\":\"plugins_users::profiles\"}},\"pluginName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"target\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"fromUserAgent\",\"fromCenter\",\"fromProfile\",\"toUserAgent\",\"toCenter\",\"toProfile\",\"pluginName\",\"target\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(37,'model::plugins_users::user-agent-permission','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::user-agent-permission\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"user-agent-permission\",\"schema\":{\"collectionName\":\"plugins_users::user-agent-permission\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"userAgent\":{\"references\":{\"collection\":\"plugins_users::user-agent\"}},\"permissionName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"actionName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"target\":{\"type\":\"string\"},\"role\":{\"references\":{\"collection\":\"plugins_users::roles\"}},\"center\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"userAgent\",\"permissionName\",\"actionName\",\"target\",\"role\",\"center\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(38,'model::plugins_users::user-agent','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::user-agent\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"user-agent\",\"schema\":{\"collectionName\":\"plugins_users::user-agent\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"user\":{\"references\":{\"collection\":\"plugins_users::users\"}},\"role\":{\"references\":{\"collection\":\"plugins_users::roles\"}},\"reloadPermissions\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"datasetIsGood\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"user\",\"role\",\"reloadPermissions\",\"datasetIsGood\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(39,'model::plugins_users::user-preferences','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::user-preferences\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"user-preferences\",\"schema\":{\"collectionName\":\"plugins_users::user-preferences\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"user\":{\"references\":{\"collection\":\"plugins_users::users\"}},\"gender\":{\"type\":\"string\"},\"pronoun\":{\"type\":\"string\"},\"pluralPronoun\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"user\",\"gender\",\"pronoun\",\"pluralPronoun\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(40,'model::plugins_users::user-profile','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::user-profile\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"user-profile\",\"schema\":{\"collectionName\":\"plugins_users::user-profile\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"user\":{\"references\":{\"collection\":\"plugins_users::users\"}},\"profile\":{\"references\":{\"collection\":\"plugins_users::profiles\"}},\"role\":{\"references\":{\"collection\":\"plugins_users::roles\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"user\",\"profile\",\"role\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(41,'model::plugins_users::user-recover-password','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::user-recover-password\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"user-recover-password\",\"schema\":{\"collectionName\":\"plugins_users::user-recover-password\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"user\":{\"references\":{\"collection\":\"plugins_users::users\"}},\"code\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"user\",\"code\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(42,'model::plugins_users::user-register-password','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::user-register-password\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"user-register-password\",\"schema\":{\"collectionName\":\"plugins_users::user-register-password\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"user\":{\"references\":{\"collection\":\"plugins_users::users\"}},\"code\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"user\",\"code\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(43,'model::plugins_users::user-remember-login','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::user-remember-login\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"user-remember-login\",\"schema\":{\"collectionName\":\"plugins_users::user-remember-login\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"user\":{\"references\":{\"collection\":\"plugins_users::users\"}},\"profile\":{\"references\":{\"collection\":\"plugins_users::profiles\"}},\"center\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"user\",\"profile\",\"center\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(44,'model::plugins_users::users','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::users\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"users\",\"schema\":{\"collectionName\":\"plugins_users::users\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"surnames\":{\"type\":\"string\"},\"secondSurname\":{\"type\":\"string\"},\"email\":{\"type\":\"string\",\"options\":{\"unique\":true,\"notNull\":true}},\"phone\":{\"type\":\"string\"},\"avatar\":{\"type\":\"string\"},\"avatarAsset\":{\"type\":\"string\"},\"birthdate\":{\"type\":\"datetime\",\"options\":{\"notNull\":true}},\"password\":{\"type\":\"string\",\"options\":{\"hidden\":true}},\"locale\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"active\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}},\"status\":{\"type\":\"string\"},\"gender\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"surnames\",\"secondSurname\",\"email\",\"phone\",\"avatar\",\"avatarAsset\",\"birthdate\",\"password\",\"locale\",\"active\",\"status\",\"gender\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(45,'model::plugins_users::super-admin-user','{\"connection\":\"mysql\",\"modelName\":\"plugins_users::super-admin-user\",\"type\":\"collection\",\"target\":\"plugins.users\",\"originalModelName\":\"super-admin-user\",\"schema\":{\"collectionName\":\"plugins_users::super-admin-user\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"user\":{\"references\":{\"collection\":\"plugins_users::users\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"user\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(46,'model::plugins_multilanguage::common','{\"connection\":\"mysql\",\"modelName\":\"plugins_multilanguage::common\",\"type\":\"collection\",\"target\":\"plugins.multilanguage\",\"originalModelName\":\"common\",\"schema\":{\"collectionName\":\"plugins_multilanguage::common\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"value\":{\"type\":\"richtext\",\"textType\":\"text\",\"options\":{\"notNull\":true}},\"locale\":{\"type\":\"string\",\"options\":{\"unique\":false}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"key\",\"value\",\"locale\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(47,'model::plugins_multilanguage::contents','{\"connection\":\"mysql\",\"modelName\":\"plugins_multilanguage::contents\",\"type\":\"collection\",\"target\":\"plugins.multilanguage\",\"originalModelName\":\"contents\",\"schema\":{\"collectionName\":\"plugins_multilanguage::contents\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"value\":{\"type\":\"richtext\",\"textType\":\"text\",\"options\":{\"notNull\":true}},\"locale\":{\"type\":\"string\",\"options\":{\"unique\":false}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"key\",\"value\",\"locale\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(48,'model::plugins_multilanguage::locales','{\"connection\":\"mysql\",\"modelName\":\"plugins_multilanguage::locales\",\"type\":\"collection\",\"target\":\"plugins.multilanguage\",\"originalModelName\":\"locales\",\"schema\":{\"collectionName\":\"plugins_multilanguage::locales\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"code\":{\"type\":\"string\",\"length\":12,\"options\":{\"unique\":true}},\"name\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"code\",\"name\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(49,'model::plugins_dataset::dataset-values','{\"connection\":\"mysql\",\"modelName\":\"plugins_dataset::dataset-values\",\"type\":\"collection\",\"target\":\"plugins.dataset\",\"originalModelName\":\"dataset-values\",\"schema\":{\"collectionName\":\"plugins_dataset::dataset-values\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"pluginName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"locationName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"target\":{\"type\":\"string\"},\"key\":{\"type\":\"string\"},\"value\":{\"type\":\"json\"},\"searchableValueString\":{\"type\":\"richtext\"},\"searchableValueNumber\":{\"type\":\"richtext\"},\"metadata\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"pluginName\",\"locationName\",\"target\",\"key\",\"value\",\"searchableValueString\",\"searchableValueNumber\",\"metadata\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(50,'model::plugins_dataset::dataset','{\"connection\":\"mysql\",\"modelName\":\"plugins_dataset::dataset\",\"type\":\"collection\",\"target\":\"plugins.dataset\",\"originalModelName\":\"dataset\",\"schema\":{\"collectionName\":\"plugins_dataset::dataset\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"pluginName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"locationName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"jsonSchema\":{\"type\":\"text\",\"textType\":\"mediumText\"},\"jsonUI\":{\"type\":\"text\",\"textType\":\"mediumText\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"pluginName\",\"locationName\",\"jsonSchema\",\"jsonUI\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(51,'model::plugins_grades::condition-groups','{\"connection\":\"mysql\",\"modelName\":\"plugins_grades::condition-groups\",\"type\":\"collection\",\"target\":\"plugins.grades\",\"originalModelName\":\"condition-groups\",\"schema\":{\"collectionName\":\"plugins_grades::condition-groups\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"operator\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"rule\":{\"references\":{\"collection\":\"plugins_grades::rules\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"operator\",\"rule\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(52,'model::plugins_grades::conditions','{\"connection\":\"mysql\",\"modelName\":\"plugins_grades::conditions\",\"type\":\"collection\",\"target\":\"plugins.grades\",\"originalModelName\":\"conditions\",\"schema\":{\"collectionName\":\"plugins_grades::conditions\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"source\":{\"type\":\"string\"},\"sourceIds\":{\"type\":\"json\"},\"data\":{\"type\":\"string\"},\"dataTargets\":{\"type\":\"json\"},\"operator\":{\"type\":\"string\"},\"target\":{\"type\":\"float\",\"scale\":4},\"targetGradeScale\":{\"references\":{\"collection\":\"plugins_grades::grade-scales\"}},\"rule\":{\"references\":{\"collection\":\"plugins_grades::rules\"}},\"childGroup\":{\"references\":{\"collection\":\"plugins_grades::condition-groups\"}},\"parentGroup\":{\"references\":{\"collection\":\"plugins_grades::condition-groups\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"source\",\"sourceIds\",\"data\",\"dataTargets\",\"operator\",\"target\",\"targetGradeScale\",\"rule\",\"childGroup\",\"parentGroup\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(53,'model::plugins_grades::grade-scales','{\"connection\":\"mysql\",\"modelName\":\"plugins_grades::grade-scales\",\"type\":\"collection\",\"target\":\"plugins.grades\",\"originalModelName\":\"grade-scales\",\"schema\":{\"collectionName\":\"plugins_grades::grade-scales\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"number\":{\"type\":\"float\",\"scale\":4,\"options\":{\"notNull\":true}},\"description\":{\"type\":\"string\"},\"letter\":{\"type\":\"string\"},\"grade\":{\"references\":{\"collection\":\"plugins_grades::grades\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"number\",\"description\",\"letter\",\"grade\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(54,'model::plugins_grades::grade-tags','{\"connection\":\"mysql\",\"modelName\":\"plugins_grades::grade-tags\",\"type\":\"collection\",\"target\":\"plugins.grades\",\"originalModelName\":\"grade-tags\",\"schema\":{\"collectionName\":\"plugins_grades::grades-tags\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"description\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"letter\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"scale\":{\"references\":{\"collection\":\"plugins_grades::grade-scales\"}},\"grade\":{\"references\":{\"collection\":\"plugins_grades::grades\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"description\",\"letter\",\"scale\",\"grade\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(55,'model::plugins_grades::grades','{\"connection\":\"mysql\",\"modelName\":\"plugins_grades::grades\",\"type\":\"collection\",\"target\":\"plugins.grades\",\"originalModelName\":\"grades\",\"schema\":{\"collectionName\":\"plugins_grades::grades\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"isPercentage\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"minScaleToPromote\":{\"references\":{\"collection\":\"plugins_grades::grade-scales\"}},\"center\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"type\",\"isPercentage\",\"minScaleToPromote\",\"center\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(56,'model::plugins_grades::rules','{\"connection\":\"mysql\",\"modelName\":\"plugins_grades::rules\",\"type\":\"collection\",\"target\":\"plugins.grades\",\"originalModelName\":\"rules\",\"schema\":{\"collectionName\":\"plugins_grades::rules\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"center\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"grade\":{\"references\":{\"collection\":\"plugins_grades::grades\"}},\"program\":{\"type\":\"string\"},\"group\":{\"references\":{\"collection\":\"plugins_grades::condition-groups\"}},\"isDependency\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false,\"notNull\":true}},\"subject\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"center\",\"grade\",\"program\",\"group\",\"isDependency\",\"subject\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(57,'model::plugins_grades::settings','{\"connection\":\"mysql\",\"modelName\":\"plugins_grades::settings\",\"type\":\"collection\",\"target\":\"plugins.grades\",\"originalModelName\":\"settings\",\"schema\":{\"collectionName\":\"plugins_grades::settings\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"hideWelcome\":{\"type\":\"boolean\"},\"configured\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"hideWelcome\",\"configured\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(58,'model::plugins_academic-portfolio::class-course','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::class-course\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"class-course\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::class-course\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"class\":{\"references\":{\"collection\":\"plugins_academic-portfolio::class\"}},\"course\":{\"references\":{\"collection\":\"plugins_academic-portfolio::groups\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"class\",\"course\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(59,'model::plugins_academic-portfolio::class-group','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::class-group\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"class-group\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::class-group\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"class\":{\"references\":{\"collection\":\"plugins_academic-portfolio::class\"}},\"group\":{\"references\":{\"collection\":\"plugins_academic-portfolio::groups\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"class\",\"group\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(60,'model::plugins_academic-portfolio::class-knowledges','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::class-knowledges\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"class-knowledges\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::class-knowledges\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"class\":{\"references\":{\"collection\":\"plugins_academic-portfolio::class\"}},\"knowledge\":{\"references\":{\"collection\":\"plugins_academic-portfolio::knowledges\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"class\",\"knowledge\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(61,'model::plugins_academic-portfolio::class-student','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::class-student\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"class-student\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::class-student\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"class\":{\"references\":{\"collection\":\"plugins_academic-portfolio::class\"}},\"student\":{\"references\":{\"collection\":\"plugins_users::user-agent\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"class\",\"student\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(62,'model::plugins_academic-portfolio::class-substage','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::class-substage\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"class-substage\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::class-substage\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"class\":{\"references\":{\"collection\":\"plugins_academic-portfolio::class\"}},\"substage\":{\"references\":{\"collection\":\"plugins_academic-portfolio::groups\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"class\",\"substage\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(63,'model::plugins_academic-portfolio::class-teacher','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::class-teacher\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"class-teacher\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::class-teacher\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"class\":{\"references\":{\"collection\":\"plugins_academic-portfolio::class\"}},\"teacher\":{\"references\":{\"collection\":\"plugins_users::user-agent\"}},\"type\":{\"type\":\"string\",\"options\":{\"defaultTo\":\"associate-teacher\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"class\",\"teacher\",\"type\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(64,'model::plugins_academic-portfolio::class','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::class\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"class\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::class\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"subjectType\":{\"references\":{\"collection\":\"plugins_academic-portfolio::subject-types\"}},\"subject\":{\"references\":{\"collection\":\"plugins_academic-portfolio::subjects\"}},\"class\":{\"references\":{\"collection\":\"plugins_academic-portfolio::class\"}},\"classroom\":{\"type\":\"string\"},\"seats\":{\"type\":\"integer\"},\"image\":{\"type\":\"string\"},\"color\":{\"type\":\"string\"},\"address\":{\"type\":\"string\"},\"virtualUrl\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"program\",\"subjectType\",\"subject\",\"class\",\"classroom\",\"seats\",\"image\",\"color\",\"address\",\"virtualUrl\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(65,'model::plugins_academic-portfolio::configs','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::configs\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"configs\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::configs\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"value\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"value\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(66,'model::plugins_academic-portfolio::groups','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::groups\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"groups\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::groups\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\"},\"abbreviation\":{\"type\":\"string\"},\"index\":{\"type\":\"integer\"},\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"number\":{\"type\":\"integer\"},\"frequency\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"abbreviation\",\"index\",\"program\",\"type\",\"number\",\"frequency\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(67,'model::plugins_academic-portfolio::knowledges','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::knowledges\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"knowledges\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::knowledges\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"abbreviation\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"color\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"icon\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"credits_course\":{\"type\":\"integer\"},\"credits_program\":{\"type\":\"integer\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"abbreviation\",\"color\",\"icon\",\"program\",\"credits_course\",\"credits_program\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(68,'model::plugins_academic-portfolio::program-center','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::program-center\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"program-center\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::program-center\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"center\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"program\",\"center\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(69,'model::plugins_academic-portfolio::program-subjects-credits','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::program-subjects-credits\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"program-subjects-credits\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::program-subjects-credits\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"subject\":{\"references\":{\"collection\":\"plugins_academic-portfolio::subjects\"}},\"course\":{\"references\":{\"collection\":\"plugins_academic-portfolio::groups\"}},\"credits\":{\"type\":\"integer\"},\"internalId\":{\"type\":\"string\"},\"compiledInternalId\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"program\",\"subject\",\"course\",\"credits\",\"internalId\",\"compiledInternalId\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(70,'model::plugins_academic-portfolio::programs','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::programs\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"programs\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::programs\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"color\":{\"type\":\"string\"},\"image\":{\"type\":\"string\"},\"imageUrl\":{\"type\":\"string\"},\"abbreviation\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"credits\":{\"type\":\"integer\",\"options\":{\"defaultTo\":null}},\"maxGroupAbbreviation\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"maxGroupAbbreviationIsOnlyNumbers\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"maxNumberOfCourses\":{\"type\":\"integer\",\"options\":{\"defaultTo\":0}},\"courseCredits\":{\"type\":\"integer\",\"options\":{\"defaultTo\":0}},\"hideCoursesInTree\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"moreThanOneAcademicYear\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"haveSubstagesPerCourse\":{\"type\":\"boolean\"},\"substagesFrequency\":{\"type\":\"string\"},\"numberOfSubstages\":{\"type\":\"integer\",\"options\":{\"defaultTo\":1}},\"useDefaultSubstagesName\":{\"type\":\"boolean\"},\"maxSubstageAbbreviation\":{\"type\":\"integer\"},\"maxSubstageAbbreviationIsOnlyNumbers\":{\"type\":\"boolean\"},\"haveKnowledge\":{\"type\":\"boolean\"},\"maxKnowledgeAbbreviation\":{\"type\":\"integer\"},\"maxKnowledgeAbbreviationIsOnlyNumbers\":{\"type\":\"boolean\"},\"subjectsFirstDigit\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"subjectsDigits\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"treeType\":{\"type\":\"integer\",\"options\":{\"defaultTo\":1}},\"evaluationSystem\":{\"type\":\"uuid\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"color\",\"image\",\"imageUrl\",\"abbreviation\",\"credits\",\"maxGroupAbbreviation\",\"maxGroupAbbreviationIsOnlyNumbers\",\"maxNumberOfCourses\",\"courseCredits\",\"hideCoursesInTree\",\"moreThanOneAcademicYear\",\"haveSubstagesPerCourse\",\"substagesFrequency\",\"numberOfSubstages\",\"useDefaultSubstagesName\",\"maxSubstageAbbreviation\",\"maxSubstageAbbreviationIsOnlyNumbers\",\"haveKnowledge\",\"maxKnowledgeAbbreviation\",\"maxKnowledgeAbbreviationIsOnlyNumbers\",\"subjectsFirstDigit\",\"subjectsDigits\",\"treeType\",\"evaluationSystem\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(71,'model::plugins_academic-portfolio::settings','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::settings\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"settings\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::settings\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"hideWelcome\":{\"type\":\"boolean\"},\"configured\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"hideWelcome\",\"configured\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(72,'model::plugins_academic-portfolio::subject-types','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::subject-types\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"subject-types\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::subject-types\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"groupVisibility\":{\"type\":\"boolean\",\"options\":{\"notNull\":true}},\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"credits_course\":{\"type\":\"integer\"},\"credits_program\":{\"type\":\"integer\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"groupVisibility\",\"program\",\"credits_course\",\"credits_program\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(73,'model::plugins_academic-portfolio::subjects','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-portfolio::subjects\",\"type\":\"collection\",\"target\":\"plugins.academic-portfolio\",\"originalModelName\":\"subjects\",\"schema\":{\"collectionName\":\"plugins_academic-portfolio::subjects\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"course\":{\"references\":{\"collection\":\"plugins_academic-portfolio::groups\"}},\"image\":{\"type\":\"string\"},\"icon\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"program\",\"course\",\"image\",\"icon\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(74,'model::plugins_academic-calendar::config','{\"connection\":\"mysql\",\"modelName\":\"plugins_academic-calendar::config\",\"type\":\"collection\",\"target\":\"plugins.academic-calendar\",\"originalModelName\":\"config\",\"schema\":{\"collectionName\":\"plugins_academic-calendar::config\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"program\":{\"type\":\"string\"},\"allCoursesHaveSameConfig\":{\"type\":\"boolean\"},\"allCoursesHaveSameDates\":{\"type\":\"boolean\"},\"courseDates\":{\"type\":\"json\"},\"allCoursesHaveSameDays\":{\"type\":\"boolean\"},\"courseDays\":{\"type\":\"json\"},\"allCoursesHaveSameHours\":{\"type\":\"boolean\"},\"allDaysHaveSameHours\":{\"type\":\"boolean\"},\"courseHours\":{\"type\":\"json\"},\"breaks\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"program\",\"allCoursesHaveSameConfig\",\"allCoursesHaveSameDates\",\"courseDates\",\"allCoursesHaveSameDays\",\"courseDays\",\"allCoursesHaveSameHours\",\"allDaysHaveSameHours\",\"courseHours\",\"breaks\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(75,'model::plugins_admin::settings','{\"connection\":\"mysql\",\"modelName\":\"plugins_admin::settings\",\"type\":\"collection\",\"target\":\"plugins.admin\",\"originalModelName\":\"settings\",\"schema\":{\"collectionName\":\"plugins_admin::settings\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"configured\":{\"type\":\"boolean\"},\"status\":{\"type\":\"string\",\"options\":{\"defaultTo\":\"NONE\"}},\"lang\":{\"type\":\"string\",\"options\":{\"defaultTo\":\"en\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"configured\",\"status\",\"lang\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(76,'model::plugins_assignables::assignableInstances','{\"connection\":\"mysql\",\"modelName\":\"plugins_assignables::assignableInstances\",\"type\":\"collection\",\"target\":\"plugins.assignables\",\"originalModelName\":\"assignableInstances\",\"schema\":{\"collectionName\":\"plugins_assignables::assignableInstances\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"assignable\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"alwaysAvailable\":{\"type\":\"boolean\",\"options\":{\"notNull\":true}},\"duration\":{\"type\":\"string\"},\"gradable\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultValue\":0}},\"requiresScoring\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultValue\":0}},\"allowFeedback\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultValue\":0}},\"messageToAssignees\":{\"type\":\"richtext\"},\"curriculum\":{\"type\":\"json\"},\"metadata\":{\"type\":\"json\"},\"relatedAssignableInstances\":{\"type\":\"json\"},\"event\":{\"type\":\"uuid\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"assignable\",\"alwaysAvailable\",\"duration\",\"gradable\",\"requiresScoring\",\"allowFeedback\",\"messageToAssignees\",\"curriculum\",\"metadata\",\"relatedAssignableInstances\",\"event\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(77,'model::plugins_assignables::assignables','{\"connection\":\"mysql\",\"modelName\":\"plugins_assignables::assignables\",\"type\":\"collection\",\"target\":\"plugins.assignables\",\"originalModelName\":\"assignables\",\"schema\":{\"collectionName\":\"plugins_assignables::assignables\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"asset\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"role\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"gradable\":{\"type\":\"boolean\",\"options\":{\"notNull\":true}},\"center\":{\"type\":\"uuid\"},\"statement\":{\"type\":\"richtext\"},\"development\":{\"type\":\"richtext\"},\"duration\":{\"type\":\"string\"},\"resources\":{\"type\":\"json\"},\"submission\":{\"type\":\"json\"},\"instructionsForTeachers\":{\"type\":\"richtext\"},\"relatedAssignables\":{\"type\":\"json\"},\"instructionsForStudents\":{\"type\":\"richtext\"},\"metadata\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"specificType\":\"varchar(255)\",\"type\":\"int\"},\"allAttributes\":[\"asset\",\"role\",\"gradable\",\"center\",\"statement\",\"development\",\"duration\",\"resources\",\"submission\",\"instructionsForTeachers\",\"relatedAssignables\",\"instructionsForStudents\",\"metadata\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(78,'model::plugins_assignables::assignations','{\"connection\":\"mysql\",\"modelName\":\"plugins_assignables::assignations\",\"type\":\"collection\",\"target\":\"plugins.assignables\",\"originalModelName\":\"assignations\",\"schema\":{\"collectionName\":\"plugins_assignables::assignations\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"instance\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"indexable\":{\"type\":\"boolean\",\"options\":{\"notNull\":true}},\"user\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"classes\":{\"type\":\"json\",\"options\":{\"notNull\":true}},\"group\":{\"type\":\"string\"},\"status\":{\"type\":\"string\"},\"metadata\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"uuid\"},\"allAttributes\":[\"instance\",\"indexable\",\"user\",\"classes\",\"group\",\"status\",\"metadata\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(79,'model::plugins_assignables::classes','{\"connection\":\"mysql\",\"modelName\":\"plugins_assignables::classes\",\"type\":\"collection\",\"target\":\"plugins.assignables\",\"originalModelName\":\"classes\",\"schema\":{\"collectionName\":\"plugins_assignables::classes\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"assignableInstance\":{\"type\":\"string\"},\"assignable\":{\"type\":\"string\"},\"class\":{\"type\":\"uuid\"},\"date\":{\"type\":\"datetime\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"assignableInstance\",\"assignable\",\"class\",\"date\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(80,'model::plugins_assignables::dates','{\"connection\":\"mysql\",\"modelName\":\"plugins_assignables::dates\",\"type\":\"collection\",\"target\":\"plugins.assignables\",\"originalModelName\":\"dates\",\"schema\":{\"collectionName\":\"plugins_assignables::dates\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"type\":{\"type\":\"string\"},\"instance\":{\"type\":\"string\"},\"name\":{\"type\":\"string\"},\"date\":{\"type\":\"datetime\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"type\",\"instance\",\"name\",\"date\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(81,'model::plugins_assignables::grades','{\"connection\":\"mysql\",\"modelName\":\"plugins_assignables::grades\",\"type\":\"collection\",\"target\":\"plugins.assignables\",\"originalModelName\":\"grades\",\"schema\":{\"collectionName\":\"plugins_assignables::grades\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"assignation\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"subject\":{\"type\":\"uuid\"},\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"grade\":{\"type\":\"decimal\",\"scale\":7},\"gradedBy\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"feedback\":{\"type\":\"richtext\"},\"visibleToStudent\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":true}},\"date\":{\"type\":\"datetime\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"assignation\",\"subject\",\"type\",\"grade\",\"gradedBy\",\"feedback\",\"visibleToStudent\",\"date\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(82,'model::plugins_assignables::roles','{\"connection\":\"mysql\",\"modelName\":\"plugins_assignables::roles\",\"type\":\"collection\",\"target\":\"plugins.assignables\",\"originalModelName\":\"roles\",\"schema\":{\"collectionName\":\"plugins_assignables::roles\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\"},\"teacherDetailUrl\":{\"type\":\"string\"},\"studentDetailUrl\":{\"type\":\"string\"},\"evaluationDetailUrl\":{\"type\":\"string\"},\"plugin\":{\"type\":\"string\"},\"icon\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"name\",\"teacherDetailUrl\",\"studentDetailUrl\",\"evaluationDetailUrl\",\"plugin\",\"icon\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(83,'model::plugins_assignables::subjects','{\"connection\":\"mysql\",\"modelName\":\"plugins_assignables::subjects\",\"type\":\"collection\",\"target\":\"plugins.assignables\",\"originalModelName\":\"subjects\",\"schema\":{\"collectionName\":\"plugins_assignables::subjects\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"assignable\":{\"type\":\"string\"},\"program\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"subject\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"level\":{\"type\":\"string\"},\"curriculum\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"assignable\",\"program\",\"subject\",\"level\",\"curriculum\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(84,'model::plugins_assignables::teachers','{\"connection\":\"mysql\",\"modelName\":\"plugins_assignables::teachers\",\"type\":\"collection\",\"target\":\"plugins.assignables\",\"originalModelName\":\"teachers\",\"schema\":{\"collectionName\":\"plugins_assignables::teachers\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"assignableInstance\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"teacher\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"type\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"assignableInstance\",\"teacher\",\"type\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(85,'model::plugins_menu-builder::know-how-to-use','{\"connection\":\"mysql\",\"modelName\":\"plugins_menu-builder::know-how-to-use\",\"type\":\"collection\",\"target\":\"plugins.menu-builder\",\"originalModelName\":\"know-how-to-use\",\"schema\":{\"collectionName\":\"plugins_menu-builder::know-how-to-use\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"user\":{\"type\":\"string\",\"options\":{\"unique\":true,\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"user\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(86,'model::plugins_menu-builder::menu-item','{\"connection\":\"mysql\",\"modelName\":\"plugins_menu-builder::menu-item\",\"type\":\"collection\",\"target\":\"plugins.menu-builder\",\"originalModelName\":\"menu-item\",\"schema\":{\"collectionName\":\"plugins_menu-builder::menu-item\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"menuKey\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"key\":{\"type\":\"string\",\"options\":{\"unique\":true,\"notNull\":true}},\"parentKey\":{\"type\":\"string\"},\"pluginName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"order\":{\"type\":\"integer\"},\"fixed\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"iconName\":{\"type\":\"string\"},\"activeIconName\":{\"type\":\"string\"},\"iconSvg\":{\"type\":\"string\"},\"activeIconSvg\":{\"type\":\"string\"},\"iconAlt\":{\"type\":\"string\"},\"url\":{\"type\":\"string\",\"options\":{\"notNull\":false}},\"window\":{\"type\":\"string\",\"options\":{\"defaultTo\":\"SELF\"}},\"disabled\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"menuKey\",\"key\",\"parentKey\",\"pluginName\",\"order\",\"fixed\",\"iconName\",\"activeIconName\",\"iconSvg\",\"activeIconSvg\",\"iconAlt\",\"url\",\"window\",\"disabled\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(87,'model::plugins_menu-builder::menu','{\"connection\":\"mysql\",\"modelName\":\"plugins_menu-builder::menu\",\"type\":\"collection\",\"target\":\"plugins.menu-builder\",\"originalModelName\":\"menu\",\"schema\":{\"collectionName\":\"plugins_menu-builder::menu\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"unique\":true,\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(88,'model::plugins_curriculum::curriculums','{\"connection\":\"mysql\",\"modelName\":\"plugins_curriculum::curriculums\",\"type\":\"collection\",\"target\":\"plugins.curriculum\",\"originalModelName\":\"curriculums\",\"schema\":{\"collectionName\":\"plugins_curriculum::curriculums\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"description\":{\"type\":\"string\"},\"country\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"locale\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"center\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"program\":{\"type\":\"string\"},\"step\":{\"type\":\"integer\"},\"published\":{\"type\":\"boolean\"},\"status\":{\"type\":\"string\",\"enum\":[\"draft\",\"published\",\"archived\"],\"options\":{\"defaultTo\":\"draft\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"description\",\"country\",\"locale\",\"center\",\"program\",\"step\",\"published\",\"status\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(89,'model::plugins_curriculum::configs','{\"connection\":\"mysql\",\"modelName\":\"plugins_curriculum::configs\",\"type\":\"collection\",\"target\":\"plugins.curriculum\",\"originalModelName\":\"configs\",\"schema\":{\"collectionName\":\"plugins_curriculum::configs\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"value\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"value\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(90,'model::plugins_curriculum::node-levels','{\"connection\":\"mysql\",\"modelName\":\"plugins_curriculum::node-levels\",\"type\":\"collection\",\"target\":\"plugins.curriculum\",\"originalModelName\":\"node-levels\",\"schema\":{\"collectionName\":\"plugins_curriculum::node-levels\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"listType\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"levelOrder\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"curriculum\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"type\",\"listType\",\"levelOrder\",\"curriculum\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(91,'model::plugins_curriculum::nodes','{\"connection\":\"mysql\",\"modelName\":\"plugins_curriculum::nodes\",\"type\":\"collection\",\"target\":\"plugins.curriculum\",\"originalModelName\":\"nodes\",\"schema\":{\"collectionName\":\"plugins_curriculum::nodes\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"fullName\":{\"type\":\"string\"},\"nameOrder\":{\"type\":\"string\"},\"academicItem\":{\"type\":\"string\"},\"nodeOrder\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"parentNode\":{\"type\":\"string\"},\"nodeLevel\":{\"type\":\"string\"},\"curriculum\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"fullName\",\"nameOrder\",\"academicItem\",\"nodeOrder\",\"parentNode\",\"nodeLevel\",\"curriculum\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(92,'model::plugins_calendar::calendar-config-calendars','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::calendar-config-calendars\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"calendar-config-calendars\",\"schema\":{\"collectionName\":\"plugins_calendar::calendar-config-calendars\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"calendar\":{\"references\":{\"collection\":\"plugins_calendar::calendars\"}},\"config\":{\"references\":{\"collection\":\"plugins_calendar::calendar-configs\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"calendar\",\"config\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(93,'model::plugins_calendar::calendar-configs','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::calendar-configs\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"calendar-configs\",\"schema\":{\"collectionName\":\"plugins_calendar::calendar-configs\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"title\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"description\":{\"type\":\"string\"},\"addedFrom\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"countryName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"countryShortCode\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"regionShortCode\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"regionName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"startMonth\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"startYear\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"endMonth\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"endYear\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"weekday\":{\"type\":\"integer\",\"options\":{\"notNull\":true}},\"notSchoolDays\":{\"type\":\"json\",\"options\":{\"notNull\":true}},\"schoolDays\":{\"type\":\"json\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"title\",\"description\",\"addedFrom\",\"countryName\",\"countryShortCode\",\"regionShortCode\",\"regionName\",\"startMonth\",\"startYear\",\"endMonth\",\"endYear\",\"weekday\",\"notSchoolDays\",\"schoolDays\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(94,'model::plugins_calendar::calendars','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::calendars\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"calendars\",\"schema\":{\"collectionName\":\"plugins_calendar::calendars\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"unique\":true,\"notNull\":true}},\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"icon\":{\"type\":\"string\"},\"bgColor\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"borderColor\":{\"type\":\"string\"},\"section\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"name\",\"icon\",\"bgColor\",\"borderColor\",\"section\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(95,'model::plugins_calendar::center-calendar-configs','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::center-calendar-configs\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"center-calendar-configs\",\"schema\":{\"collectionName\":\"plugins_calendar::center-calendar-configs\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"center\":{\"references\":{\"collection\":\"plugins_users::centers\"}},\"config\":{\"references\":{\"collection\":\"plugins_calendar::calendar-configs\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"center\",\"config\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(96,'model::plugins_calendar::class-calendar','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::class-calendar\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"class-calendar\",\"schema\":{\"collectionName\":\"plugins_calendar::class-calendar\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"calendar\":{\"references\":{\"collection\":\"plugins_calendar::calendars\"}},\"class\":{\"references\":{\"collection\":\"plugins_academic-portfolio::class\"}},\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"calendar\",\"class\",\"program\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(97,'model::plugins_calendar::event-calendar','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::event-calendar\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"event-calendar\",\"schema\":{\"collectionName\":\"plugins_calendar::event-calendar\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"calendar\":{\"references\":{\"collection\":\"plugins_calendar::calendars\"}},\"event\":{\"references\":{\"collection\":\"plugins_calendar::events\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"calendar\",\"event\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(98,'model::plugins_calendar::event-types','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::event-types\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"event-types\",\"schema\":{\"collectionName\":\"plugins_calendar::event-types\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"unique\":true,\"notNull\":true}},\"url\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"pluginName\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"onlyOneDate\":{\"type\":\"boolean\"},\"order\":{\"type\":\"integer\"},\"config\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"url\",\"pluginName\",\"onlyOneDate\",\"order\",\"config\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(99,'model::plugins_calendar::events','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::events\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"events\",\"schema\":{\"collectionName\":\"plugins_calendar::events\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"title\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"startDate\":{\"type\":\"datetime\"},\"endDate\":{\"type\":\"datetime\"},\"isAllDay\":{\"type\":\"boolean\"},\"repeat\":{\"type\":\"string\"},\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"status\":{\"type\":\"string\",\"options\":{\"notNull\":true,\"defaultTo\":\"active\"}},\"data\":{\"type\":\"json\"},\"isPrivate\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"title\",\"startDate\",\"endDate\",\"isAllDay\",\"repeat\",\"type\",\"status\",\"data\",\"isPrivate\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(100,'model::plugins_calendar::kanban-columns','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::kanban-columns\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"kanban-columns\",\"schema\":{\"collectionName\":\"plugins_calendar::kanban-columns\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"order\":{\"type\":\"number\"},\"isDone\":{\"type\":\"boolean\"},\"isArchived\":{\"type\":\"boolean\"},\"bgColor\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"order\",\"isDone\",\"isArchived\",\"bgColor\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(101,'model::plugins_calendar::kanban-event-orders','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::kanban-event-orders\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"kanban-event-orders\",\"schema\":{\"collectionName\":\"plugins_calendar::kanban-event-orders\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"userAgent\":{\"references\":{\"collection\":\"plugins_users::user-agent\"}},\"column\":{\"references\":{\"collection\":\"plugins_calendar::kanban-columns\"}},\"events\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"userAgent\",\"column\",\"events\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(102,'model::plugins_calendar::notifications','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::notifications\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"notifications\",\"schema\":{\"collectionName\":\"plugins_calendar::notifications\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"event\":{\"references\":{\"collection\":\"plugins_calendar::events\"}},\"date\":{\"type\":\"datetime\",\"options\":{\"notNull\":true}},\"state\":{\"type\":\"enum\",\"enum\":[\"active\",\"sending\",\"sended\",\"error\"],\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"event\",\"date\",\"state\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(103,'model::plugins_calendar::program-calendar','{\"connection\":\"mysql\",\"modelName\":\"plugins_calendar::program-calendar\",\"type\":\"collection\",\"target\":\"plugins.calendar\",\"originalModelName\":\"program-calendar\",\"schema\":{\"collectionName\":\"plugins_calendar::program-calendar\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"calendar\":{\"references\":{\"collection\":\"plugins_calendar::calendars\"}},\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"calendar\",\"program\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(104,'model::plugins_leebrary::bookmarks','{\"connection\":\"mysql\",\"modelName\":\"plugins_leebrary::bookmarks\",\"type\":\"collection\",\"target\":\"plugins.leebrary\",\"originalModelName\":\"bookmarks\",\"schema\":{\"collectionName\":\"plugins_leebrary::bookmarks\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"asset\":{\"specificType\":\"varchar(255)\"},\"url\":{\"type\":\"string\"},\"icon\":{\"references\":{\"collection\":\"plugins_leebrary::files\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"asset\",\"url\",\"icon\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(105,'model::plugins_leebrary::assets','{\"connection\":\"mysql\",\"modelName\":\"plugins_leebrary::assets\",\"type\":\"collection\",\"target\":\"plugins.leebrary\",\"originalModelName\":\"assets\",\"schema\":{\"collectionName\":\"plugins_leebrary::assets\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"tagline\":{\"type\":\"string\"},\"description\":{\"type\":\"richtext\"},\"color\":{\"type\":\"string\"},\"cover\":{\"type\":\"uuid\"},\"fromUser\":{\"references\":{\"collection\":\"plugins_users::users\"}},\"fromUserAgent\":{\"references\":{\"collection\":\"plugins_users::user-agent\"}},\"public\":{\"type\":\"boolean\"},\"category\":{\"references\":{\"collection\":\"plugins_leebrary::categories\"}},\"indexable\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"specificType\":\"varchar(255)\",\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"name\",\"tagline\",\"description\",\"color\",\"cover\",\"fromUser\",\"fromUserAgent\",\"public\",\"category\",\"indexable\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(106,'model::plugins_leebrary::categories','{\"connection\":\"mysql\",\"modelName\":\"plugins_leebrary::categories\",\"type\":\"collection\",\"target\":\"plugins.leebrary\",\"originalModelName\":\"categories\",\"schema\":{\"collectionName\":\"plugins_leebrary::categories\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"pluginOwner\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"creatable\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"createUrl\":{\"type\":\"string\"},\"duplicable\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"provider\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"componentOwner\":{\"type\":\"string\"},\"listCardComponent\":{\"type\":\"string\"},\"listItemComponent\":{\"type\":\"string\"},\"detailComponent\":{\"type\":\"string\"},\"canUse\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"key\",\"pluginOwner\",\"creatable\",\"createUrl\",\"duplicable\",\"provider\",\"componentOwner\",\"listCardComponent\",\"listItemComponent\",\"detailComponent\",\"canUse\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(107,'model::plugins_leebrary::assets-files','{\"connection\":\"mysql\",\"modelName\":\"plugins_leebrary::assets-files\",\"type\":\"collection\",\"target\":\"plugins.leebrary\",\"originalModelName\":\"assets-files\",\"schema\":{\"collectionName\":\"plugins_leebrary::assets-files\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"asset\":{\"specificType\":\"varchar(255)\"},\"file\":{\"references\":{\"collection\":\"plugins_leebrary::files\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"asset\",\"file\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(108,'model::plugins_leebrary::files','{\"connection\":\"mysql\",\"modelName\":\"plugins_leebrary::files\",\"type\":\"collection\",\"target\":\"plugins.leebrary\",\"originalModelName\":\"files\",\"schema\":{\"collectionName\":\"plugins_leebrary::files\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"provider\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"type\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"extension\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"uri\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"metadata\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"provider\",\"type\",\"extension\",\"name\",\"uri\",\"metadata\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(109,'model::plugins_leebrary::pins','{\"connection\":\"mysql\",\"modelName\":\"plugins_leebrary::pins\",\"type\":\"collection\",\"target\":\"plugins.leebrary\",\"originalModelName\":\"pins\",\"schema\":{\"collectionName\":\"plugins_leebrary::pins\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"asset\":{\"specificType\":\"varchar(255)\"},\"userAgent\":{\"references\":{\"collection\":\"plugins_users::user-agent\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"asset\",\"userAgent\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(110,'model::plugins_leebrary::settings','{\"connection\":\"mysql\",\"modelName\":\"plugins_leebrary::settings\",\"type\":\"collection\",\"target\":\"plugins.leebrary\",\"originalModelName\":\"settings\",\"schema\":{\"collectionName\":\"plugins_leebrary::settings\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"defaultCategory\":{\"references\":{\"collection\":\"plugins_leebrary::categories\"}},\"providerName\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"defaultCategory\",\"providerName\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(111,'model::plugins_tests::question-bank-categories','{\"connection\":\"mysql\",\"modelName\":\"plugins_tests::question-bank-categories\",\"type\":\"collection\",\"target\":\"plugins.tests\",\"originalModelName\":\"question-bank-categories\",\"schema\":{\"collectionName\":\"plugins_tests::question-bank-categories\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"questionBank\":{\"type\":\"string\"},\"category\":{\"type\":\"string\"},\"order\":{\"type\":\"number\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"questionBank\",\"category\",\"order\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(112,'model::plugins_tests::assign-saved-config','{\"connection\":\"mysql\",\"modelName\":\"plugins_tests::assign-saved-config\",\"type\":\"collection\",\"target\":\"plugins.tests\",\"originalModelName\":\"assign-saved-config\",\"schema\":{\"collectionName\":\"plugins_tests::assign-saved-config\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\"},\"config\":{\"type\":\"json\"},\"userAgent\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"config\",\"userAgent\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(113,'model::plugins_tests::question-bank-subjects','{\"connection\":\"mysql\",\"modelName\":\"plugins_tests::question-bank-subjects\",\"type\":\"collection\",\"target\":\"plugins.tests\",\"originalModelName\":\"question-bank-subjects\",\"schema\":{\"collectionName\":\"plugins_tests::question-bank-subjects\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"questionBank\":{\"type\":\"string\"},\"subject\":{\"references\":{\"collection\":\"plugins_academic-portfolio::subjects\"}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"questionBank\",\"subject\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(114,'model::plugins_tests::questions-banks','{\"connection\":\"mysql\",\"modelName\":\"plugins_tests::questions-banks\",\"type\":\"collection\",\"target\":\"plugins.tests\",\"originalModelName\":\"questions-banks\",\"schema\":{\"collectionName\":\"plugins_tests::questions-banks\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"required\":true},\"program\":{\"references\":{\"collection\":\"plugins_academic-portfolio::programs\"}},\"published\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"asset\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"specificType\":\"varchar(255)\",\"type\":\"int\"},\"allAttributes\":[\"name\",\"program\",\"published\",\"asset\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(115,'model::plugins_tests::questions-tests','{\"connection\":\"mysql\",\"modelName\":\"plugins_tests::questions-tests\",\"type\":\"collection\",\"target\":\"plugins.tests\",\"originalModelName\":\"questions-tests\",\"schema\":{\"collectionName\":\"plugins_tests::questions-tests\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"test\":{\"type\":\"string\"},\"question\":{\"references\":{\"collection\":\"plugins_tests::questions\"}},\"order\":{\"type\":\"number\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"test\",\"question\",\"order\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(116,'model::plugins_tests::questions','{\"connection\":\"mysql\",\"modelName\":\"plugins_tests::questions\",\"type\":\"collection\",\"target\":\"plugins.tests\",\"originalModelName\":\"questions\",\"schema\":{\"collectionName\":\"plugins_tests::questions\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"questionBank\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"withImages\":{\"type\":\"boolean\"},\"level\":{\"type\":\"string\"},\"question\":{\"type\":\"text\",\"required\":true},\"questionImage\":{\"type\":\"string\"},\"clues\":{\"type\":\"json\"},\"category\":{\"references\":{\"collection\":\"plugins_tests::question-bank-categories\"}},\"properties\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"questionBank\",\"type\",\"withImages\",\"level\",\"question\",\"questionImage\",\"clues\",\"category\",\"properties\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(117,'model::plugins_tests::tests','{\"connection\":\"mysql\",\"modelName\":\"plugins_tests::tests\",\"type\":\"collection\",\"target\":\"plugins.tests\",\"originalModelName\":\"tests\",\"schema\":{\"collectionName\":\"plugins_tests::tests\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\"},\"questionBank\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"level\":{\"type\":\"string\"},\"statement\":{\"type\":\"text\"},\"instructionsForTeacher\":{\"type\":\"text\"},\"instructionsForStudent\":{\"type\":\"text\"},\"filters\":{\"type\":\"text\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"specificType\":\"varchar(255)\",\"type\":\"int\"},\"allAttributes\":[\"name\",\"questionBank\",\"type\",\"level\",\"statement\",\"instructionsForTeacher\",\"instructionsForStudent\",\"filters\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(118,'model::plugins_tests::user-agent-assignable-instance-responses','{\"connection\":\"mysql\",\"modelName\":\"plugins_tests::user-agent-assignable-instance-responses\",\"type\":\"collection\",\"target\":\"plugins.tests\",\"originalModelName\":\"user-agent-assignable-instance-responses\",\"schema\":{\"collectionName\":\"plugins_tests::user-agent-assignable-instance-responses\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"instance\":{\"type\":\"string\"},\"question\":{\"references\":{\"collection\":\"plugins_tests::questions\"}},\"userAgent\":{\"type\":\"string\"},\"clues\":{\"type\":\"integer\"},\"status\":{\"type\":\"string\"},\"points\":{\"type\":\"float\"},\"properties\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"instance\",\"question\",\"userAgent\",\"clues\",\"status\",\"points\",\"properties\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(119,'model::plugins_tests::user-feedback','{\"connection\":\"mysql\",\"modelName\":\"plugins_tests::user-feedback\",\"type\":\"collection\",\"target\":\"plugins.tests\",\"originalModelName\":\"user-feedback\",\"schema\":{\"collectionName\":\"plugins_tests::user-feedback\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"instance\":{\"type\":\"string\"},\"toUserAgent\":{\"type\":\"string\"},\"fromUserAgent\":{\"type\":\"string\"},\"feedback\":{\"type\":\"text\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"instance\",\"toUserAgent\",\"fromUserAgent\",\"feedback\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(120,'model::plugins_tasks::instances','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::instances\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"instances\",\"schema\":{\"collectionName\":\"plugins_tasks::instances\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"task\":{\"type\":\"string\"},\"startDate\":{\"type\":\"datetime\"},\"deadline\":{\"type\":\"datetime\"},\"visualizationDate\":{\"type\":\"datetime\"},\"executionTime\":{\"type\":\"integer\"},\"alwaysOpen\":{\"type\":\"boolean\"},\"closeDate\":{\"type\":\"datetime\"},\"message\":{\"type\":\"richtext\"},\"status\":{\"type\":\"string\"},\"showCurriculum\":{\"type\":\"json\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"task\",\"startDate\",\"deadline\",\"visualizationDate\",\"executionTime\",\"alwaysOpen\",\"closeDate\",\"message\",\"status\",\"showCurriculum\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(121,'model::plugins_tasks::groupsInstances','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::groupsInstances\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"groupsInstances\",\"schema\":{\"collectionName\":\"plugins_tasks::groupsInstances\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"group\":{\"type\":\"string\"},\"instance\":{\"type\":\"uuid\"},\"student\":{\"type\":\"uuid\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"group\",\"instance\",\"student\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(122,'model::plugins_tasks::groups','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::groups\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"groups\",\"schema\":{\"collectionName\":\"plugins_tasks::groups\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"group\":{\"type\":\"string\"},\"type\":{\"type\":\"string\"},\"subject\":{\"type\":\"uuid\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"group\",\"type\",\"subject\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(123,'model::plugins_tasks::attachments','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::attachments\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"attachments\",\"schema\":{\"collectionName\":\"plugins_tasks::attachments\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"task\":{\"type\":\"string\"},\"attachment\":{\"type\":\"uuid\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"task\",\"attachment\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(124,'model::plugins_tasks::profiles','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::profiles\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"profiles\",\"schema\":{\"collectionName\":\"plugins_tasks::profiles\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"key\":{\"type\":\"string\"},\"profile\":{\"type\":\"uuid\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"key\",\"profile\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(125,'model::plugins_tasks::tags','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::tags\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"tags\",\"schema\":{\"collectionName\":\"plugins_tasks::tags\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"task\":{\"type\":\"uuid\"},\"tag\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"task\",\"tag\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(126,'model::plugins_tasks::taskAssessmentCriteria','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::taskAssessmentCriteria\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"taskAssessmentCriteria\",\"schema\":{\"collectionName\":\"plugins_tasks::taskAssessmentCriteria\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"task\":{\"type\":\"string\"},\"assessmentCriteria\":{\"type\":\"string\"},\"subject\":{\"type\":\"uuid\"},\"position\":{\"type\":\"integer\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"task\",\"assessmentCriteria\",\"subject\",\"position\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(127,'model::plugins_tasks::settings','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::settings\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"settings\",\"schema\":{\"collectionName\":\"plugins_tasks::settings\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"hideWelcome\":{\"type\":\"boolean\"},\"configured\":{\"type\":\"boolean\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"hideWelcome\",\"configured\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(128,'model::plugins_tasks::taskContents','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::taskContents\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"taskContents\",\"schema\":{\"collectionName\":\"plugins_tasks::taskContents\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"task\":{\"type\":\"string\"},\"content\":{\"type\":\"string\"},\"subject\":{\"type\":\"uuid\"},\"position\":{\"type\":\"integer\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"task\",\"content\",\"subject\",\"position\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(129,'model::plugins_tasks::taskObjectives','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::taskObjectives\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"taskObjectives\",\"schema\":{\"collectionName\":\"plugins_tasks::taskObjectives\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"task\":{\"type\":\"string\"},\"objective\":{\"type\":\"string\"},\"subject\":{\"type\":\"uuid\"},\"position\":{\"type\":\"integer\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"task\",\"objective\",\"subject\",\"position\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(130,'model::plugins_tasks::taskSubjects','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::taskSubjects\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"taskSubjects\",\"schema\":{\"collectionName\":\"plugins_tasks::taskSubjects\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"task\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"course\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"subject\":{\"type\":\"uuid\",\"options\":{\"notNull\":true}},\"level\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"task\",\"course\",\"subject\",\"level\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(131,'model::plugins_tasks::tasks','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::tasks\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"tasks\",\"schema\":{\"collectionName\":\"plugins_tasks::tasks\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"tagline\":{\"type\":\"string\"},\"level\":{\"type\":\"string\"},\"summary\":{\"type\":\"richtext\"},\"cover\":{\"type\":\"string\"},\"color\":{\"type\":\"string\"},\"methodology\":{\"type\":\"string\"},\"recommendedDuration\":{\"type\":\"integer\"},\"statement\":{\"type\":\"richtext\"},\"development\":{\"type\":\"richtext\"},\"submissions\":{\"type\":\"json\"},\"preTask\":{\"type\":\"string\"},\"preTaskOptions\":{\"type\":\"json\"},\"selfReflection\":{\"type\":\"json\"},\"feedback\":{\"type\":\"json\"},\"instructionsForTeacher\":{\"type\":\"richtext\"},\"instructionsForStudent\":{\"type\":\"richtext\"},\"center\":{\"type\":\"uuid\"},\"program\":{\"type\":\"uuid\"},\"state\":{\"type\":\"string\"},\"published\":{\"type\":\"boolean\",\"options\":{\"defaultTo\":false}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"specificType\":\"varchar(255)\",\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"tagline\",\"level\",\"summary\",\"cover\",\"color\",\"methodology\",\"recommendedDuration\",\"statement\",\"development\",\"submissions\",\"preTask\",\"preTaskOptions\",\"selfReflection\",\"feedback\",\"instructionsForTeacher\",\"instructionsForStudent\",\"center\",\"program\",\"state\",\"published\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(132,'model::plugins_tasks::tasksVersioning','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::tasksVersioning\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"tasksVersioning\",\"schema\":{\"collectionName\":\"plugins_tasks::tasksVersioning\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\"},\"last\":{\"type\":\"string\"},\"current\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"last\",\"current\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(133,'model::plugins_tasks::userDeliverables','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::userDeliverables\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"userDeliverables\",\"schema\":{\"collectionName\":\"plugins_tasks::userDeliverables\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"instance\":{\"type\":\"uuid\"},\"user\":{\"type\":\"uuid\"},\"deliverable\":{\"type\":\"json\"},\"type\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"instance\",\"user\",\"deliverable\",\"type\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(134,'model::plugins_tasks::teacherInstances','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::teacherInstances\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"teacherInstances\",\"schema\":{\"collectionName\":\"plugins_tasks::teacherInstances\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"instance\":{\"type\":\"uuid\"},\"teacher\":{\"type\":\"uuid\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"instance\",\"teacher\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(135,'model::plugins_tasks::tasksVersions','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::tasksVersions\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"tasksVersions\",\"schema\":{\"collectionName\":\"plugins_tasks::tasksVersions\",\"options\":{\"useTimestamps\":false,\"omit\":{\"deleted\":true}},\"attributes\":{\"task\":{\"type\":\"uuid\"},\"major\":{\"type\":\"integer\"},\"minor\":{\"type\":\"integer\"},\"patch\":{\"type\":\"integer\"},\"status\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"task\",\"major\",\"minor\",\"patch\",\"status\",\"id\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(136,'model::plugins_tasks::userInstances','{\"connection\":\"mysql\",\"modelName\":\"plugins_tasks::userInstances\",\"type\":\"collection\",\"target\":\"plugins.tasks\",\"originalModelName\":\"userInstances\",\"schema\":{\"collectionName\":\"plugins_tasks::userInstances\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"instance\":{\"type\":\"uuid\"},\"user\":{\"type\":\"uuid\"},\"opened\":{\"type\":\"datetime\"},\"start\":{\"type\":\"datetime\"},\"end\":{\"type\":\"datetime\"},\"grade\":{\"type\":\"uuid\"},\"teacherFeedback\":{\"type\":\"richtext\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"name\":\"id\",\"type\":\"int\"},\"allAttributes\":[\"instance\",\"user\",\"opened\",\"start\",\"end\",\"grade\",\"teacherFeedback\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(137,'model::providers_emails-smtp::config','{\"connection\":\"mysql\",\"modelName\":\"providers_emails-smtp::config\",\"type\":\"collection\",\"target\":\"providers.emails-smtp\",\"originalModelName\":\"config\",\"schema\":{\"collectionName\":\"providers_emails-smtp::config\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"secure\":{\"type\":\"boolean\"},\"port\":{\"type\":\"number\",\"options\":{\"notNull\":true}},\"host\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"user\":{\"type\":\"string\"},\"pass\":{\"type\":\"string\"},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"secure\",\"port\",\"host\",\"user\",\"pass\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(138,'model::providers_emails-amazon-ses::config','{\"connection\":\"mysql\",\"modelName\":\"providers_emails-amazon-ses::config\",\"type\":\"collection\",\"target\":\"providers.emails-amazon-ses\",\"originalModelName\":\"config\",\"schema\":{\"collectionName\":\"providers_emails-amazon-ses::config\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"name\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"region\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"accessKey\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"secretAccessKey\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"name\",\"region\",\"accessKey\",\"secretAccessKey\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0),(139,'model::providers_leebrary-aws-s3::config','{\"connection\":\"mysql\",\"modelName\":\"providers_leebrary-aws-s3::config\",\"type\":\"collection\",\"target\":\"providers.leebrary-aws-s3\",\"originalModelName\":\"config\",\"schema\":{\"collectionName\":\"providers_leebrary-aws-s3::config\",\"options\":{\"useTimestamps\":true,\"omit\":{\"deleted\":true}},\"attributes\":{\"bucket\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"region\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"accessKey\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"secretAccessKey\":{\"type\":\"string\",\"options\":{\"notNull\":true}},\"deleted\":{\"type\":\"boolean\",\"options\":{\"notNull\":true,\"defaultTo\":false}}},\"primaryKey\":{\"type\":\"uuid\",\"name\":\"id\"},\"allAttributes\":[\"bucket\",\"region\",\"accessKey\",\"secretAccessKey\",\"id\",\"created_at\",\"updated_at\"]},\"connector\":\"bookshelf\"}','Object',NULL,0);
/*!40000 ALTER TABLE `models::core_store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `models::plugins`
--

DROP TABLE IF EXISTS `models::plugins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models::plugins` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` text NOT NULL,
  `version` varchar(11) NOT NULL,
  `source` varchar(8) NOT NULL,
  `isInstalled` tinyint(1) NOT NULL DEFAULT '0',
  `isDisabled` tinyint(1) NOT NULL DEFAULT '0',
  `isSetUp` tinyint(1) NOT NULL DEFAULT '0',
  `needsSetUp` tinyint(1) NOT NULL DEFAULT '0',
  `isUninstalled` tinyint(1) NOT NULL DEFAULT '0',
  `isBroken` tinyint(1) NOT NULL DEFAULT '0',
  `hasUpdate` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `models::plugins_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models::plugins`
--

LOCK TABLES `models::plugins` WRITE;
/*!40000 ALTER TABLE `models::plugins` DISABLE KEYS */;
INSERT INTO `models::plugins` VALUES (1,'academic-portfolio','/private/var/www/leemons/packages/leemons-plugin-academic-portfolio/','0.0.1','external',1,0,0,0,0,0,0,0),(2,'academic-calendar','/private/var/www/leemons/packages/leemons-plugin-academic-calendar/','0.0.1','external',1,0,0,0,0,0,0,0),(3,'assets','/private/var/www/leemons/packages/leemons-plugin-assets/','0.0.1','external',1,0,0,0,0,0,0,0),(4,'admin','/private/var/www/leemons/packages/leemons-plugin-admin/','0.0.1','external',1,0,0,0,0,0,0,0),(5,'assignables','/private/var/www/leemons/packages/leemons-plugin-assignables/','0.0.1','external',1,0,0,0,0,0,0,0),(6,'calendar','/private/var/www/leemons/packages/leemons-plugin-calendar/','0.0.1','external',1,0,0,0,0,0,0,0),(7,'common','/private/var/www/leemons/packages/leemons-plugin-common/','0.0.1','external',1,0,0,0,0,0,0,0),(8,'comunica','/private/var/www/leemons/packages/leemons-plugin-comunica/','0.0.1','external',1,0,0,0,0,0,0,0),(9,'curriculum','/private/var/www/leemons/packages/leemons-plugin-curriculum/','0.0.1','external',1,0,0,0,0,0,0,0),(10,'dashboard','/private/var/www/leemons/packages/leemons-plugin-dashboard/','0.0.1','external',1,0,0,0,0,0,0,0),(11,'dataset','/private/var/www/leemons/packages/leemons-plugin-dataset/','0.0.1','external',1,0,0,0,0,0,0,0),(12,'emails','/private/var/www/leemons/packages/leemons-plugin-emails/','0.0.1','external',1,0,0,0,0,0,0,0),(13,'grades','/private/var/www/leemons/packages/leemons-plugin-grades/','0.0.1','external',1,0,0,0,0,0,0,0),(14,'layout','/private/var/www/leemons/packages/leemons-plugin-layout/','0.0.1','external',1,0,0,0,0,0,0,0),(15,'leebrary','/private/var/www/leemons/packages/leemons-plugin-leebrary/','0.0.1','external',1,0,0,0,0,0,0,0),(16,'menu-builder','/private/var/www/leemons/packages/leemons-plugin-menu-builder/','0.0.1','external',1,0,0,0,0,0,0,0),(17,'multilanguage','/private/var/www/leemons/packages/leemons-plugin-multilanguage/','0.0.1','external',1,0,0,0,0,0,0,0),(18,'package-manager','/private/var/www/leemons/packages/leemons-plugin-package-manager/','0.0.1','external',1,0,0,0,0,0,0,0),(19,'scores','/private/var/www/leemons/packages/leemons-plugin-scores/','0.0.1','external',1,0,0,0,0,0,0,0),(20,'socket-io','/private/var/www/leemons/packages/leemons-plugin-socket-io/','0.0.1','external',1,0,0,0,0,0,0,0),(21,'tasks','/private/var/www/leemons/packages/leemons-plugin-tasks/','0.0.1','external',1,0,0,0,0,0,0,0),(22,'tests','/private/var/www/leemons/packages/leemons-plugin-tests/','0.0.1','external',1,0,0,0,0,0,0,0),(23,'timetable','/private/var/www/leemons/packages/leemons-plugin-timetable/','0.0.1','external',1,0,0,0,0,0,0,0),(24,'users','/private/var/www/leemons/packages/leemons-plugin-users/','0.0.1','external',1,0,0,0,0,0,0,0),(25,'widgets','/private/var/www/leemons/packages/leemons-plugin-widgets/','0.0.1','external',1,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `models::plugins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `models::providers`
--

DROP TABLE IF EXISTS `models::providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models::providers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `path` text NOT NULL,
  `version` varchar(11) NOT NULL,
  `source` varchar(8) NOT NULL,
  `isInstalled` tinyint(1) NOT NULL DEFAULT '0',
  `isDisabled` tinyint(1) NOT NULL DEFAULT '0',
  `isSetUp` tinyint(1) NOT NULL DEFAULT '0',
  `needsSetUp` tinyint(1) NOT NULL DEFAULT '0',
  `isUninstalled` tinyint(1) NOT NULL DEFAULT '0',
  `isBroken` tinyint(1) NOT NULL DEFAULT '0',
  `hasUpdate` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `models::providers_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models::providers`
--

LOCK TABLES `models::providers` WRITE;
/*!40000 ALTER TABLE `models::providers` DISABLE KEYS */;
INSERT INTO `models::providers` VALUES (1,'leebrary-assignables','/private/var/www/leemons/packages/leemons-provider-leebrary-assignables/','0.0.1','external',1,0,0,0,0,0,0,0),(2,'leebrary-tasks','/private/var/www/leemons/packages/leemons-provider-leebrary-tasks/','0.0.1','external',1,0,0,0,0,0,0,0),(3,'leebrary-tests','/private/var/www/leemons/packages/leemons-provider-leebrary-tests/','0.0.1','external',1,0,0,0,0,0,0,0),(4,'leebrary-aws-s3','/private/var/www/leemons/packages/leemons-provider-leebrary-aws-s3/','0.0.1','external',1,0,0,0,0,0,0,0),(5,'emails-smtp','/private/var/www/leemons/packages/leemons-provider-emails-smtp/','0.0.1','external',1,0,0,0,0,0,0,0),(6,'emails-amazon-ses','/private/var/www/leemons/packages/leemons-provider-emails-amazon-ses/','0.0.1','external',1,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `models::providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-calendar::config`
--

DROP TABLE IF EXISTS `plugins_academic-calendar::config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-calendar::config` (
  `id` char(36) NOT NULL,
  `program` varchar(255) DEFAULT NULL,
  `allCoursesHaveSameConfig` tinyint(1) DEFAULT NULL,
  `allCoursesHaveSameDates` tinyint(1) DEFAULT NULL,
  `courseDates` json DEFAULT NULL,
  `allCoursesHaveSameDays` tinyint(1) DEFAULT NULL,
  `courseDays` json DEFAULT NULL,
  `allCoursesHaveSameHours` tinyint(1) DEFAULT NULL,
  `allDaysHaveSameHours` tinyint(1) DEFAULT NULL,
  `courseHours` json DEFAULT NULL,
  `breaks` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-calendar::config`
--

LOCK TABLES `plugins_academic-calendar::config` WRITE;
/*!40000 ALTER TABLE `plugins_academic-calendar::config` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-calendar::config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::class`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::class` (
  `id` char(36) NOT NULL,
  `program` char(36) DEFAULT NULL,
  `subjectType` char(36) DEFAULT NULL,
  `subject` char(36) DEFAULT NULL,
  `class` char(36) DEFAULT NULL,
  `classroom` varchar(255) DEFAULT NULL,
  `seats` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `virtualUrl` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::class`
--

LOCK TABLES `plugins_academic-portfolio::class` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::class-course`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::class-course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::class-course` (
  `id` char(36) NOT NULL,
  `class` char(36) DEFAULT NULL,
  `course` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::class_course_class_foreign` (`class`),
  KEY `plugins_academic_portfolio::class_course_course_foreign` (`course`),
  CONSTRAINT `plugins_academic_portfolio::class_course_class_foreign` FOREIGN KEY (`class`) REFERENCES `plugins_academic-portfolio::class` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_academic_portfolio::class_course_course_foreign` FOREIGN KEY (`course`) REFERENCES `plugins_academic-portfolio::groups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::class-course`
--

LOCK TABLES `plugins_academic-portfolio::class-course` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-course` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::class-group`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::class-group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::class-group` (
  `id` char(36) NOT NULL,
  `class` char(36) DEFAULT NULL,
  `group` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::class_group_class_foreign` (`class`),
  KEY `plugins_academic_portfolio::class_group_group_foreign` (`group`),
  CONSTRAINT `plugins_academic_portfolio::class_group_class_foreign` FOREIGN KEY (`class`) REFERENCES `plugins_academic-portfolio::class` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_academic_portfolio::class_group_group_foreign` FOREIGN KEY (`group`) REFERENCES `plugins_academic-portfolio::groups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::class-group`
--

LOCK TABLES `plugins_academic-portfolio::class-group` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-group` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::class-knowledges`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::class-knowledges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::class-knowledges` (
  `id` char(36) NOT NULL,
  `class` char(36) DEFAULT NULL,
  `knowledge` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::class_knowledges_class_foreign` (`class`),
  KEY `plugins_academic_portfolio::class_knowledges_knowledge_foreign` (`knowledge`),
  CONSTRAINT `plugins_academic_portfolio::class_knowledges_class_foreign` FOREIGN KEY (`class`) REFERENCES `plugins_academic-portfolio::class` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_academic_portfolio::class_knowledges_knowledge_foreign` FOREIGN KEY (`knowledge`) REFERENCES `plugins_academic-portfolio::knowledges` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::class-knowledges`
--

LOCK TABLES `plugins_academic-portfolio::class-knowledges` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-knowledges` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-knowledges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::class-student`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::class-student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::class-student` (
  `id` char(36) NOT NULL,
  `class` char(36) DEFAULT NULL,
  `student` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::class_student_class_foreign` (`class`),
  KEY `plugins_academic_portfolio::class_student_student_foreign` (`student`),
  CONSTRAINT `plugins_academic_portfolio::class_student_class_foreign` FOREIGN KEY (`class`) REFERENCES `plugins_academic-portfolio::class` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_academic_portfolio::class_student_student_foreign` FOREIGN KEY (`student`) REFERENCES `plugins_users::user-agent` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::class-student`
--

LOCK TABLES `plugins_academic-portfolio::class-student` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-student` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::class-substage`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::class-substage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::class-substage` (
  `id` char(36) NOT NULL,
  `class` char(36) DEFAULT NULL,
  `substage` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::class_substage_class_foreign` (`class`),
  KEY `plugins_academic_portfolio::class_substage_substage_foreign` (`substage`),
  CONSTRAINT `plugins_academic_portfolio::class_substage_class_foreign` FOREIGN KEY (`class`) REFERENCES `plugins_academic-portfolio::class` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_academic_portfolio::class_substage_substage_foreign` FOREIGN KEY (`substage`) REFERENCES `plugins_academic-portfolio::groups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::class-substage`
--

LOCK TABLES `plugins_academic-portfolio::class-substage` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-substage` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-substage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::class-teacher`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::class-teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::class-teacher` (
  `id` char(36) NOT NULL,
  `class` char(36) DEFAULT NULL,
  `teacher` char(36) DEFAULT NULL,
  `type` varchar(255) DEFAULT 'associate-teacher',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::class_teacher_class_foreign` (`class`),
  KEY `plugins_academic_portfolio::class_teacher_teacher_foreign` (`teacher`),
  CONSTRAINT `plugins_academic_portfolio::class_teacher_class_foreign` FOREIGN KEY (`class`) REFERENCES `plugins_academic-portfolio::class` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_academic_portfolio::class_teacher_teacher_foreign` FOREIGN KEY (`teacher`) REFERENCES `plugins_users::user-agent` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::class-teacher`
--

LOCK TABLES `plugins_academic-portfolio::class-teacher` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-teacher` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::class-teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::configs`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::configs` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::configs`
--

LOCK TABLES `plugins_academic-portfolio::configs` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::groups`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::groups` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `abbreviation` varchar(255) DEFAULT NULL,
  `index` int DEFAULT NULL,
  `program` char(36) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `number` int DEFAULT NULL,
  `frequency` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::groups_program_foreign` (`program`),
  CONSTRAINT `plugins_academic_portfolio::groups_program_foreign` FOREIGN KEY (`program`) REFERENCES `plugins_academic-portfolio::programs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::groups`
--

LOCK TABLES `plugins_academic-portfolio::groups` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::knowledges`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::knowledges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::knowledges` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `abbreviation` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `program` char(36) DEFAULT NULL,
  `credits_course` int DEFAULT NULL,
  `credits_program` int DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::knowledges_program_foreign` (`program`),
  CONSTRAINT `plugins_academic_portfolio::knowledges_program_foreign` FOREIGN KEY (`program`) REFERENCES `plugins_academic-portfolio::programs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::knowledges`
--

LOCK TABLES `plugins_academic-portfolio::knowledges` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::knowledges` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::knowledges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::program-center`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::program-center`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::program-center` (
  `id` char(36) NOT NULL,
  `program` char(36) DEFAULT NULL,
  `center` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::program_center_program_foreign` (`program`),
  KEY `plugins_academic_portfolio::program_center_center_foreign` (`center`),
  CONSTRAINT `plugins_academic_portfolio::program_center_center_foreign` FOREIGN KEY (`center`) REFERENCES `plugins_users::centers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_academic_portfolio::program_center_program_foreign` FOREIGN KEY (`program`) REFERENCES `plugins_academic-portfolio::programs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::program-center`
--

LOCK TABLES `plugins_academic-portfolio::program-center` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::program-center` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::program-center` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::program-subjects-credits`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::program-subjects-credits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::program-subjects-credits` (
  `id` char(36) NOT NULL,
  `program` char(36) DEFAULT NULL,
  `subject` char(36) DEFAULT NULL,
  `course` char(36) DEFAULT NULL,
  `credits` int DEFAULT NULL,
  `internalId` varchar(255) DEFAULT NULL,
  `compiledInternalId` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::program-subjects-credits`
--

LOCK TABLES `plugins_academic-portfolio::program-subjects-credits` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::program-subjects-credits` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::program-subjects-credits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::programs`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::programs` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `imageUrl` varchar(255) DEFAULT NULL,
  `abbreviation` varchar(255) NOT NULL,
  `credits` int DEFAULT NULL,
  `maxGroupAbbreviation` int NOT NULL,
  `maxGroupAbbreviationIsOnlyNumbers` tinyint(1) DEFAULT '0',
  `maxNumberOfCourses` int DEFAULT '0',
  `courseCredits` int DEFAULT '0',
  `hideCoursesInTree` tinyint(1) DEFAULT '0',
  `moreThanOneAcademicYear` tinyint(1) DEFAULT '0',
  `haveSubstagesPerCourse` tinyint(1) DEFAULT NULL,
  `substagesFrequency` varchar(255) DEFAULT NULL,
  `numberOfSubstages` int DEFAULT '1',
  `useDefaultSubstagesName` tinyint(1) DEFAULT NULL,
  `maxSubstageAbbreviation` int DEFAULT NULL,
  `maxSubstageAbbreviationIsOnlyNumbers` tinyint(1) DEFAULT NULL,
  `haveKnowledge` tinyint(1) DEFAULT NULL,
  `maxKnowledgeAbbreviation` int DEFAULT NULL,
  `maxKnowledgeAbbreviationIsOnlyNumbers` tinyint(1) DEFAULT NULL,
  `subjectsFirstDigit` varchar(255) NOT NULL,
  `subjectsDigits` int NOT NULL,
  `treeType` int DEFAULT '1',
  `evaluationSystem` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::programs`
--

LOCK TABLES `plugins_academic-portfolio::programs` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::programs` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::programs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::settings`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::settings` (
  `id` char(36) NOT NULL,
  `hideWelcome` tinyint(1) DEFAULT NULL,
  `configured` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::settings`
--

LOCK TABLES `plugins_academic-portfolio::settings` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::subject-types`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::subject-types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::subject-types` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `groupVisibility` tinyint(1) NOT NULL,
  `program` char(36) DEFAULT NULL,
  `credits_course` int DEFAULT NULL,
  `credits_program` int DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::subject_types_program_foreign` (`program`),
  CONSTRAINT `plugins_academic_portfolio::subject_types_program_foreign` FOREIGN KEY (`program`) REFERENCES `plugins_academic-portfolio::programs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::subject-types`
--

LOCK TABLES `plugins_academic-portfolio::subject-types` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::subject-types` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::subject-types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_academic-portfolio::subjects`
--

DROP TABLE IF EXISTS `plugins_academic-portfolio::subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_academic-portfolio::subjects` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `program` char(36) DEFAULT NULL,
  `course` char(36) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_academic_portfolio::subjects_program_foreign` (`program`),
  KEY `plugins_academic_portfolio::subjects_course_foreign` (`course`),
  CONSTRAINT `plugins_academic_portfolio::subjects_course_foreign` FOREIGN KEY (`course`) REFERENCES `plugins_academic-portfolio::groups` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_academic_portfolio::subjects_program_foreign` FOREIGN KEY (`program`) REFERENCES `plugins_academic-portfolio::programs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_academic-portfolio::subjects`
--

LOCK TABLES `plugins_academic-portfolio::subjects` WRITE;
/*!40000 ALTER TABLE `plugins_academic-portfolio::subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_academic-portfolio::subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_admin::settings`
--

DROP TABLE IF EXISTS `plugins_admin::settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_admin::settings` (
  `id` char(36) NOT NULL,
  `configured` tinyint(1) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'NONE',
  `lang` varchar(255) DEFAULT 'en',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_admin::settings`
--

LOCK TABLES `plugins_admin::settings` WRITE;
/*!40000 ALTER TABLE `plugins_admin::settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_admin::settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_assignables::assignableInstances`
--

DROP TABLE IF EXISTS `plugins_assignables::assignableInstances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_assignables::assignableInstances` (
  `id` char(36) NOT NULL,
  `assignable` varchar(255) NOT NULL,
  `alwaysAvailable` tinyint(1) NOT NULL,
  `duration` varchar(255) DEFAULT NULL,
  `gradable` tinyint(1) NOT NULL,
  `requiresScoring` tinyint(1) NOT NULL,
  `allowFeedback` tinyint(1) NOT NULL,
  `messageToAssignees` text,
  `curriculum` json DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `relatedAssignableInstances` json DEFAULT NULL,
  `event` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_assignables::assignableInstances`
--

LOCK TABLES `plugins_assignables::assignableInstances` WRITE;
/*!40000 ALTER TABLE `plugins_assignables::assignableInstances` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_assignables::assignableInstances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_assignables::assignables`
--

DROP TABLE IF EXISTS `plugins_assignables::assignables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_assignables::assignables` (
  `id` varchar(255) NOT NULL,
  `asset` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `gradable` tinyint(1) NOT NULL,
  `center` char(36) DEFAULT NULL,
  `statement` text,
  `development` text,
  `duration` varchar(255) DEFAULT NULL,
  `resources` json DEFAULT NULL,
  `submission` json DEFAULT NULL,
  `instructionsForTeachers` text,
  `relatedAssignables` json DEFAULT NULL,
  `instructionsForStudents` text,
  `metadata` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_assignables::assignables`
--

LOCK TABLES `plugins_assignables::assignables` WRITE;
/*!40000 ALTER TABLE `plugins_assignables::assignables` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_assignables::assignables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_assignables::assignations`
--

DROP TABLE IF EXISTS `plugins_assignables::assignations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_assignables::assignations` (
  `id` char(36) NOT NULL,
  `instance` char(36) NOT NULL,
  `indexable` tinyint(1) NOT NULL,
  `user` char(36) NOT NULL,
  `classes` json NOT NULL,
  `group` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_assignables::assignations`
--

LOCK TABLES `plugins_assignables::assignations` WRITE;
/*!40000 ALTER TABLE `plugins_assignables::assignations` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_assignables::assignations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_assignables::classes`
--

DROP TABLE IF EXISTS `plugins_assignables::classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_assignables::classes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `assignableInstance` varchar(255) DEFAULT NULL,
  `assignable` varchar(255) DEFAULT NULL,
  `class` char(36) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_assignables::classes`
--

LOCK TABLES `plugins_assignables::classes` WRITE;
/*!40000 ALTER TABLE `plugins_assignables::classes` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_assignables::classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_assignables::dates`
--

DROP TABLE IF EXISTS `plugins_assignables::dates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_assignables::dates` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `instance` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_assignables::dates`
--

LOCK TABLES `plugins_assignables::dates` WRITE;
/*!40000 ALTER TABLE `plugins_assignables::dates` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_assignables::dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_assignables::grades`
--

DROP TABLE IF EXISTS `plugins_assignables::grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_assignables::grades` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `assignation` char(36) NOT NULL,
  `subject` char(36) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `grade` decimal(8,7) DEFAULT NULL,
  `gradedBy` varchar(255) NOT NULL,
  `feedback` text,
  `visibleToStudent` tinyint(1) NOT NULL DEFAULT '1',
  `date` datetime DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_assignables::grades`
--

LOCK TABLES `plugins_assignables::grades` WRITE;
/*!40000 ALTER TABLE `plugins_assignables::grades` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_assignables::grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_assignables::roles`
--

DROP TABLE IF EXISTS `plugins_assignables::roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_assignables::roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `teacherDetailUrl` varchar(255) DEFAULT NULL,
  `studentDetailUrl` varchar(255) DEFAULT NULL,
  `evaluationDetailUrl` varchar(255) DEFAULT NULL,
  `plugin` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_assignables::roles`
--

LOCK TABLES `plugins_assignables::roles` WRITE;
/*!40000 ALTER TABLE `plugins_assignables::roles` DISABLE KEYS */;
INSERT INTO `plugins_assignables::roles` VALUES (1,'tests','/private/tests/detail/:id','/private/tests/student/:id/:user','/private/tests/result/:id/:user','plugins.tests','/public/tests/menu-icon.svg',0),(2,'task','/','/private/tasks/student-detail/:id/:user','/private/tasks/correction/:id/:user','plugins.tasks','/public/tasks/leebrary-menu-icon.svg',0);
/*!40000 ALTER TABLE `plugins_assignables::roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_assignables::subjects`
--

DROP TABLE IF EXISTS `plugins_assignables::subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_assignables::subjects` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `assignable` varchar(255) DEFAULT NULL,
  `program` char(36) NOT NULL,
  `subject` char(36) NOT NULL,
  `level` varchar(255) DEFAULT NULL,
  `curriculum` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_assignables::subjects`
--

LOCK TABLES `plugins_assignables::subjects` WRITE;
/*!40000 ALTER TABLE `plugins_assignables::subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_assignables::subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_assignables::teachers`
--

DROP TABLE IF EXISTS `plugins_assignables::teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_assignables::teachers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `assignableInstance` char(36) NOT NULL,
  `teacher` char(36) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_assignables::teachers`
--

LOCK TABLES `plugins_assignables::teachers` WRITE;
/*!40000 ALTER TABLE `plugins_assignables::teachers` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_assignables::teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::calendar-config-calendars`
--

DROP TABLE IF EXISTS `plugins_calendar::calendar-config-calendars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::calendar-config-calendars` (
  `id` char(36) NOT NULL,
  `calendar` char(36) DEFAULT NULL,
  `config` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_calendar::calendar_config_calendars_calendar_foreign` (`calendar`),
  KEY `plugins_calendar::calendar_config_calendars_config_foreign` (`config`),
  CONSTRAINT `plugins_calendar::calendar_config_calendars_calendar_foreign` FOREIGN KEY (`calendar`) REFERENCES `plugins_calendar::calendars` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_calendar::calendar_config_calendars_config_foreign` FOREIGN KEY (`config`) REFERENCES `plugins_calendar::calendar-configs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::calendar-config-calendars`
--

LOCK TABLES `plugins_calendar::calendar-config-calendars` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::calendar-config-calendars` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::calendar-config-calendars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::calendar-configs`
--

DROP TABLE IF EXISTS `plugins_calendar::calendar-configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::calendar-configs` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `addedFrom` varchar(255) NOT NULL,
  `countryName` varchar(255) NOT NULL,
  `countryShortCode` varchar(255) NOT NULL,
  `regionShortCode` varchar(255) NOT NULL,
  `regionName` varchar(255) NOT NULL,
  `startMonth` int NOT NULL,
  `startYear` int NOT NULL,
  `endMonth` int NOT NULL,
  `endYear` int NOT NULL,
  `weekday` int NOT NULL,
  `notSchoolDays` json NOT NULL,
  `schoolDays` json NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::calendar-configs`
--

LOCK TABLES `plugins_calendar::calendar-configs` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::calendar-configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::calendar-configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::calendars`
--

DROP TABLE IF EXISTS `plugins_calendar::calendars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::calendars` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `bgColor` varchar(255) NOT NULL,
  `borderColor` varchar(255) DEFAULT NULL,
  `section` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_calendar::calendars_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::calendars`
--

LOCK TABLES `plugins_calendar::calendars` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::calendars` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::calendars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::center-calendar-configs`
--

DROP TABLE IF EXISTS `plugins_calendar::center-calendar-configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::center-calendar-configs` (
  `id` char(36) NOT NULL,
  `center` char(36) DEFAULT NULL,
  `config` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_calendar::center_calendar_configs_center_foreign` (`center`),
  KEY `plugins_calendar::center_calendar_configs_config_foreign` (`config`),
  CONSTRAINT `plugins_calendar::center_calendar_configs_center_foreign` FOREIGN KEY (`center`) REFERENCES `plugins_users::centers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_calendar::center_calendar_configs_config_foreign` FOREIGN KEY (`config`) REFERENCES `plugins_calendar::calendar-configs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::center-calendar-configs`
--

LOCK TABLES `plugins_calendar::center-calendar-configs` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::center-calendar-configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::center-calendar-configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::class-calendar`
--

DROP TABLE IF EXISTS `plugins_calendar::class-calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::class-calendar` (
  `id` char(36) NOT NULL,
  `calendar` char(36) DEFAULT NULL,
  `class` char(36) DEFAULT NULL,
  `program` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_calendar::class_calendar_calendar_foreign` (`calendar`),
  KEY `plugins_calendar::class_calendar_class_foreign` (`class`),
  KEY `plugins_calendar::class_calendar_program_foreign` (`program`),
  CONSTRAINT `plugins_calendar::class_calendar_calendar_foreign` FOREIGN KEY (`calendar`) REFERENCES `plugins_calendar::calendars` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_calendar::class_calendar_class_foreign` FOREIGN KEY (`class`) REFERENCES `plugins_academic-portfolio::class` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_calendar::class_calendar_program_foreign` FOREIGN KEY (`program`) REFERENCES `plugins_academic-portfolio::programs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::class-calendar`
--

LOCK TABLES `plugins_calendar::class-calendar` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::class-calendar` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::class-calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::event-calendar`
--

DROP TABLE IF EXISTS `plugins_calendar::event-calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::event-calendar` (
  `id` char(36) NOT NULL,
  `calendar` char(36) DEFAULT NULL,
  `event` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_calendar::event_calendar_calendar_foreign` (`calendar`),
  KEY `plugins_calendar::event_calendar_event_foreign` (`event`),
  CONSTRAINT `plugins_calendar::event_calendar_calendar_foreign` FOREIGN KEY (`calendar`) REFERENCES `plugins_calendar::calendars` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_calendar::event_calendar_event_foreign` FOREIGN KEY (`event`) REFERENCES `plugins_calendar::events` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::event-calendar`
--

LOCK TABLES `plugins_calendar::event-calendar` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::event-calendar` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::event-calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::event-types`
--

DROP TABLE IF EXISTS `plugins_calendar::event-types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::event-types` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `pluginName` varchar(255) NOT NULL,
  `onlyOneDate` tinyint(1) DEFAULT NULL,
  `order` int DEFAULT NULL,
  `config` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_calendar::event_types_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::event-types`
--

LOCK TABLES `plugins_calendar::event-types` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::event-types` DISABLE KEYS */;
INSERT INTO `plugins_calendar::event-types` VALUES ('a6b6f401-a126-4b25-8cbc-263fb2035307','plugins.calendar.event','event','calendar',NULL,1,'{\"titleLabel\": \"plugins.calendar.eventTitleLabel\"}',0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('f7fa2bd2-05a5-457e-b403-7770195a20a6','plugins.calendar.task','task','calendar',1,2,'{\"fromLabel\": \"plugins.calendar.fromLabelDeadline\", \"hideAllDay\": true, \"hideRepeat\": true, \"titleLabel\": \"plugins.calendar.taskTitleLabel\", \"titlePlaceholder\": \"plugins.calendar.taskPlaceholder\"}',0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL);
/*!40000 ALTER TABLE `plugins_calendar::event-types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::events`
--

DROP TABLE IF EXISTS `plugins_calendar::events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::events` (
  `id` char(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `isAllDay` tinyint(1) DEFAULT NULL,
  `repeat` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `data` json DEFAULT NULL,
  `isPrivate` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::events`
--

LOCK TABLES `plugins_calendar::events` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::events` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::kanban-columns`
--

DROP TABLE IF EXISTS `plugins_calendar::kanban-columns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::kanban-columns` (
  `id` char(36) NOT NULL,
  `order` float(8,2) DEFAULT NULL,
  `isDone` tinyint(1) DEFAULT NULL,
  `isArchived` tinyint(1) DEFAULT NULL,
  `bgColor` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::kanban-columns`
--

LOCK TABLES `plugins_calendar::kanban-columns` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::kanban-columns` DISABLE KEYS */;
INSERT INTO `plugins_calendar::kanban-columns` VALUES ('035eaf84-9d34-4694-b5e2-6d200897e3c3',2.00,0,0,'#7ddecf',0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('2bd31e4e-010c-43e6-b94d-2c8d3389b44f',6.00,0,1,'#a1a1a1',0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('7be176da-8dc8-4fdb-aebf-1a42d5e03580',5.00,1,0,'#83de7d',0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('887d529a-c1a8-41d6-9fc1-31a65199a192',1.00,0,0,'#a47dde',0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('a8c1e332-dba0-41a5-bc75-a0793a59bcf0',3.00,0,0,'#7d9fde',0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('cdd402ea-0555-4a20-911a-05171d7c0641',4.00,0,0,'#83de7d',0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL);
/*!40000 ALTER TABLE `plugins_calendar::kanban-columns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::kanban-event-orders`
--

DROP TABLE IF EXISTS `plugins_calendar::kanban-event-orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::kanban-event-orders` (
  `id` char(36) NOT NULL,
  `userAgent` char(36) DEFAULT NULL,
  `column` char(36) DEFAULT NULL,
  `events` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_calendar::kanban_event_orders_useragent_foreign` (`userAgent`),
  KEY `plugins_calendar::kanban_event_orders_column_foreign` (`column`),
  CONSTRAINT `plugins_calendar::kanban_event_orders_column_foreign` FOREIGN KEY (`column`) REFERENCES `plugins_calendar::kanban-columns` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_calendar::kanban_event_orders_useragent_foreign` FOREIGN KEY (`userAgent`) REFERENCES `plugins_users::user-agent` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::kanban-event-orders`
--

LOCK TABLES `plugins_calendar::kanban-event-orders` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::kanban-event-orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::kanban-event-orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::notifications`
--

DROP TABLE IF EXISTS `plugins_calendar::notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::notifications` (
  `id` char(36) NOT NULL,
  `event` char(36) DEFAULT NULL,
  `date` datetime NOT NULL,
  `state` enum('active','sending','sended','error') NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_calendar::notifications_event_foreign` (`event`),
  CONSTRAINT `plugins_calendar::notifications_event_foreign` FOREIGN KEY (`event`) REFERENCES `plugins_calendar::events` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::notifications`
--

LOCK TABLES `plugins_calendar::notifications` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_calendar::program-calendar`
--

DROP TABLE IF EXISTS `plugins_calendar::program-calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_calendar::program-calendar` (
  `id` char(36) NOT NULL,
  `calendar` char(36) DEFAULT NULL,
  `program` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_calendar::program_calendar_calendar_foreign` (`calendar`),
  KEY `plugins_calendar::program_calendar_program_foreign` (`program`),
  CONSTRAINT `plugins_calendar::program_calendar_calendar_foreign` FOREIGN KEY (`calendar`) REFERENCES `plugins_calendar::calendars` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_calendar::program_calendar_program_foreign` FOREIGN KEY (`program`) REFERENCES `plugins_academic-portfolio::programs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_calendar::program-calendar`
--

LOCK TABLES `plugins_calendar::program-calendar` WRITE;
/*!40000 ALTER TABLE `plugins_calendar::program-calendar` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_calendar::program-calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_common::currentVersions`
--

DROP TABLE IF EXISTS `plugins_common::currentVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_common::currentVersions` (
  `id` char(36) NOT NULL,
  `published` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_common::currentVersions`
--

LOCK TABLES `plugins_common::currentVersions` WRITE;
/*!40000 ALTER TABLE `plugins_common::currentVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_common::currentVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_common::tags`
--

DROP TABLE IF EXISTS `plugins_common::tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_common::tags` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `tag` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_common::tags`
--

LOCK TABLES `plugins_common::tags` WRITE;
/*!40000 ALTER TABLE `plugins_common::tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_common::tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_common::versions`
--

DROP TABLE IF EXISTS `plugins_common::versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_common::versions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `major` float(8,2) NOT NULL,
  `minor` float(8,2) NOT NULL,
  `patch` float(8,2) NOT NULL,
  `published` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_common::versions`
--

LOCK TABLES `plugins_common::versions` WRITE;
/*!40000 ALTER TABLE `plugins_common::versions` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_common::versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_comunica::message`
--

DROP TABLE IF EXISTS `plugins_comunica::message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_comunica::message` (
  `id` char(36) NOT NULL,
  `room` varchar(255) NOT NULL,
  `userAgent` varchar(255) NOT NULL,
  `message` json DEFAULT NULL,
  `isEncrypt` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_comunica::message`
--

LOCK TABLES `plugins_comunica::message` WRITE;
/*!40000 ALTER TABLE `plugins_comunica::message` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_comunica::message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_comunica::room`
--

DROP TABLE IF EXISTS `plugins_comunica::room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_comunica::room` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `useEncrypt` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_comunica::room_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_comunica::room`
--

LOCK TABLES `plugins_comunica::room` WRITE;
/*!40000 ALTER TABLE `plugins_comunica::room` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_comunica::room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_comunica::roomMessagesUnRead`
--

DROP TABLE IF EXISTS `plugins_comunica::roomMessagesUnRead`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_comunica::roomMessagesUnRead` (
  `id` char(36) NOT NULL,
  `room` varchar(255) NOT NULL,
  `userAgent` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_comunica::roomMessagesUnRead`
--

LOCK TABLES `plugins_comunica::roomMessagesUnRead` WRITE;
/*!40000 ALTER TABLE `plugins_comunica::roomMessagesUnRead` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_comunica::roomMessagesUnRead` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_comunica::userAgentInRoom`
--

DROP TABLE IF EXISTS `plugins_comunica::userAgentInRoom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_comunica::userAgentInRoom` (
  `id` char(36) NOT NULL,
  `room` varchar(255) NOT NULL,
  `userAgent` varchar(255) NOT NULL,
  `encryptKey` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_comunica::userAgentInRoom`
--

LOCK TABLES `plugins_comunica::userAgentInRoom` WRITE;
/*!40000 ALTER TABLE `plugins_comunica::userAgentInRoom` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_comunica::userAgentInRoom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_curriculum::configs`
--

DROP TABLE IF EXISTS `plugins_curriculum::configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_curriculum::configs` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_curriculum::configs`
--

LOCK TABLES `plugins_curriculum::configs` WRITE;
/*!40000 ALTER TABLE `plugins_curriculum::configs` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_curriculum::configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_curriculum::curriculums`
--

DROP TABLE IF EXISTS `plugins_curriculum::curriculums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_curriculum::curriculums` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `country` varchar(255) NOT NULL,
  `locale` varchar(255) NOT NULL,
  `center` char(36) DEFAULT NULL,
  `program` varchar(255) DEFAULT NULL,
  `step` int DEFAULT NULL,
  `published` tinyint(1) DEFAULT NULL,
  `status` varchar(255) DEFAULT 'draft',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_curriculum::curriculums_center_foreign` (`center`),
  CONSTRAINT `plugins_curriculum::curriculums_center_foreign` FOREIGN KEY (`center`) REFERENCES `plugins_users::centers` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_curriculum::curriculums`
--

LOCK TABLES `plugins_curriculum::curriculums` WRITE;
/*!40000 ALTER TABLE `plugins_curriculum::curriculums` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_curriculum::curriculums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_curriculum::node-levels`
--

DROP TABLE IF EXISTS `plugins_curriculum::node-levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_curriculum::node-levels` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `listType` varchar(255) NOT NULL,
  `levelOrder` int NOT NULL,
  `curriculum` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_curriculum::node-levels`
--

LOCK TABLES `plugins_curriculum::node-levels` WRITE;
/*!40000 ALTER TABLE `plugins_curriculum::node-levels` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_curriculum::node-levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_curriculum::nodes`
--

DROP TABLE IF EXISTS `plugins_curriculum::nodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_curriculum::nodes` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `fullName` varchar(255) DEFAULT NULL,
  `nameOrder` varchar(255) DEFAULT NULL,
  `academicItem` varchar(255) DEFAULT NULL,
  `nodeOrder` int NOT NULL,
  `parentNode` varchar(255) DEFAULT NULL,
  `nodeLevel` varchar(255) DEFAULT NULL,
  `curriculum` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_curriculum::nodes`
--

LOCK TABLES `plugins_curriculum::nodes` WRITE;
/*!40000 ALTER TABLE `plugins_curriculum::nodes` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_curriculum::nodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_dataset::dataset`
--

DROP TABLE IF EXISTS `plugins_dataset::dataset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_dataset::dataset` (
  `id` char(36) NOT NULL,
  `pluginName` varchar(255) NOT NULL,
  `locationName` varchar(255) NOT NULL,
  `jsonSchema` text,
  `jsonUI` text,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_dataset::dataset`
--

LOCK TABLES `plugins_dataset::dataset` WRITE;
/*!40000 ALTER TABLE `plugins_dataset::dataset` DISABLE KEYS */;
INSERT INTO `plugins_dataset::dataset` VALUES ('f48695c3-9659-4e4f-849f-864baa5ea204','plugins.users','user-data',NULL,NULL,0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL);
/*!40000 ALTER TABLE `plugins_dataset::dataset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_dataset::dataset-values`
--

DROP TABLE IF EXISTS `plugins_dataset::dataset-values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_dataset::dataset-values` (
  `id` char(36) NOT NULL,
  `pluginName` varchar(255) NOT NULL,
  `locationName` varchar(255) NOT NULL,
  `target` varchar(255) DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `value` json DEFAULT NULL,
  `searchableValueString` text,
  `searchableValueNumber` text,
  `metadata` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_dataset::dataset-values`
--

LOCK TABLES `plugins_dataset::dataset-values` WRITE;
/*!40000 ALTER TABLE `plugins_dataset::dataset-values` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_dataset::dataset-values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_emails::config`
--

DROP TABLE IF EXISTS `plugins_emails::config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_emails::config` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_emails::config_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_emails::config`
--

LOCK TABLES `plugins_emails::config` WRITE;
/*!40000 ALTER TABLE `plugins_emails::config` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_emails::config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_emails::email-template`
--

DROP TABLE IF EXISTS `plugins_emails::email-template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_emails::email-template` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `templateName` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_emails::email_template_name_unique` (`name`),
  UNIQUE KEY `plugins_emails::email_template_templatename_unique` (`templateName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_emails::email-template`
--

LOCK TABLES `plugins_emails::email-template` WRITE;
/*!40000 ALTER TABLE `plugins_emails::email-template` DISABLE KEYS */;
INSERT INTO `plugins_emails::email-template` VALUES ('23bd61fe-2d08-44af-983c-9cbf00da09b6','user-recover-password','user-recover-password',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('2ad151a7-3455-43b7-8f0a-717171a05298','user-new-profile-added','user-new-profile-added',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('3dab39f3-0cd9-4779-a029-5808d1a8e36f','user-reset-password','user-reset-password',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('53877925-6fc1-41d0-9749-889fdf1e1037','test-email','test-email',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('c70dcefe-022c-4d40-8990-65fa4878d044','user-welcome','user-welcome',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('ecec4eb9-c62c-4b13-ac76-852b9908cd92','user-create-assignation','user-create-assignation',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL);
/*!40000 ALTER TABLE `plugins_emails::email-template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_emails::email-template-detail`
--

DROP TABLE IF EXISTS `plugins_emails::email-template-detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_emails::email-template-detail` (
  `id` char(36) NOT NULL,
  `template` char(36) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `language` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `html` mediumtext NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_emails::email_template_detail_template_foreign` (`template`),
  CONSTRAINT `plugins_emails::email_template_detail_template_foreign` FOREIGN KEY (`template`) REFERENCES `plugins_emails::email-template` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_emails::email-template-detail`
--

LOCK TABLES `plugins_emails::email-template-detail` WRITE;
/*!40000 ALTER TABLE `plugins_emails::email-template-detail` DISABLE KEYS */;
INSERT INTO `plugins_emails::email-template-detail` VALUES ('0042ca8b-9235-417a-b47f-b8e13dc0a7a2','c70dcefe-022c-4d40-8990-65fa4878d044','active','en','Welcome','\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <meta name=\"robots\" content=\"noindex,nofollow\">\n    <meta property=\"og:title\" content=\"leemons\">\n\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\'https://fonts.googleapis.com/css?family=Lexend\' rel=\'stylesheet\'>\n    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap\" rel=\"stylesheet\">\n\n\n    <style type=\"text/css\">\n        body {\n            margin: 0 !important;\n            padding: 0 !important;\n            width: 100% !important;\n        }\n\n        h1, h2, p {\n            margin: 0 !important;\n        }\n    </style>\n</head>\n<body class=\"body\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n    <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"max-width: 600px\">\n        <tr>\n            <td>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 10px 0;\">\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                      <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family:\'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 20px; line-height: 25px; font-weight: 400; color: #212B3D;\">\n                          Welcome to {{it.__platformName}}\n                      </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <img src=\"{{it.__logoUrl}}\" />\n                        </td>\n                    </tr>\n\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 16px; line-height: 20px; font-weight: 600; color: #212B3D;\">\n                            Click on the following link to create your password and access your account\n                        </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <a href=\"{{it.url}}\" target=\"_blank\" style=\"text-decoration: none; font-size: 14px; line-height: 18px; font-weight: 600; color: #fff; background-color: #3B76CC; padding: 10px 30px; border-radius: 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                                Set up account\n                            </a>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 25px 45px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                            This link will expire in {{it.expDays}} days and can only be used once.\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 15px 25px;\">\n                            <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 25px 25px 8px; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                                        If the button above doesn’t work, paste this link into your web browser\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 8px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                                        <a href=\"{{it.url}}\" target=\"_blank\" style=\"font-size: 14px; line-height: 18px; font-weight: 400; color: #3B76CC; padding: 10px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                                            {{it.url}}\n                                        </a>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 8px 25px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 13px; line-height: 16px; font-weight: 400; color: #636D7D;\">\n                                        If you did not make this request, you can safely ignore this email.\n                                    </td>\n                                </tr>\n                            </table>\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 20px 25px;\">\n                            <a href=\"#\" target=\"_blank\" style=\"text-decoration: none; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 18px; font-weight: 400; color: #636D7D;\">\n                                \n                            </a>\n                        </td>\n                    </tr>\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 50px 0;\">\n                        </td>\n                    </tr>\n                </table>\n            </td>\n        </tr>\n    </table>\n</body>\n</html>\n  ',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('1f1f2ccc-c12d-4586-b5e2-e305db7179a4','2ad151a7-3455-43b7-8f0a-717171a05298','active','en','New profile','\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <meta name=\"robots\" content=\"noindex,nofollow\">\n    <meta property=\"og:title\" content=\"leemons\">\n\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\'https://fonts.googleapis.com/css?family=Lexend\' rel=\'stylesheet\'>\n    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap\" rel=\"stylesheet\">\n\n\n    <style type=\"text/css\">\n        body {\n            margin: 0 !important;\n            padding: 0 !important;\n            width: 100% !important;\n        }\n\n        h1, h2, p {\n            margin: 0 !important;\n        }\n    </style>\n</head>\n<body class=\"body\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n    <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"max-width: 600px\">\n        <tr>\n            <td>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 10px 0;\">\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                      <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family:\'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 20px; line-height: 25px; font-weight: 400; color: #212B3D;\">\n                          Hi, {{it.userName}}\n                      </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <img src=\"{{it.__logoUrl}}\" />\n                        </td>\n                    </tr>\n\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 16px; line-height: 20px; font-weight: 600; color: #212B3D;\">\n                            You have been added to the profile of {{it.profileName}}\n                        </td>\n                    </tr>\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 20px 25px;\">\n                            <a href=\"#\" target=\"_blank\" style=\"text-decoration: none; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 18px; font-weight: 400; color: #636D7D;\">\n                                \n                            </a>\n                        </td>\n                    </tr>\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 50px 0;\">\n                        </td>\n                    </tr>\n                </table>\n            </td>\n        </tr>\n    </table>\n</body>\n</html>\n  ',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('1f5d8298-80f2-4ad1-96ae-6dbbd1ee9f44','3dab39f3-0cd9-4779-a029-5808d1a8e36f','active','es','Su contraseña fue restablecida','\n  <html>\n    <head>\n      <style></style>\n    </head>\n     <body>\n     <h1>Hola {{it.name}}</h1>\n     <h5>Tu contraseña ha sido restablecida.</h5>\n     <p>Queríamos informarte de que tu contraseña de Leemons ha sido restablecida.</p>\n     <a href=\"{{it.loginUrl}}\">Ir a iniciar sesion</a>\n     <p>Por favor, no responda a este correo electrónico con su contraseña. Nunca le pediremos su contraseña, y le desaconsejamos que la comparta con nadie</p>\n     </body>\n  </html>\n  ',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('30174777-2e76-4380-a21e-2c8d358fa29f','53877925-6fc1-41d0-9749-889fdf1e1037','active','en','Test email','\n  <html>\n    <head>\n      <style></style>\n    </head>\n     <body>\n     This is an example text to check that you receive the e-mails\n     </body>\n  </html>\n  ',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('33613539-88bd-4056-8509-73761b54c07f','53877925-6fc1-41d0-9749-889fdf1e1037','active','es','Email de prueba','\n  <html>\n    <head>\n      <style></style>\n    </head>\n     <body>\n     Esto es un texto de ejemplo para comprobar que te llegan los emails\n     </body>\n  </html>\n  ',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('4d7aa30b-4ccf-492b-aa00-ace58ddf7bef','ecec4eb9-c62c-4b13-ac76-852b9908cd92','active','en','New activity','\n  <!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n  <head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n\n    <meta name=\"robots\" content=\"noindex,nofollow\" />\n    <meta property=\"og:title\" content=\"leemons\" />\n\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n    <link\n      href=\"https://fonts.googleapis.com/css?family=Lexend\"\n      rel=\"stylesheet\"\n    />\n    <link\n      href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap\"\n      rel=\"stylesheet\"\n    />\n\n    <style type=\"text/css\">\n      body {\n        margin: 0 !important;\n        padding: 0 !important;\n        width: 100% !important;\n      }\n\n      h1,\n      h2,\n      p {\n        margin: 0 !important;\n      }\n    </style>\n  </head>\n  <body class=\"body\" bgcolor=\"#fff\" style=\"background-color: #fff\">\n    <table\n      cellpadding=\"0\"\n      cellspacing=\"0\"\n      align=\"center\"\n      width=\"100%\"\n      bgcolor=\"#fff\"\n      style=\"max-width: 600px\"\n    >\n      <tr>\n        <td>\n          <table\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            align=\"center\"\n            width=\"100%\"\n            bgcolor=\"#F7F8FA\"\n            style=\"background-color: #f7f8fa\"\n          >\n            <tr>\n              <td style=\"padding: 10px 0\"></td>\n            </tr>\n          </table>\n\n          <table\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            align=\"center\"\n            width=\"100%\"\n            bgcolor=\"#F7F8FA\"\n            style=\"background-color: #f7f8fa\"\n          >\n          <tr>\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 32px 45px 0px;\n                  font-family: \'Lexend\', Century Gothic, CenturyGothic,\n                    AppleGothic, sans-serif;\n                  font-size: 20px;\n                  line-height: 25px;\n                  font-weight: 400;\n                  color: #212b3d;\n                \"\n              >\n                You have a new pending activity\n              </td>\n            </tr>\n            <tr>\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 10px 45px 0px;\n                  font-family: \'Lexend\', Century Gothic, CenturyGothic,\n                    AppleGothic, sans-serif;\n                \"\n              >\n                <img\n                  src=\"{{it.__logoUrl}}\"\n                  height=\"96\"\n                  width=\"96\"\n                  style=\"border-radius: 50%\"\n                />\n              </td>\n            </tr>\n            <tr>\n            {{ @if (it.instance.messageToAssignees) }}\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 24px 45px 32px;\n                  font-family: \'Inter\', Verdana, sans-serif;\n                  font-size: 18px;\n                  line-height: 22.4px;\n                  font-weight: 600;\n                  color: #5b6577;\n                \"\n              >\n               {{*it.instance.messageToAssignees}}\n              </td>\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 24px 45px 32px;\n                  font-family: \'Inter\', Verdana, sans-serif;\n                  font-size: 14px;\n                  line-height: 22.4px;\n                  color: #212B3D;\n                \"\n              >\n               {{it.userSession.name}} {{it.userSession.surnames}}\n              </td>\n              {{ #else }}\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 24px 45px 32px;\n                  font-family: \'Inter\', Verdana, sans-serif;\n                  font-size: 14px;\n                  line-height: 22.4px;\n                  color: #5b6577;\n                \"\n              >\n               This information may have changed, always check your current activities so you don\'t miss anything.\n              </td>\n              {{ /if}}\n            </tr>\n          </table>\n          <table\n        cellpadding=\"0\"\n        cellspacing=\"0\"\n        align=\"center\"\n        width=\"100%\"\n        bgcolor=\"#F7F8FA\"\n        style=\"background-color: #f7f8fa\"\n      >\n        <tr>\n          <td align=\"center\" style=\"text-align: center; padding: 15px 25px\">\n            <table\n              cellpadding=\"0\"\n              cellspacing=\"0\"\n              align=\"center\"\n              width=\"100%\"\n              bgcolor=\"#fff\"\n              style=\"background-color: #fff\"\n            >\n              <!-- CARTA -->\n              <tr>\n                <td align=\"center\" style=\"padding-top: 24px\">\n                  <div\n                    style=\"\n                          background-color: white;\n                          border-radius: 4px;\n                          border: 2px solid #f7f8fa;\n                          filter: drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.1));\n                          width: 354px;\n                          height: 352px;\n                        \"\n                  >\n                    <div\n                      style=\"width: 100%; height: 180px; position: relative; background-size: cover; background-image: url(\'{{ it.instance.assignable.asset.url }}\')\"\n                    >\n                      <div style=\"display: flex;height: 100%\">\n                        <div\n                          style=\"\n                              width: 100%;\n                              height: 100%;\n                              background: rgba(247, 248, 250, 0.8);\n                              backdrop-filter: blur(20px);\n                              border-top-left-radius: 2px;\n                            \"\n                        >\n                          <div\n                            style=\"\n                                display: flex;\n                                height: 100%;\n                                justify-content: flex-end;\n                                border-top: 8px solid #dc5571;\n                              \"\n                          >\n                            <div\n                              style=\"\n                                  text-align: start;\n                                  padding: 12px;\n                                \"\n                            >\n                              <div\n                                style=\"\n                                    display: inline;\n                                    width: fit-content;\n                                    padding: 4px 8px;\n                                    background-color: white;\n                                    border-radius: 4px;\n                                    font-size: 13px;\n                                    margin-bottom: 8px;\n                                  \"\n                              >\n                                  <span\n                                    style=\"\n                                      font-family: \'Inter\', Verdana, sans-serif;\n                                      font-size: 16px;\n                                      line-height: 20px;\n                                      color: #212b3d;\n                                    \"\n                                  >NEW</span\n                                  >\n                              </div>\n                              <div\n                                style=\"\n                                    display: flex;\n                                    gap: 8px;\n                                    margin-top: 8px;\n                                    margin-bottom: 8px;\n                                    align-items: center;\n                                  \"\n                              >\n                                <div\n                                  style=\"\n                                      height: 20px;\n                                      width: 20px;\n                                      border-radius: 50%;\n                                      text-align: center;\n                                        line-height: 20px;\n                                      {{ @if (it.classes.length === 1) }}\n                                        background-color: {{ it.classes[0].color }};\n                                      {{ #else }}\n                                        background-color: #67728E;\n                                      {{ /if}}\n\n                                    \"\n                                >\n\n                                {{ @if (it.subjectIconUrl) }}\n                                        <img src=\"{{it.subjectIconUrl}}\" width=\"13px\" height=\"13px\" style=\"filter: brightness(0) invert(1)\" />\n                                      {{ #else }}\n\n                                      {{ /if}}\n\n</div>\n                                <span\n                                  style=\"\n                                      font-family: \'Inter\', Verdana, sans-serif;\n                                      font-size: 13px;\n                                      line-height: 20px;\n                                       width: 135px;\n                                       padding-left: 8px;\n                                        \"\n                                >\n                                {{ @if (it.classes.length === 1) }}\n                                    {{ it.classes[0].subject.name }}\n                                {{ #else }}\n                                  Multi-Subject\n                                {{ /if}}\n                                    </span>\n                              </div>\n                              <span\n                                style=\"\n                                    display: block;\n                                    font-family: \'Lexend\', Verdana, sans-serif;\n                                    font-size: 16px;\n                                    line-height: 20px;\n                                    font-weight: 600;\n                                    color: #212b3d;\n                                    margin-top: 8px;\n\n                                  \"\n                              >{{it.instance.assignable.asset.name}}</span>\n                            </div>\n                          </div>\n                        </div>\n                        <div\n                          style=\"\n                              background-color: white;\n                              text-align: left;\n                              padding: 8px;\n                              height: 50px;\n                              width: 100%;\n                              margin-top: 130px;\n                            \"\n                        >\n                          <div\n                            style=\"\n                                font-family: \'Inter\', Verdana, sans-serif;\n                                font-size: 12px;\n                                line-height: 20px;\n                                font-weight: 600;\n                                color: #31753b;\n                              \"\n                          >Start activity\n                          </div\n                          >\n                          {{ @if (it.taskDate) }}\n                             <div\n                            style=\"\n                                font-family: \'Inter\', Verdana, sans-serif;\n                                font-size: 12.5px;\n                                line-height: 14px;\n                                color: #5b6577;\n                              \"\n                          >Delivery: {{it.taskDate}}\n                          </div>\n                           {{ /if}}\n\n                        </div>\n                      </div>\n                    </div>\n                    <div style=\"padding: 16px; text-align: start\">\n                          <span\n                            style=\"\n                              font-family: \'Inter\', Verdana, sans-serif;\n                              font-size: 12.5px;\n                              line-height: 16.5px;\n                              color: #5b6577;\n                            \"\n                          >{{ @if (it.instance.assignable.asset.description) }}\n                             {{ it.instance.assignable.asset.description }}\n                           {{ /if}}</span>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <!-- TABLA -->\n              <!--\n              <tr>\n                <td\n                  align=\"center\"\n                  style=\"padding-top: 16px; padding-inline: 38.5px\"\n                >\n                  <div\n                    style=\"\n                          text-align: start;\n                        \"\n                  >\n                        <span\n                          style=\"\n                            padding: 5px 16px 8px;\n                            font-family: \'Inter\', Verdana, sans-serif;\n                            font-size: 14px;\n                            line-height: 24px;\n                            font-weight: 600;\n                            color: #212b3d;\n                          \"\n                        >Upcoming deliveries</span\n                        >\n                    <div\n                      style=\"\n                            display: flex;\n                            padding: 6px 16px;\n                            align-items: center;\n                            border-top: 2px solid #edeff5;\n                          \"\n                    >\n                      <div style=\"border: 1px solid #b9bec4\">\n                        <img\n                          height=\"36\"\n                          width=\"36\"\n                          src=\"https://s3-alpha-sig.figma.com/img/842e/8ea2/8cb71140175199e85bf9e5d1bb9a3ef9?Expires=1657497600&Signature=BntaTMnqhCV-5JBiDDH6Elf8cPPKCzIvdrpsdavwbFpne~GIGDhj9CuU8frsVEUoFQFpqh9TQBO9pwEHJERuGJf9A1doN1FF~t1nae4MTOag2V6OB1yA63vivZqckVYpW6JClPXQ1cZ6wuVbNiUf3orYBx9IfLBkDiif07opmITVrJqnaxZkVA5P9--FtkBCir4o-j1PGltVV9Olf6dsc9j~BxrRNPup8BIeWFSr82OfnV6TMaRUjh8mXuLuRjo64UQFOjKQ5B4fVJ9UnJHcq-voSqkqL01lp6pGr1Y37GgWgPdPK-~5FKyDIFkLda~E5sVW4j1SxE1okOd2EnDe-Q__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA\"\n                        />\n                      </div>\n                      <span\n                        style=\"\n                              margin-left: 8px;\n                              font-family: \'Inter\', Verdana, sans-serif;\n                              font-size: 14px;\n                              line-height: 24px;\n                              color: #212b3d;\n                            \"\n                      >La historia detrás del cuadro</span\n                      >\n                      <div\n                        style=\"\n                              margin-left: 10px;\n                              height: 26px;\n                              width: 26px;\n                              border-radius: 50%;\n                              background-color: #37a1a8;\n                            \"\n                      ></div>\n                      <span\n                        style=\"\n                              margin-left: 16px;\n                              font-family: \'Inter\', Verdana, sans-serif;\n                              font-size: 14px;\n                              line-height: 24px;\n                              color: #212b3d;\n                            \"\n                      >2ºA</span\n                      >\n                      <span\n                        style=\"\n                              margin-left: 25px;\n                              font-family: \'Lexend\', Verdana, sans-serif;\n                              font-size: 14px;\n                              line-height: 24px;\n                              font-weight: 500;\n                              color: #d13b3b;\n                            \"\n                      >within {{it.days}} days</span\n                      >\n                    </div>\n\n                  </div>\n                </td>\n              </tr>\n              -->\n              <!-- BOTON -->\n              <tr>\n                <td\n                  align=\"center\"\n                  style=\"\n                        text-align: center;\n                        padding: 16px 45px 0px;\n                        height: 38px;\n                        font-family: \'Lexend\', Century Gothic, CenturyGothic,\n                          AppleGothic, sans-serif;\n                      \"\n                >\n                  <a\n                    href=\"{{it.btnUrl}}\"\n                    target=\"_blank\"\n                    style=\"\n                          text-decoration: none;\n                          font-size: 14px;\n                          line-height: 18px;\n                          font-weight: 600;\n                          color: #fff;\n                          background-color: #3b76cc;\n                          padding: 10px 32px;\n                          border-radius: 25px;\n                          font-family: \'Lexend\', Century Gothic, CenturyGothic,\n                            AppleGothic, sans-serif;\n                        \"\n                  >\n                    Review my activities\n                  </a>\n                </td>\n              </tr>\n              <!-- TEXT -->\n              <tr>\n                <td\n                  align=\"center\"\n                  style=\"\n                        text-align: center;\n                        padding: 16px 24px 24px;\n                        font-family: \'Inter\', Century Gothic, CenturyGothic,\n                          AppleGothic, sans-serif;\n                        font-size: 14px;\n                        line-height: 22px;\n                        font-weight: 400;\n                        color: #5b6577;\n                      \"\n                >\n                  You can change your email preferences from your user account\n                </td>\n              </tr>\n            </table>\n          </td>\n        </tr>\n      </table>\n          <table\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            align=\"center\"\n            width=\"100%\"\n            bgcolor=\"#F7F8FA\"\n            style=\"\n              background-color: #f7f8fa;\n              font-family: \'Inter\', Century Gothic, CenturyGothic, AppleGothic,\n                sans-serif;\n              font-size: 14px;\n              line-height: 18.2px;\n              font-weight: 400;\n              color: #5b6577;\n            \"\n          >\n            <tr>\n              <td align=\"center\" style=\"text-align: center; padding-top: 18px\">\n                Sent to {{it.__from}}\n              </td>\n            </tr>\n\n          </table>\n          <table\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            align=\"center\"\n            width=\"100%\"\n            bgcolor=\"#F7F8FA\"\n            style=\"background-color: #f7f8fa\"\n          >\n            <tr>\n              <td\n                align=\"center\"\n                style=\"text-align: center; padding: 26px 25px 32px\"\n              >\n                <a\n                  href=\"#\"\n                  target=\"_blank\"\n                  style=\"\n                    text-decoration: none;\n                    font-family: \'Inter\', Verdana, sans-serif;\n                    font-size: 14px;\n                    line-height: 18px;\n                    font-weight: 400;\n                    color: #636d7d;\n                  \"\n                >\n                  \n                </a>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n</html>\n  ',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('63c56335-576f-4090-ba99-bed31fd89a45','3dab39f3-0cd9-4779-a029-5808d1a8e36f','active','en','Your password was reset','\n  <html>\n    <head>\n      <style></style>\n    </head>\n     <body>\n     <h1>Hi {{it.name}}</h1>\n     <h5>Your password was reset.</h5>\n     <p>We wanted to let you know that your Leemons password was reset.</p>\n     <a href=\"{{it.loginUrl}}\">Go to Log in</a>\n     <p>Please do not reply to this email with your password. We will never ask for your password, and we strongly discourage you from sharing it with anyone</p>\n     </body>\n  </html>\n  ',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('cc16bf3f-4c6f-4f60-af18-9b927f4c1bd8','23bd61fe-2d08-44af-983c-9cbf00da09b6','active','en','Recover password','\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <meta name=\"robots\" content=\"noindex,nofollow\">\n    <meta property=\"og:title\" content=\"leemons\">\n\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\'https://fonts.googleapis.com/css?family=Lexend\' rel=\'stylesheet\'>\n    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap\" rel=\"stylesheet\">\n\n\n    <style type=\"text/css\">\n        body {\n            margin: 0 !important;\n            padding: 0 !important;\n            width: 100% !important;\n        }\n\n        h1, h2, p {\n            margin: 0 !important;\n        }\n    </style>\n</head>\n<body class=\"body\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n    <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"max-width: 600px\">\n        <tr>\n            <td>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 10px 0;\">\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                      <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family:\'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 20px; line-height: 25px; font-weight: 400; color: #212B3D;\">\n                          {{it.__platformName}}\n                      </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <img src=\"{{it.__logoUrl}}\" height=\"96\" width=\"96\" style=\"border-radius: \'50%\'\" />\n                        </td>\n                    </tr>\n\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 16px; line-height: 20px; font-weight: 600; color: #212B3D;\">\n                            Click the following link to recover your password:\n                        </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <a href=\"{{it.resetUrl}}\" target=\"_blank\" style=\"text-decoration: none; font-size: 14px; line-height: 18px; font-weight: 600; color: #fff; background-color: #3B76CC; padding: 10px 30px; border-radius: 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                                Recover password\n                            </a>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 25px 45px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                            This link will expire in 15 minutes * and can only be used once.\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 15px 25px;\">\n                            <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 25px 25px 8px; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                                        If the above button does not work, paste this link into your web browser.\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 8px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                                        <a href=\"{{it.resetUrl}}\" target=\"_blank\" style=\"font-size: 14px; line-height: 18px; font-weight: 400; color: #3B76CC; padding: 10px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                                            {{it.resetUrl}}\n                                        </a>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 8px 25px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 13px; line-height: 16px; font-weight: 400; color: #636D7D;\">\n                                        If you have not made this request, you may ignore this email.\n                                    </td>\n                                </tr>\n                            </table>\n                        </td>\n                    </tr>\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding-top: 18px\">\n                        Sent by {{it.__from}}\n                        </td>\n                    </tr>\n\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 20px 25px 85px;\">\n                            <a href=\"#\" target=\"_blank\" style=\"text-decoration: none; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 18px; font-weight: 400; color: #636D7D;\">\n                                \n                            </a>\n                        </td>\n                    </tr>\n                </table>\n\n            </td>\n        </tr>\n    </table>\n</body>\n</html>\n  ',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('d1044a81-8805-4bad-9d3d-fa097cd266d0','c70dcefe-022c-4d40-8990-65fa4878d044','active','es','Bienvenida','\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <meta name=\"robots\" content=\"noindex,nofollow\">\n    <meta property=\"og:title\" content=\"leemons\">\n\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\'https://fonts.googleapis.com/css?family=Lexend\' rel=\'stylesheet\'>\n    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap\" rel=\"stylesheet\">\n\n\n    <style type=\"text/css\">\n        body {\n            margin: 0 !important;\n            padding: 0 !important;\n            width: 100% !important;\n        }\n\n        h1, h2, p {\n            margin: 0 !important;\n        }\n    </style>\n</head>\n<body class=\"body\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n    <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"max-width: 600px\">\n        <tr>\n            <td>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 10px 0;\">\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                      <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family:\'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 20px; line-height: 25px; font-weight: 400; color: #212B3D;\">\n                          Te damos la bienvenida a {{it.__platformName}}\n                      </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <img src=\"{{it.__logoUrl}}\" />\n                        </td>\n                    </tr>\n\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 16px; line-height: 20px; font-weight: 600; color: #212B3D;\">\n                            Haga clic en el siguiente enlace para crear su contraseña y acceder a su cuenta\n                        </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <a href=\"{{it.url}}\" target=\"_blank\" style=\"text-decoration: none; font-size: 14px; line-height: 18px; font-weight: 600; color: #fff; background-color: #3B76CC; padding: 10px 30px; border-radius: 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                                Configurar cuenta\n                            </a>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 25px 45px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                            Este enlace caducará en {{it.expDays}} días y sólo puede utilizarse una vez.\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 15px 25px;\">\n                            <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 25px 25px 8px; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                                        Si el botón anterior no funciona, pegue este enlace en su navegador web\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 8px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                                        <a href=\"{{it.url}}\" target=\"_blank\" style=\"font-size: 14px; line-height: 18px; font-weight: 400; color: #3B76CC; padding: 10px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                                            {{it.url}}\n                                        </a>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 8px 25px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 13px; line-height: 16px; font-weight: 400; color: #636D7D;\">\n                                        Si no ha hecho esta solicitud, puede ignorar este correo electrónico.\n                                    </td>\n                                </tr>\n                            </table>\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 20px 25px;\">\n                            <a href=\"#\" target=\"_blank\" style=\"text-decoration: none; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 18px; font-weight: 400; color: #636D7D;\">\n                                \n                            </a>\n                        </td>\n                    </tr>\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 50px 0;\">\n                        </td>\n                    </tr>\n                </table>\n            </td>\n        </tr>\n    </table>\n</body>\n</html>\n  ',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('dc16bfd5-7f4e-48ab-ab37-ba00f449ec99','ecec4eb9-c62c-4b13-ac76-852b9908cd92','active','es','Nueva actividad','\n  <!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n  <head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n\n    <meta name=\"robots\" content=\"noindex,nofollow\" />\n    <meta property=\"og:title\" content=\"leemons\" />\n\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n    <link\n      href=\"https://fonts.googleapis.com/css?family=Lexend\"\n      rel=\"stylesheet\"\n    />\n    <link\n      href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap\"\n      rel=\"stylesheet\"\n    />\n\n    <style type=\"text/css\">\n      body {\n        margin: 0 !important;\n        padding: 0 !important;\n        width: 100% !important;\n      }\n\n      h1,\n      h2,\n      p {\n        margin: 0 !important;\n      }\n    </style>\n  </head>\n  <body class=\"body\" bgcolor=\"#fff\" style=\"background-color: #fff\">\n    <table\n      cellpadding=\"0\"\n      cellspacing=\"0\"\n      align=\"center\"\n      width=\"100%\"\n      bgcolor=\"#fff\"\n      style=\"max-width: 600px\"\n    >\n      <tr>\n        <td>\n          <table\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            align=\"center\"\n            width=\"100%\"\n            bgcolor=\"#F7F8FA\"\n            style=\"background-color: #f7f8fa\"\n          >\n            <tr>\n              <td style=\"padding: 10px 0\"></td>\n            </tr>\n          </table>\n\n          <table\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            align=\"center\"\n            width=\"100%\"\n            bgcolor=\"#F7F8FA\"\n            style=\"background-color: #f7f8fa\"\n          >\n          <tr>\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 32px 45px 0px;\n                  font-family: \'Lexend\', Century Gothic, CenturyGothic,\n                    AppleGothic, sans-serif;\n                  font-size: 20px;\n                  line-height: 25px;\n                  font-weight: 400;\n                  color: #212b3d;\n                \"\n              >\n                Tienes una nueva actividad pendiente\n              </td>\n            </tr>\n            <tr>\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 10px 45px 0px;\n                  font-family: \'Lexend\', Century Gothic, CenturyGothic,\n                    AppleGothic, sans-serif;\n                \"\n              >\n                <img\n                  src=\"{{it.__logoUrl}}\"\n                  height=\"96\"\n                  width=\"96\"\n                  style=\"border-radius: 50%\"\n                />\n              </td>\n            </tr>\n            <tr>\n            {{ @if (it.instance.messageToAssignees) }}\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 24px 45px 32px;\n                  font-family: \'Inter\', Verdana, sans-serif;\n                  font-size: 18px;\n                  line-height: 22.4px;\n                  font-weight: 600;\n                  color: #5b6577;\n                \"\n              >\n               {{*it.instance.messageToAssignees}}\n              </td>\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 24px 45px 32px;\n                  font-family: \'Inter\', Verdana, sans-serif;\n                  font-size: 14px;\n                  line-height: 22.4px;\n                  color: #212B3D;\n                \"\n              >\n               {{it.userSession.name}} {{it.userSession.surnames}}\n              </td>\n              {{ #else }}\n              <td\n                align=\"center\"\n                style=\"\n                  text-align: center;\n                  padding: 24px 45px 32px;\n                  font-family: \'Inter\', Verdana, sans-serif;\n                  font-size: 14px;\n                  line-height: 22.4px;\n                  color: #5b6577;\n                \"\n              >\n               Esta información puede haber cambiado, revisa siempre tus actividades en curso para no perderte nada.\n              </td>\n              {{ /if}}\n            </tr>\n          </table>\n          <table\n        cellpadding=\"0\"\n        cellspacing=\"0\"\n        align=\"center\"\n        width=\"100%\"\n        bgcolor=\"#F7F8FA\"\n        style=\"background-color: #f7f8fa\"\n      >\n        <tr>\n          <td align=\"center\" style=\"text-align: center; padding: 15px 25px\">\n            <table\n              cellpadding=\"0\"\n              cellspacing=\"0\"\n              align=\"center\"\n              width=\"100%\"\n              bgcolor=\"#fff\"\n              style=\"background-color: #fff\"\n            >\n              <!-- CARTA -->\n              <tr>\n                <td align=\"center\" style=\"padding-top: 24px\">\n                  <div\n                    style=\"\n                          background-color: white;\n                          border-radius: 4px;\n                          border: 2px solid #f7f8fa;\n                          filter: drop-shadow(0px 5px 15px rgba(0, 0, 0, 0.1));\n                          width: 354px;\n                          height: 352px;\n                        \"\n                  >\n                    <div\n                      style=\"width: 100%; height: 180px; position: relative; background-size: cover; background-image: url(\'{{ it.instance.assignable.asset.url }}\')\"\n                    >\n                      <div style=\"display: flex;height: 100%\">\n                        <div\n                          style=\"\n                              width: 100%;\n                              height: 100%;\n                              background: rgba(247, 248, 250, 0.8);\n                              backdrop-filter: blur(20px);\n                              border-top-left-radius: 2px;\n                            \"\n                        >\n                          <div\n                            style=\"\n                                display: flex;\n                                height: 100%;\n                                justify-content: flex-end;\n                                border-top: 8px solid #dc5571;\n                              \"\n                          >\n                            <div\n                              style=\"\n                                  text-align: start;\n                                  padding: 12px;\n                                \"\n                            >\n                              <div\n                                style=\"\n                                    display: inline;\n                                    width: fit-content;\n                                    padding: 4px 8px;\n                                    background-color: white;\n                                    border-radius: 4px;\n                                    font-size: 13px;\n                                    margin-bottom: 8px;\n                                  \"\n                              >\n                                  <span\n                                    style=\"\n                                      font-family: \'Inter\', Verdana, sans-serif;\n                                      font-size: 16px;\n                                      line-height: 20px;\n                                      color: #212b3d;\n                                    \"\n                                  >NUEVA</span\n                                  >\n                              </div>\n                              <div\n                                style=\"\n                                    display: flex;\n                                    gap: 8px;\n                                    margin-top: 8px;\n                                    margin-bottom: 8px;\n                                    align-items: center;\n                                  \"\n                              >\n                                <div\n                                  style=\"\n                                      height: 20px;\n                                      width: 20px;\n                                      border-radius: 50%;\n                                      text-align: center;\n                                        line-height: 20px;\n                                      {{ @if (it.classes.length === 1) }}\n                                        background-color: {{ it.classes[0].color }};\n                                      {{ #else }}\n                                        background-color: #67728E;\n                                      {{ /if}}\n\n                                    \"\n                                >\n\n                                {{ @if (it.subjectIconUrl) }}\n                                        <img src=\"{{it.subjectIconUrl}}\" width=\"13px\" height=\"13px\" style=\"filter: brightness(0) invert(1)\" />\n                                      {{ #else }}\n\n                                      {{ /if}}\n\n</div>\n                                <span\n                                  style=\"\n                                      font-family: \'Inter\', Verdana, sans-serif;\n                                      font-size: 13px;\n                                      line-height: 20px;\n                                       width: 135px;\n                                       padding-left: 8px;\n                                        \"\n                                >\n                                {{ @if (it.classes.length === 1) }}\n                                    {{ it.classes[0].subject.name }}\n                                {{ #else }}\n                                  Multi-Asignatura\n                                {{ /if}}\n                                    </span>\n                              </div>\n                              <span\n                                style=\"\n                                    display: block;\n                                    font-family: \'Lexend\', Verdana, sans-serif;\n                                    font-size: 16px;\n                                    line-height: 20px;\n                                    font-weight: 600;\n                                    color: #212b3d;\n                                    margin-top: 8px;\n\n                                  \"\n                              >{{it.instance.assignable.asset.name}}</span>\n                            </div>\n                          </div>\n                        </div>\n                        <div\n                          style=\"\n                              background-color: white;\n                              text-align: left;\n                              padding: 8px;\n                              height: 50px;\n                              width: 100%;\n                              margin-top: 130px;\n                            \"\n                        >\n                          <div\n                            style=\"\n                                font-family: \'Inter\', Verdana, sans-serif;\n                                font-size: 12px;\n                                line-height: 20px;\n                                font-weight: 600;\n                                color: #31753b;\n                              \"\n                          >Empezar actividad\n                          </div\n                          >\n                          {{ @if (it.taskDate) }}\n                             <div\n                            style=\"\n                                font-family: \'Inter\', Verdana, sans-serif;\n                                font-size: 12.5px;\n                                line-height: 14px;\n                                color: #5b6577;\n                              \"\n                          >Entrega: {{it.taskDate}}\n                          </div>\n                           {{ /if}}\n\n                        </div>\n                      </div>\n                    </div>\n                    <div style=\"padding: 16px; text-align: start\">\n                          <span\n                            style=\"\n                              font-family: \'Inter\', Verdana, sans-serif;\n                              font-size: 12.5px;\n                              line-height: 16.5px;\n                              color: #5b6577;\n                            \"\n                          >{{ @if (it.instance.assignable.asset.description) }}\n                             {{ it.instance.assignable.asset.description }}\n                           {{ /if}}</span>\n                    </div>\n                  </div>\n                </td>\n              </tr>\n              <!-- TABLA -->\n              <!--\n              <tr>\n                <td\n                  align=\"center\"\n                  style=\"padding-top: 16px; padding-inline: 38.5px\"\n                >\n                  <div\n                    style=\"\n                          text-align: start;\n                        \"\n                  >\n                        <span\n                          style=\"\n                            padding: 5px 16px 8px;\n                            font-family: \'Inter\', Verdana, sans-serif;\n                            font-size: 14px;\n                            line-height: 24px;\n                            font-weight: 600;\n                            color: #212b3d;\n                          \"\n                        >Próximas entregas</span\n                        >\n                    <div\n                      style=\"\n                            display: flex;\n                            padding: 6px 16px;\n                            align-items: center;\n                            border-top: 2px solid #edeff5;\n                          \"\n                    >\n                      <div style=\"border: 1px solid #b9bec4\">\n                        <img\n                          height=\"36\"\n                          width=\"36\"\n                          src=\"https://s3-alpha-sig.figma.com/img/842e/8ea2/8cb71140175199e85bf9e5d1bb9a3ef9?Expires=1657497600&Signature=BntaTMnqhCV-5JBiDDH6Elf8cPPKCzIvdrpsdavwbFpne~GIGDhj9CuU8frsVEUoFQFpqh9TQBO9pwEHJERuGJf9A1doN1FF~t1nae4MTOag2V6OB1yA63vivZqckVYpW6JClPXQ1cZ6wuVbNiUf3orYBx9IfLBkDiif07opmITVrJqnaxZkVA5P9--FtkBCir4o-j1PGltVV9Olf6dsc9j~BxrRNPup8BIeWFSr82OfnV6TMaRUjh8mXuLuRjo64UQFOjKQ5B4fVJ9UnJHcq-voSqkqL01lp6pGr1Y37GgWgPdPK-~5FKyDIFkLda~E5sVW4j1SxE1okOd2EnDe-Q__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA\"\n                        />\n                      </div>\n                      <span\n                        style=\"\n                              margin-left: 8px;\n                              font-family: \'Inter\', Verdana, sans-serif;\n                              font-size: 14px;\n                              line-height: 24px;\n                              color: #212b3d;\n                            \"\n                      >La historia detrás del cuadro</span\n                      >\n                      <div\n                        style=\"\n                              margin-left: 10px;\n                              height: 26px;\n                              width: 26px;\n                              border-radius: 50%;\n                              background-color: #37a1a8;\n                            \"\n                      ></div>\n                      <span\n                        style=\"\n                              margin-left: 16px;\n                              font-family: \'Inter\', Verdana, sans-serif;\n                              font-size: 14px;\n                              line-height: 24px;\n                              color: #212b3d;\n                            \"\n                      >2ºA</span\n                      >\n                      <span\n                        style=\"\n                              margin-left: 25px;\n                              font-family: \'Lexend\', Verdana, sans-serif;\n                              font-size: 14px;\n                              line-height: 24px;\n                              font-weight: 500;\n                              color: #d13b3b;\n                            \"\n                      >dentro de {{it.days}} días</span\n                      >\n                    </div>\n\n                  </div>\n                </td>\n              </tr>\n              -->\n              <!-- BOTON -->\n              <tr>\n                <td\n                  align=\"center\"\n                  style=\"\n                        text-align: center;\n                        padding: 16px 45px 0px;\n                        height: 38px;\n                        font-family: \'Lexend\', Century Gothic, CenturyGothic,\n                          AppleGothic, sans-serif;\n                      \"\n                >\n                  <a\n                    href=\"{{it.btnUrl}}\"\n                    target=\"_blank\"\n                    style=\"\n                          text-decoration: none;\n                          font-size: 14px;\n                          line-height: 18px;\n                          font-weight: 600;\n                          color: #fff;\n                          background-color: #3b76cc;\n                          padding: 10px 32px;\n                          border-radius: 25px;\n                          font-family: \'Lexend\', Century Gothic, CenturyGothic,\n                            AppleGothic, sans-serif;\n                        \"\n                  >\n                    Revisar mis actividades\n                  </a>\n                </td>\n              </tr>\n              <!-- TEXT -->\n              <tr>\n                <td\n                  align=\"center\"\n                  style=\"\n                        text-align: center;\n                        padding: 16px 24px 24px;\n                        font-family: \'Inter\', Century Gothic, CenturyGothic,\n                          AppleGothic, sans-serif;\n                        font-size: 14px;\n                        line-height: 22px;\n                        font-weight: 400;\n                        color: #5b6577;\n                      \"\n                >\n                  Puedes cambiar tus preferencias de correo desde tu cuenta de usuario.\n                </td>\n              </tr>\n            </table>\n          </td>\n        </tr>\n      </table>\n          <table\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            align=\"center\"\n            width=\"100%\"\n            bgcolor=\"#F7F8FA\"\n            style=\"\n              background-color: #f7f8fa;\n              font-family: \'Inter\', Century Gothic, CenturyGothic, AppleGothic,\n                sans-serif;\n              font-size: 14px;\n              line-height: 18.2px;\n              font-weight: 400;\n              color: #5b6577;\n            \"\n          >\n            <tr>\n              <td align=\"center\" style=\"text-align: center; padding-top: 18px\">\n                Enviado por {{it.__from}}\n              </td>\n            </tr>\n\n          </table>\n          <table\n            cellpadding=\"0\"\n            cellspacing=\"0\"\n            align=\"center\"\n            width=\"100%\"\n            bgcolor=\"#F7F8FA\"\n            style=\"background-color: #f7f8fa\"\n          >\n            <tr>\n              <td\n                align=\"center\"\n                style=\"text-align: center; padding: 26px 25px 32px\"\n              >\n                <a\n                  href=\"#\"\n                  target=\"_blank\"\n                  style=\"\n                    text-decoration: none;\n                    font-family: \'Inter\', Verdana, sans-serif;\n                    font-size: 14px;\n                    line-height: 18px;\n                    font-weight: 400;\n                    color: #636d7d;\n                  \"\n                >\n                  \n                </a>\n              </td>\n            </tr>\n          </table>\n        </td>\n      </tr>\n    </table>\n  </body>\n</html>\n  ',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL),('dd67e277-dc32-4528-a9cb-c64b3d8c6f07','2ad151a7-3455-43b7-8f0a-717171a05298','active','es','Nuevo perfil','\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <meta name=\"robots\" content=\"noindex,nofollow\">\n    <meta property=\"og:title\" content=\"leemons\">\n\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\'https://fonts.googleapis.com/css?family=Lexend\' rel=\'stylesheet\'>\n    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap\" rel=\"stylesheet\">\n\n\n    <style type=\"text/css\">\n        body {\n            margin: 0 !important;\n            padding: 0 !important;\n            width: 100% !important;\n        }\n\n        h1, h2, p {\n            margin: 0 !important;\n        }\n    </style>\n</head>\n<body class=\"body\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n    <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"max-width: 600px\">\n        <tr>\n            <td>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 10px 0;\">\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                      <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family:\'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 20px; line-height: 25px; font-weight: 400; color: #212B3D;\">\n                          Hola, {{it.userName}}\n                      </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <img src=\"{{it.__logoUrl}}\" />\n                        </td>\n                    </tr>\n\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 16px; line-height: 20px; font-weight: 600; color: #212B3D;\">\n                            Te han añadido al perfil de {{it.profileName}}\n                        </td>\n                    </tr>\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 20px 25px;\">\n                            <a href=\"#\" target=\"_blank\" style=\"text-decoration: none; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 18px; font-weight: 400; color: #636D7D;\">\n                                \n                            </a>\n                        </td>\n                    </tr>\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 50px 0;\">\n                        </td>\n                    </tr>\n                </table>\n            </td>\n        </tr>\n    </table>\n</body>\n</html>\n  ',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('ff93cee7-dccd-420b-8d56-f6096294a247','23bd61fe-2d08-44af-983c-9cbf00da09b6','active','es','Recuperar contraseña','\n<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n<head>\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n\n    <meta name=\"robots\" content=\"noindex,nofollow\">\n    <meta property=\"og:title\" content=\"leemons\">\n\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n    <link href=\'https://fonts.googleapis.com/css?family=Lexend\' rel=\'stylesheet\'>\n    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap\" rel=\"stylesheet\">\n\n\n    <style type=\"text/css\">\n        body {\n            margin: 0 !important;\n            padding: 0 !important;\n            width: 100% !important;\n        }\n\n        h1, h2, p {\n            margin: 0 !important;\n        }\n    </style>\n</head>\n<body class=\"body\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n    <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"max-width: 600px\">\n        <tr>\n            <td>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td style=\"padding: 10px 0;\">\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                      <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family:\'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 20px; line-height: 25px; font-weight: 400; color: #212B3D;\">\n                          {{it.__platformName}}\n                      </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <img src=\"{{it.__logoUrl}}\" height=\"96\" width=\"96\" style=\"border-radius: \'50%\'\" />\n                        </td>\n                    </tr>\n\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 16px; line-height: 20px; font-weight: 600; color: #212B3D;\">\n                            Haz clic en el siguiente enlace para recuperar tu contraseña:\n                        </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 10px 45px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                            <a href=\"{{it.resetUrl}}\" target=\"_blank\" style=\"text-decoration: none; font-size: 14px; line-height: 18px; font-weight: 600; color: #fff; background-color: #3B76CC; padding: 10px 30px; border-radius: 25px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                                Recuperar contraseña\n                            </a>\n                        </td>\n                    </tr>\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 25px 45px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                            Este enlace caducará en 15 minutos * y solo puede utilizarse una vez.\n                        </td>\n                    </tr>\n                </table>\n\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 15px 25px;\">\n                            <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#fff\" style=\"background-color: #fff;\">\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 25px 25px 8px; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                                        Si el botón anterior no funciona, pegue este enlace en su navegador web\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 8px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 22px; font-weight: 400; color: #5B6577;\">\n                                        <a href=\"{{it.resetUrl}}\" target=\"_blank\" style=\"font-size: 14px; line-height: 18px; font-weight: 400; color: #3B76CC; padding: 10px; font-family: \'Lexend\', Century Gothic,CenturyGothic,AppleGothic,sans-serif;\">\n                                            {{it.resetUrl}}\n                                        </a>\n                                    </td>\n                                </tr>\n                                <tr>\n                                    <td align=\"center\" style=\"text-align: center; padding: 8px 25px 25px; font-family: \'Inter\', Verdana, sans-serif; font-size: 13px; line-height: 16px; font-weight: 400; color: #636D7D;\">\n                                        Si no ha hecho esta solicitud, puede ignorar este correo electrónico.\n                                    </td>\n                                </tr>\n                            </table>\n                        </td>\n                    </tr>\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding-top: 18px\">\n                        Enviado por {{it.__from}}\n                        </td>\n                    </tr>\n\n                </table>\n                <table cellpadding=\"0\" cellspacing=\"0\" align=\"center\" width=\"100%\" bgcolor=\"#F7F8FA\" style=\"background-color: #F7F8FA;\">\n                    <tr>\n                        <td align=\"center\" style=\"text-align: center; padding: 20px 25px 85px;\">\n                            <a href=\"#\" target=\"_blank\" style=\"text-decoration: none; font-family: \'Inter\', Verdana, sans-serif; font-size: 14px; line-height: 18px; font-weight: 400; color: #636D7D;\">\n                                \n                            </a>\n                        </td>\n                    </tr>\n                </table>\n\n            </td>\n        </tr>\n    </table>\n</body>\n</html>\n  ',0,'2022-08-03 05:55:42','2022-08-03 05:55:42',NULL);
/*!40000 ALTER TABLE `plugins_emails::email-template-detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_grades::condition-groups`
--

DROP TABLE IF EXISTS `plugins_grades::condition-groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_grades::condition-groups` (
  `id` char(36) NOT NULL,
  `operator` varchar(255) NOT NULL,
  `rule` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_grades::condition_groups_rule_foreign` (`rule`),
  CONSTRAINT `plugins_grades::condition_groups_rule_foreign` FOREIGN KEY (`rule`) REFERENCES `plugins_grades::rules` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_grades::condition-groups`
--

LOCK TABLES `plugins_grades::condition-groups` WRITE;
/*!40000 ALTER TABLE `plugins_grades::condition-groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_grades::condition-groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_grades::conditions`
--

DROP TABLE IF EXISTS `plugins_grades::conditions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_grades::conditions` (
  `id` char(36) NOT NULL,
  `source` varchar(255) DEFAULT NULL,
  `sourceIds` json DEFAULT NULL,
  `data` varchar(255) DEFAULT NULL,
  `dataTargets` json DEFAULT NULL,
  `operator` varchar(255) DEFAULT NULL,
  `target` float(8,4) DEFAULT NULL,
  `targetGradeScale` char(36) DEFAULT NULL,
  `rule` char(36) DEFAULT NULL,
  `childGroup` char(36) DEFAULT NULL,
  `parentGroup` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_grades::conditions_targetgradescale_foreign` (`targetGradeScale`),
  KEY `plugins_grades::conditions_rule_foreign` (`rule`),
  KEY `plugins_grades::conditions_childgroup_foreign` (`childGroup`),
  KEY `plugins_grades::conditions_parentgroup_foreign` (`parentGroup`),
  CONSTRAINT `plugins_grades::conditions_childgroup_foreign` FOREIGN KEY (`childGroup`) REFERENCES `plugins_grades::condition-groups` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_grades::conditions_parentgroup_foreign` FOREIGN KEY (`parentGroup`) REFERENCES `plugins_grades::condition-groups` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_grades::conditions_rule_foreign` FOREIGN KEY (`rule`) REFERENCES `plugins_grades::rules` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_grades::conditions_targetgradescale_foreign` FOREIGN KEY (`targetGradeScale`) REFERENCES `plugins_grades::grade-scales` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_grades::conditions`
--

LOCK TABLES `plugins_grades::conditions` WRITE;
/*!40000 ALTER TABLE `plugins_grades::conditions` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_grades::conditions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_grades::grade-scales`
--

DROP TABLE IF EXISTS `plugins_grades::grade-scales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_grades::grade-scales` (
  `id` char(36) NOT NULL,
  `number` float(8,4) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `letter` varchar(255) DEFAULT NULL,
  `grade` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_grades::grade-scales`
--

LOCK TABLES `plugins_grades::grade-scales` WRITE;
/*!40000 ALTER TABLE `plugins_grades::grade-scales` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_grades::grade-scales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_grades::grades`
--

DROP TABLE IF EXISTS `plugins_grades::grades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_grades::grades` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `isPercentage` tinyint(1) DEFAULT '0',
  `minScaleToPromote` char(36) DEFAULT NULL,
  `center` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_grades::grades_minscaletopromote_foreign` (`minScaleToPromote`),
  CONSTRAINT `plugins_grades::grades_minscaletopromote_foreign` FOREIGN KEY (`minScaleToPromote`) REFERENCES `plugins_grades::grade-scales` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_grades::grades`
--

LOCK TABLES `plugins_grades::grades` WRITE;
/*!40000 ALTER TABLE `plugins_grades::grades` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_grades::grades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_grades::grades-tags`
--

DROP TABLE IF EXISTS `plugins_grades::grades-tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_grades::grades-tags` (
  `id` char(36) NOT NULL,
  `description` varchar(255) NOT NULL,
  `letter` varchar(255) NOT NULL,
  `scale` char(36) DEFAULT NULL,
  `grade` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_grades::grades_tags_scale_foreign` (`scale`),
  KEY `plugins_grades::grades_tags_grade_foreign` (`grade`),
  CONSTRAINT `plugins_grades::grades_tags_grade_foreign` FOREIGN KEY (`grade`) REFERENCES `plugins_grades::grades` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_grades::grades_tags_scale_foreign` FOREIGN KEY (`scale`) REFERENCES `plugins_grades::grade-scales` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_grades::grades-tags`
--

LOCK TABLES `plugins_grades::grades-tags` WRITE;
/*!40000 ALTER TABLE `plugins_grades::grades-tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_grades::grades-tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_grades::rules`
--

DROP TABLE IF EXISTS `plugins_grades::rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_grades::rules` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `center` char(36) DEFAULT NULL,
  `grade` char(36) DEFAULT NULL,
  `program` varchar(255) DEFAULT NULL,
  `group` char(36) DEFAULT NULL,
  `isDependency` tinyint(1) NOT NULL DEFAULT '0',
  `subject` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_grades::rules_center_foreign` (`center`),
  KEY `plugins_grades::rules_grade_foreign` (`grade`),
  KEY `plugins_grades::rules_group_foreign` (`group`),
  CONSTRAINT `plugins_grades::rules_center_foreign` FOREIGN KEY (`center`) REFERENCES `plugins_users::centers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_grades::rules_grade_foreign` FOREIGN KEY (`grade`) REFERENCES `plugins_grades::grades` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_grades::rules_group_foreign` FOREIGN KEY (`group`) REFERENCES `plugins_grades::condition-groups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_grades::rules`
--

LOCK TABLES `plugins_grades::rules` WRITE;
/*!40000 ALTER TABLE `plugins_grades::rules` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_grades::rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_grades::settings`
--

DROP TABLE IF EXISTS `plugins_grades::settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_grades::settings` (
  `id` char(36) NOT NULL,
  `hideWelcome` tinyint(1) DEFAULT NULL,
  `configured` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_grades::settings`
--

LOCK TABLES `plugins_grades::settings` WRITE;
/*!40000 ALTER TABLE `plugins_grades::settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_grades::settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_leebrary::assets`
--

DROP TABLE IF EXISTS `plugins_leebrary::assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_leebrary::assets` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `description` text,
  `color` varchar(255) DEFAULT NULL,
  `cover` char(36) DEFAULT NULL,
  `fromUser` char(36) DEFAULT NULL,
  `fromUserAgent` char(36) DEFAULT NULL,
  `public` tinyint(1) DEFAULT NULL,
  `category` char(36) DEFAULT NULL,
  `indexable` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_leebrary::assets_fromuser_foreign` (`fromUser`),
  KEY `plugins_leebrary::assets_fromuseragent_foreign` (`fromUserAgent`),
  KEY `plugins_leebrary::assets_category_foreign` (`category`),
  CONSTRAINT `plugins_leebrary::assets_category_foreign` FOREIGN KEY (`category`) REFERENCES `plugins_leebrary::categories` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_leebrary::assets_fromuser_foreign` FOREIGN KEY (`fromUser`) REFERENCES `plugins_users::users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_leebrary::assets_fromuseragent_foreign` FOREIGN KEY (`fromUserAgent`) REFERENCES `plugins_users::user-agent` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_leebrary::assets`
--

LOCK TABLES `plugins_leebrary::assets` WRITE;
/*!40000 ALTER TABLE `plugins_leebrary::assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_leebrary::assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_leebrary::assets-files`
--

DROP TABLE IF EXISTS `plugins_leebrary::assets-files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_leebrary::assets-files` (
  `id` char(36) NOT NULL,
  `asset` varchar(255) DEFAULT NULL,
  `file` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `plugins_leebrary::assets_files_file_foreign` (`file`),
  CONSTRAINT `plugins_leebrary::assets_files_file_foreign` FOREIGN KEY (`file`) REFERENCES `plugins_leebrary::files` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_leebrary::assets-files`
--

LOCK TABLES `plugins_leebrary::assets-files` WRITE;
/*!40000 ALTER TABLE `plugins_leebrary::assets-files` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_leebrary::assets-files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_leebrary::bookmarks`
--

DROP TABLE IF EXISTS `plugins_leebrary::bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_leebrary::bookmarks` (
  `id` char(36) NOT NULL,
  `asset` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `icon` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `plugins_leebrary::bookmarks_icon_foreign` (`icon`),
  CONSTRAINT `plugins_leebrary::bookmarks_icon_foreign` FOREIGN KEY (`icon`) REFERENCES `plugins_leebrary::files` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_leebrary::bookmarks`
--

LOCK TABLES `plugins_leebrary::bookmarks` WRITE;
/*!40000 ALTER TABLE `plugins_leebrary::bookmarks` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_leebrary::bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_leebrary::categories`
--

DROP TABLE IF EXISTS `plugins_leebrary::categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_leebrary::categories` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `pluginOwner` varchar(255) NOT NULL,
  `creatable` tinyint(1) DEFAULT '0',
  `createUrl` varchar(255) DEFAULT NULL,
  `duplicable` tinyint(1) DEFAULT '0',
  `provider` varchar(255) NOT NULL,
  `componentOwner` varchar(255) DEFAULT NULL,
  `listCardComponent` varchar(255) DEFAULT NULL,
  `listItemComponent` varchar(255) DEFAULT NULL,
  `detailComponent` varchar(255) DEFAULT NULL,
  `canUse` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_leebrary::categories`
--

LOCK TABLES `plugins_leebrary::categories` WRITE;
/*!40000 ALTER TABLE `plugins_leebrary::categories` DISABLE KEYS */;
INSERT INTO `plugins_leebrary::categories` VALUES ('6b38442a-da18-4884-8d85-4952c479a395','assignables.tests','plugins.assignables',1,'/private/tests/new',1,'leebrary-assignables','plugins.tests','TestsListCard',NULL,'TestsDetail',NULL,0),('75fdcf12-ac12-4115-82f0-97646327eaaa','bookmarks','plugins.leebrary',1,NULL,1,'leebrary','plugins.leebrary',NULL,NULL,NULL,'\"*\"',0),('8ae37080-f1a1-4278-bf66-d15a58fa308e','assignables.task','plugins.assignables',1,'/private/tasks/create',1,'leebrary-assignables','plugins.tasks','ListCard',NULL,'Detail',NULL,0),('c23873a6-1de5-4b8e-a807-044c662836ea','tests-questions-banks','providers.leebrary-tests',1,'/private/tests/questions-banks/new',1,'leebrary-tests','providers.leebrary-tests','QuestionsBanksListCard',NULL,'QuestionsBanksDetail','[\"plugins.tests\"]',0),('d7e37c0c-fcad-463c-ac04-10446f875468','media-files','plugins.leebrary',1,NULL,1,'leebrary','plugins.leebrary',NULL,NULL,NULL,'\"*\"',0);
/*!40000 ALTER TABLE `plugins_leebrary::categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_leebrary::files`
--

DROP TABLE IF EXISTS `plugins_leebrary::files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_leebrary::files` (
  `id` char(36) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `extension` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `uri` varchar(255) NOT NULL,
  `metadata` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_leebrary::files`
--

LOCK TABLES `plugins_leebrary::files` WRITE;
/*!40000 ALTER TABLE `plugins_leebrary::files` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_leebrary::files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_leebrary::pins`
--

DROP TABLE IF EXISTS `plugins_leebrary::pins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_leebrary::pins` (
  `id` char(36) NOT NULL,
  `asset` varchar(255) DEFAULT NULL,
  `userAgent` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `plugins_leebrary::pins_useragent_foreign` (`userAgent`),
  CONSTRAINT `plugins_leebrary::pins_useragent_foreign` FOREIGN KEY (`userAgent`) REFERENCES `plugins_users::user-agent` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_leebrary::pins`
--

LOCK TABLES `plugins_leebrary::pins` WRITE;
/*!40000 ALTER TABLE `plugins_leebrary::pins` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_leebrary::pins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_leebrary::settings`
--

DROP TABLE IF EXISTS `plugins_leebrary::settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_leebrary::settings` (
  `id` char(36) NOT NULL,
  `defaultCategory` char(36) DEFAULT NULL,
  `providerName` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_leebrary::settings_defaultcategory_foreign` (`defaultCategory`),
  CONSTRAINT `plugins_leebrary::settings_defaultcategory_foreign` FOREIGN KEY (`defaultCategory`) REFERENCES `plugins_leebrary::categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_leebrary::settings`
--

LOCK TABLES `plugins_leebrary::settings` WRITE;
/*!40000 ALTER TABLE `plugins_leebrary::settings` DISABLE KEYS */;
INSERT INTO `plugins_leebrary::settings` VALUES ('9e34c6fc-bd27-488a-a360-b4b8cabe353a','d7e37c0c-fcad-463c-ac04-10446f875468',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL);
/*!40000 ALTER TABLE `plugins_leebrary::settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_menu-builder::know-how-to-use`
--

DROP TABLE IF EXISTS `plugins_menu-builder::know-how-to-use`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_menu-builder::know-how-to-use` (
  `id` char(36) NOT NULL,
  `user` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_menu_builder::know_how_to_use_user_unique` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_menu-builder::know-how-to-use`
--

LOCK TABLES `plugins_menu-builder::know-how-to-use` WRITE;
/*!40000 ALTER TABLE `plugins_menu-builder::know-how-to-use` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_menu-builder::know-how-to-use` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_menu-builder::menu`
--

DROP TABLE IF EXISTS `plugins_menu-builder::menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_menu-builder::menu` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_menu_builder::menu_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_menu-builder::menu`
--

LOCK TABLES `plugins_menu-builder::menu` WRITE;
/*!40000 ALTER TABLE `plugins_menu-builder::menu` DISABLE KEYS */;
INSERT INTO `plugins_menu-builder::menu` VALUES ('13df2f4e-6f86-4fc0-8897-8559a08b04a1','plugins.menu-builder.main',0,'2022-08-03 05:55:50','2022-08-03 05:55:50',NULL),('2c8af13d-50b8-4619-b41f-d90d8ecef2ca','plugins.leebrary.categories',0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL);
/*!40000 ALTER TABLE `plugins_menu-builder::menu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_menu-builder::menu-item`
--

DROP TABLE IF EXISTS `plugins_menu-builder::menu-item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_menu-builder::menu-item` (
  `id` char(36) NOT NULL,
  `menuKey` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `parentKey` varchar(255) DEFAULT NULL,
  `pluginName` varchar(255) NOT NULL,
  `order` int DEFAULT NULL,
  `fixed` tinyint(1) DEFAULT '0',
  `iconName` varchar(255) DEFAULT NULL,
  `activeIconName` varchar(255) DEFAULT NULL,
  `iconSvg` varchar(255) DEFAULT NULL,
  `activeIconSvg` varchar(255) DEFAULT NULL,
  `iconAlt` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `window` varchar(255) DEFAULT 'SELF',
  `disabled` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_menu_builder::menu_item_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_menu-builder::menu-item`
--

LOCK TABLES `plugins_menu-builder::menu-item` WRITE;
/*!40000 ALTER TABLE `plugins_menu-builder::menu-item` DISABLE KEYS */;
INSERT INTO `plugins_menu-builder::menu-item` VALUES ('117f98d8-5541-4de1-956a-e625da438e77','plugins.menu-builder.main','plugins.academic-portfolio.subjects','plugins.academic-portfolio.portfolio','plugins.academic-portfolio',4,0,NULL,NULL,NULL,NULL,NULL,'/private/academic-portfolio/subjects','SELF',1,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('17e3bf92-eaaa-4f67-ba7c-f6bad0472bbd','plugins.menu-builder.main','plugins.curriculum.curriculum-new','plugins.curriculum.curriculum','plugins.curriculum',NULL,0,NULL,NULL,NULL,NULL,NULL,'/private/curriculum/new','SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('25e83cf5-f3f8-41e6-a119-1b0eae5bad59','plugins.menu-builder.main','plugins.grades.dependencies','plugins.grades.rules','plugins.grades',4,0,NULL,NULL,NULL,NULL,NULL,'/private/grades/dependencies','SELF',1,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('2b4dbec6-0576-4e51-92ef-e9affee108c0','plugins.menu-builder.main','plugins.assignables.activities',NULL,'plugins.assignables',10,0,NULL,NULL,'/public/assignables/menu-icon.svg','/public/assignables/menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('2c719bc5-2bf2-4cf5-bc5d-713a923e0b3d','plugins.menu-builder.main','plugins.grades.rules',NULL,'plugins.grades',3,0,NULL,NULL,'/public/grades/menu-icon.svg','/public/grades/menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('34204df9-0d05-4ba6-bc89-ba0bfabd6854','plugins.menu-builder.main','plugins.scores.scores.notebook','plugins.scores.scores','plugins.scores',2,0,NULL,NULL,NULL,NULL,NULL,'/private/scores/notebook','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('36919864-64d2-49f2-9523-a44b0b2287e3','plugins.menu-builder.main','plugins.calendar.calendar',NULL,'plugins.calendar',7,0,NULL,NULL,'/public/assets/svgs/calendar.svg','/public/assets/svgs/calendar.svg',NULL,'/private/calendar/home','SELF',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('402ab346-7876-47dc-8362-450985ae0a5f','plugins.menu-builder.main','plugins.tests.new-questionBanks','plugins.tests.tests','plugins.tests',5,0,NULL,NULL,NULL,NULL,NULL,'/private/tests/questions-banks/new','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('4479dfbe-9b21-42cf-9fab-b0fa8c3976a3','plugins.menu-builder.main','plugins.tests.test','plugins.tests.tests','plugins.tests',2,0,NULL,NULL,NULL,NULL,NULL,'/private/tests','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('44eb8842-2551-4ae9-8c16-659b71528f0e','plugins.menu-builder.main','plugins.tasks.new-task','plugins.tasks.tasks','plugins.tasks',4,0,NULL,NULL,NULL,NULL,NULL,'/private/tasks/library/create','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('44f92b64-91a7-40e4-ab52-491178aefb9d','plugins.menu-builder.main','plugins.tasks.profiles','plugins.tasks.tasks','plugins.tasks',2,0,NULL,NULL,NULL,NULL,NULL,'/private/tasks/profiles','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('4d180927-d5c9-43b6-b1ca-b4b5209cd0ac','plugins.menu-builder.main','plugins.users.users',NULL,'plugins.users',5,0,NULL,NULL,'/public/users/menu-icon.svg','/public/users/menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('55ed9454-dc33-4fa3-ac5c-75882fdc62d4','plugins.menu-builder.main','plugins.calendar.kanban',NULL,'plugins.calendar',8,0,NULL,NULL,'/public/calendar/plugin-kanban.svg','/public/calendar/plugin-kanban-active.svg',NULL,'/private/calendar/kanban','SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('58806d3d-5824-45e9-a757-34973f8867df','plugins.menu-builder.main','plugins.assignables.activities.history','plugins.assignables.activities','plugins.assignables',2,0,NULL,NULL,NULL,NULL,NULL,'/private/assignables/history','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('59b7ff02-66d4-4862-b91f-7a6e61530c12','plugins.menu-builder.main','plugins.academic-portfolio.profiles','plugins.academic-portfolio.portfolio','plugins.academic-portfolio',2,0,NULL,NULL,NULL,NULL,NULL,'/private/academic-portfolio/profiles','SELF',1,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('59d427a8-4550-43b2-b24d-6c7d43747707','plugins.menu-builder.main','plugins.users.user-data','plugins.users.users','plugins.users',2,0,NULL,NULL,NULL,NULL,NULL,'/private/users/user-data','SELF',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('6463d16e-16f7-421a-8169-ba52cb10f257','plugins.menu-builder.main','plugins.tests.new-test','plugins.tests.tests','plugins.tests',3,0,NULL,NULL,NULL,NULL,NULL,'/private/tests/new','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('6754e914-0136-4821-b7c0-68e57ab7b3eb','plugins.menu-builder.main','plugins.scores.scores.scores','plugins.scores.scores','plugins.scores',3,0,NULL,NULL,NULL,NULL,NULL,'/private/scores/scores','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('6ea60fd3-5240-4a38-82c3-9613b6927301','plugins.menu-builder.main','plugins.curriculum.curriculum',NULL,'plugins.curriculum',9,0,NULL,NULL,'/public/assets/svgs/curriculum.svg','/public/assets/svgs/curriculum.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('763089c9-fec2-4d92-8dde-9a57f07df5fa','plugins.menu-builder.main','plugins.dashboard.dashboard',NULL,'plugins.dashboard',2,0,NULL,NULL,'/public/assets/svgs/plugin-dashboard.svg','/public/assets/svgs/plugin-dashboard.svg',NULL,'/private/dashboard','SELF',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('764822c7-ba7f-4243-b462-b889565112c0','plugins.menu-builder.main','plugins.tasks.library','plugins.tasks.tasks','plugins.tasks',3,0,NULL,NULL,NULL,NULL,NULL,'/private/tasks/library','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('7cd50f07-487d-4bbe-8798-d1eb1c6e59a5','plugins.menu-builder.main','plugins.academic-calendar.portfolio-calendar',NULL,'plugins.academic-calendar',5,0,NULL,NULL,'/public/academic-calendar/menu-icon.svg','/public/academic-calendar/menu-icon.svg',NULL,'/private/academic-calendar/config','SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('7d833758-7c04-488f-9995-1de6c9d33bb8','plugins.menu-builder.main','plugins.users.profile-list','plugins.users.users','plugins.users',1,0,NULL,NULL,NULL,NULL,NULL,'/private/users/profiles/list','SELF',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('7fc3ad32-2dec-490a-a1c7-ddf7a17cb254','plugins.menu-builder.main','plugins.tasks.tasks',NULL,'plugins.tasks',11,0,NULL,NULL,'/public/tasks/tasks-menu-icon.svg','/public/tasks/tasks-menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('8145fb89-6d43-4743-a25a-b76041756067','plugins.leebrary.categories','plugins.leebrary.bookmarks',NULL,'plugins.leebrary',NULL,0,NULL,NULL,'/public/leebrary/bookmarks.svg','/public/leebrary/bookmarks.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('817d0c92-e2af-4820-8a5c-a5388d54cfbd','plugins.menu-builder.main','plugins.curriculum.curriculum-library','plugins.curriculum.curriculum','plugins.curriculum',NULL,0,NULL,NULL,NULL,NULL,NULL,'/private/curriculum/list','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('8c32b995-161f-474a-b9a2-aa3a6f19c088','plugins.menu-builder.main','plugins.academic-portfolio.tree','plugins.academic-portfolio.portfolio','plugins.academic-portfolio',5,0,NULL,NULL,NULL,NULL,NULL,'/private/academic-portfolio/tree','SELF',1,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('a16ca1a0-7749-4494-8f44-d12cc7e4db8a','plugins.menu-builder.main','plugins.calendar.calendar-config','plugins.calendar.calendar','plugins.calendar',NULL,0,NULL,NULL,NULL,NULL,NULL,'/private/calendar/config','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('b086f2d6-c084-422b-ac22-b45bd1d801db','plugins.menu-builder.main','plugins.grades.promotions','plugins.grades.rules','plugins.grades',3,0,NULL,NULL,NULL,NULL,NULL,'/private/grades/promotions','SELF',1,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('b2984f6f-def2-4a26-9d22-385e4c2997b4','plugins.menu-builder.main','plugins.academic-portfolio.portfolio',NULL,'plugins.academic-portfolio',4,0,NULL,NULL,'/public/academic-portfolio/menu-icon.svg','/public/academic-portfolio/menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('b99429da-596c-4169-b73c-6dec34fba22f','plugins.menu-builder.main','plugins.scores.scores.periods','plugins.scores.scores','plugins.scores',1,0,NULL,NULL,NULL,NULL,NULL,'/private/scores/periods','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('cd26efeb-414e-43e3-a064-1c83cfb3995c','plugins.leebrary.categories','plugins.leebrary.media-files',NULL,'plugins.leebrary',NULL,0,NULL,NULL,'/public/leebrary/media-files.svg','/public/leebrary/media-files.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('d4133c14-bf44-4c59-9cbd-073b7ef471cc','plugins.leebrary.categories','plugins.leebrary.tests-questions-banks',NULL,'plugins.leebrary',NULL,0,NULL,NULL,'/public/leebrary-tests/menu-icon.svg','/public/leebrary-tests/menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:55','2022-08-03 05:55:55',NULL),('d8d02b09-3005-473e-b1f1-90f350fd985e','plugins.menu-builder.main','plugins.calendar.calendar-classroom','plugins.calendar.calendar','plugins.calendar',NULL,0,NULL,NULL,NULL,NULL,NULL,'/calendar/config/classroom','SELF',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('db2d9e91-133c-48b1-9cb4-8aa559d562d6','plugins.menu-builder.main','plugins.tasks.welcome','plugins.tasks.tasks','plugins.tasks',1,0,NULL,NULL,NULL,NULL,NULL,'/private/tasks/welcome','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('e1425ea4-2726-4714-bd7e-72ebdb14aa9d','plugins.leebrary.categories','plugins.leebrary.assignables.task',NULL,'plugins.leebrary',NULL,0,NULL,NULL,'/public/tasks/leebrary-menu-icon.svg','/public/tasks/leebrary-menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('e23c648f-9c92-4c2d-99f2-6df3e8cdc590','plugins.menu-builder.main','plugins.academic-portfolio.programs','plugins.academic-portfolio.portfolio','plugins.academic-portfolio',3,0,NULL,NULL,NULL,NULL,NULL,'/private/academic-portfolio/programs','SELF',1,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('e246656b-9ae8-43f1-8d1a-e59462ad1367','plugins.menu-builder.main','plugins.users.users-list','plugins.users.users','plugins.users',3,0,NULL,NULL,NULL,NULL,NULL,'/private/users/list','SELF',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('e2edaf8a-1c16-4331-a19b-ebfa39db6817','plugins.menu-builder.main','plugins.leebrary.library',NULL,'plugins.leebrary',13,0,NULL,NULL,'/public/leebrary/menu-icon.svg','/public/leebrary/menu-icon.svg',NULL,'/private/leebrary/','SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('e3a04309-c16c-4dc0-96f6-b0db1ef10661','plugins.menu-builder.main','plugins.academic-portfolio.welcome','plugins.academic-portfolio.portfolio','plugins.academic-portfolio',1,0,NULL,NULL,NULL,NULL,NULL,'/private/academic-portfolio/welcome','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('e4f2a928-3997-48a6-9feb-b0ac314f21af','plugins.menu-builder.main','plugins.grades.welcome','plugins.grades.rules','plugins.grades',1,0,NULL,NULL,NULL,NULL,NULL,'/private/grades/welcome','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('e93774f8-4ceb-4aa0-9a4e-f9b6f867f791','plugins.menu-builder.main','plugins.tests.tests',NULL,'plugins.tests',12,0,NULL,NULL,'/public/tests/menu-icon.svg','/public/tests/menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('ea210d3e-c1c7-49e0-bfb1-4bd6ea0a5f54','plugins.menu-builder.main','plugins.tests.questionBanks','plugins.tests.tests','plugins.tests',4,0,NULL,NULL,NULL,NULL,NULL,'/private/tests/questions-banks','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('f0636b39-b00e-4095-ba5f-573f0a2cd5c8','plugins.leebrary.categories','plugins.leebrary.assignables.tests',NULL,'plugins.leebrary',NULL,0,NULL,NULL,'/public/tests/menu-icon.svg','/public/tests/menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('f82ec0fc-02bd-4b7c-88b7-4fbc75cc8bca','plugins.menu-builder.main','plugins.scores.scores',NULL,'plugins.scores',10,0,NULL,NULL,'/public/scores/menu-icon.svg','/public/scores/menu-icon.svg',NULL,NULL,'SELF',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('fb08a2fe-8734-4e07-befd-3a6920937c45','plugins.menu-builder.main','plugins.grades.evaluations','plugins.grades.rules','plugins.grades',2,0,NULL,NULL,NULL,NULL,NULL,'/private/grades/evaluations','SELF',1,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('fe4e60df-1e0b-457b-b826-0c38e2c708e0','plugins.menu-builder.main','plugins.assignables.activities.ongoing','plugins.assignables.activities','plugins.assignables',1,0,NULL,NULL,NULL,NULL,NULL,'/private/assignables/ongoing','SELF',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL);
/*!40000 ALTER TABLE `plugins_menu-builder::menu-item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_multilanguage::common`
--

DROP TABLE IF EXISTS `plugins_multilanguage::common`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_multilanguage::common` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `locale` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_multilanguage::common`
--

LOCK TABLES `plugins_multilanguage::common` WRITE;
/*!40000 ALTER TABLE `plugins_multilanguage::common` DISABLE KEYS */;
INSERT INTO `plugins_multilanguage::common` VALUES (1,'plugins.users.delete.name','Borrar','es',0),(2,'plugins.users.update.name','Actualizar','es',0),(3,'plugins.users.create.name','Crear','es',0),(4,'plugins.users.view.name','Ver','es',0),(5,'plugins.users.delete.name','Delete','en',0),(6,'plugins.users.update.name','Update','en',0),(7,'plugins.users.create.name','Create','en',0),(8,'plugins.users.view.name','View','en',0),(9,'plugins.users.assign.name','Asignar','es',0),(10,'plugins.users.assign.name','Assign','en',0),(11,'plugins.users.admin.name','Administrador','es',0),(12,'plugins.users.admin.name','Admin','en',0),(13,'plugins.users.plugins.users.user-data.name','Datos del usuario','es',0),(14,'plugins.users.plugins.users.user-data.name','User data','en',0),(15,'plugins.users.plugins.users.centers.name','Centros','es',0),(16,'plugins.users.plugins.users.centers.name','Centers','en',0),(17,'plugins.users.plugins.users.users.name','Usuarios','es',0),(18,'plugins.users.plugins.users.users.name','Users','en',0),(19,'plugins.users.plugins.users.profiles.name','Perfiles','es',0),(20,'plugins.users.plugins.users.profiles.name','Profiles','en',0),(21,'plugins.users.plugins.tasks.tasks.name','Tareas','es',0),(22,'plugins.users.plugins.package-manager.plugins.name','Plugins','es',0),(23,'plugins.users.plugins.calendar.calendar-configs.name','Configurar calendario','es',0),(24,'plugins.users.plugins.calendar.calendar-classroom.name','Calendarios aula','es',0),(25,'plugins.users.plugins.curriculum.curriculum-menu.name','Curriculum Menu','es',0),(26,'plugins.users.plugins.curriculum.curriculum.name','Curriculum','es',0),(27,'plugins.users.plugins.leebrary.library.name','Library','es',0),(28,'plugins.users.plugins.tasks.tasks.name','Tasks','en',0),(29,'plugins.users.plugins.package-manager.plugins.name','Plugins','en',0),(30,'plugins.users.plugins.calendar.calendar-configs.name','Calendar setup','en',0),(31,'plugins.users.plugins.calendar.calendar-classroom.name','Classroom calendars','en',0),(32,'plugins.users.plugins.curriculum.curriculum-menu.name','Curriculum Menu','en',0),(33,'plugins.users.plugins.curriculum.curriculum.name','Curriculum','en',0),(34,'plugins.users.plugins.leebrary.library.name','Library','en',0),(35,'plugins.users.plugins.academic-portfolio.profiles.name','Portfolio Académico - Perfiles','es',0),(36,'plugins.users.plugins.academic-portfolio.subjects.name','Portfolio Académico - Asignaturas','es',0),(37,'plugins.users.plugins.academic-portfolio.tree.name','Portfolio Académico - Árbol','es',0),(38,'plugins.users.plugins.academic-calendar.config.name','Calendario Académico','es',0),(39,'plugins.users.plugins.assignables.activities.name','Actividades','es',0),(40,'plugins.users.plugins.assignables.ongoing.name','Actividades - En curso','es',0),(41,'plugins.users.plugins.assignables.history.name','Actividades - Histórico','es',0),(42,'plugins.users.plugins.calendar.calendar.name','Calendario','es',0),(43,'plugins.users.plugins.academic-portfolio.profiles.name','Academic Portfolio - Profiles','en',0),(44,'plugins.users.plugins.academic-portfolio.subjects.name','Academic Portfolio - Subjects','en',0),(45,'plugins.users.plugins.academic-portfolio.tree.name','Academic Portfolio - Tree','en',0),(46,'plugins.users.plugins.academic-calendar.config.name','Academic Calendar','en',0),(47,'plugins.users.plugins.assignables.activities.name','Activities','en',0),(48,'plugins.users.plugins.assignables.ongoing.name','Activities - Ongoing','en',0),(49,'plugins.users.plugins.assignables.history.name','Activities - History','en',0),(50,'plugins.users.plugins.calendar.calendar.name','Calendar','en',0),(51,'plugins.users.plugins.timetable.config.name','Horario - Configuración','es',0),(52,'plugins.users.plugins.timetable.timetable.name','Horario - Horario','es',0),(53,'plugins.users.plugins.dataset.dataset.name','Datasets','es',0),(54,'plugins.users.plugins.grades.rules.name','Reglas Académicas','es',0),(55,'plugins.users.plugins.grades.evaluations.name','Reglas Académicas - Evaluaciones','es',0),(56,'plugins.users.plugins.grades.promotions.name','Reglas Académicas - Promociones','es',0),(57,'plugins.users.plugins.grades.dependencies.name','Reglas Académicas - Dependencias','es',0),(58,'plugins.users.plugins.academic-portfolio.portfolio.name','Portfolio Académico','es',0),(59,'plugins.users.plugins.academic-portfolio.programs.name','Portfolio Académico - Programas','es',0),(60,'plugins.users.plugins.scores.scoresMenu.name','Evaluaciones (menú)','es',0),(61,'plugins.users.plugins.scores.scores.name','Evaluaciones','es',0),(62,'plugins.users.plugins.scores.periods.name','Periodos','es',0),(63,'plugins.users.plugins.scores.notebook.name','Cuaderno de evaluación','es',0),(64,'plugins.users.plugins.tasks.profiles.name','Tareas - Perfiles','es',0),(65,'plugins.users.plugins.tasks.library.name','Tareas - Librería','es',0),(66,'plugins.users.plugins.timetable.config.name','Timetable - Config','en',0),(67,'plugins.users.plugins.timetable.timetable.name','Timetable - Timetable','en',0),(68,'plugins.users.plugins.dataset.dataset.name','Datasets','en',0),(69,'plugins.users.plugins.grades.rules.name','Academic Rules','en',0),(70,'plugins.users.plugins.grades.evaluations.name','Academic Rules - Evaluations','en',0),(71,'plugins.users.plugins.grades.promotions.name','Academic Rules - Promotions','en',0),(72,'plugins.users.plugins.grades.dependencies.name','Academic Rules - Dependencies','en',0),(73,'plugins.users.plugins.academic-portfolio.portfolio.name','Academic Portfolio','en',0),(74,'plugins.users.plugins.academic-portfolio.programs.name','Academic Portfolio - Programs','en',0),(75,'plugins.users.plugins.scores.scoresMenu.name','Scores (menu)','en',0),(76,'plugins.users.plugins.scores.scores.name','Scores','en',0),(77,'plugins.users.plugins.scores.periods.name','Periods','en',0),(78,'plugins.users.plugins.scores.notebook.name','Evaluation notebook','en',0),(79,'plugins.users.plugins.tasks.profiles.name','Tasks - Profiles','en',0),(80,'plugins.users.plugins.tasks.library.name','Tasks - Library','en',0),(81,'plugins.users.plugins.tests.tests.name','Tests','es',0),(82,'plugins.users.plugins.tests.tests.name','Tests','en',0),(83,'plugins.users.plugins.tests.questionsBanks.name','Tests - Bancos de preguntas','es',0),(84,'plugins.users.plugins.tests.questionsBanks.name','Tests - Questions banks','en',0),(85,'plugins.users.plugins.admin.setup.name','Configuración','es',0),(86,'plugins.users.plugins.admin.setup.name','Config','en',0),(87,'plugins.calendar.kanban.columns.035eaf84-9d34-4694-b5e2-6d200897e3c3','Por hacer','es',0),(88,'plugins.calendar.kanban.columns.a8c1e332-dba0-41a5-bc75-a0793a59bcf0','En progreso','es',0),(89,'plugins.calendar.kanban.columns.cdd402ea-0555-4a20-911a-05171d7c0641','En revisión','es',0),(90,'plugins.calendar.kanban.columns.887d529a-c1a8-41d6-9fc1-31a65199a192','Sin estado','es',0),(91,'plugins.calendar.kanban.columns.035eaf84-9d34-4694-b5e2-6d200897e3c3','To do','en',0),(92,'plugins.calendar.kanban.columns.a8c1e332-dba0-41a5-bc75-a0793a59bcf0','In progress','en',0),(93,'plugins.calendar.kanban.columns.cdd402ea-0555-4a20-911a-05171d7c0641','Under review','en',0),(94,'plugins.calendar.kanban.columns.887d529a-c1a8-41d6-9fc1-31a65199a192','Backlog','en',0),(95,'plugins.calendar.kanban.columns.2bd31e4e-010c-43e6-b94d-2c8d3389b44f','ARCHIVADO','es',0),(96,'plugins.calendar.kanban.columns.7be176da-8dc8-4fdb-aebf-1a42d5e03580','Finalizado','es',0),(97,'plugins.calendar.kanban.columns.2bd31e4e-010c-43e6-b94d-2c8d3389b44f','ARCHIVED','en',0),(98,'plugins.calendar.kanban.columns.7be176da-8dc8-4fdb-aebf-1a42d5e03580','Done','en',0),(99,'plugins.assignables.roles.tests','Tests','es',0),(100,'plugins.assignables.roles.tests','Tests','en',0),(101,'plugins.assignables.roles.task','Tareas','es',0),(102,'plugins.assignables.roles.task','Tasks','en',0);
/*!40000 ALTER TABLE `plugins_multilanguage::common` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_multilanguage::contents`
--

DROP TABLE IF EXISTS `plugins_multilanguage::contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_multilanguage::contents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `locale` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_multilanguage::contents`
--

LOCK TABLES `plugins_multilanguage::contents` WRITE;
/*!40000 ALTER TABLE `plugins_multilanguage::contents` DISABLE KEYS */;
INSERT INTO `plugins_multilanguage::contents` VALUES (1,'plugins.dataset.user-data.plugins.users.description','Añade datos adicionales comunes a todos los usuarios','es',0),(2,'plugins.dataset.user-data.plugins.users.description','Adds additional data common to all users','en',0),(3,'plugins.dataset.user-data.plugins.users.name','Datos del usuarios','es',0),(4,'plugins.dataset.user-data.plugins.users.name','User data','en',0),(5,'plugins.menu-builder.plugins.menu-builder.main.plugins.users.users.label','Usuarios','es',0),(6,'plugins.menu-builder.plugins.menu-builder.main.plugins.users.users.label','Users','en',0),(7,'plugins.menu-builder.plugins.menu-builder.main.plugins.calendar.calendar.label','Calendario','es',0),(8,'plugins.menu-builder.plugins.menu-builder.main.plugins.curriculum.curriculum.label','Curriculum','es',0),(9,'plugins.menu-builder.plugins.menu-builder.main.plugins.calendar.calendar.label','Calendar','en',0),(10,'plugins.menu-builder.plugins.menu-builder.main.plugins.curriculum.curriculum.label','Curriculum','en',0),(11,'plugins.menu-builder.plugins.menu-builder.main.plugins.users.user-data.label','Datos del usuario','es',0),(12,'plugins.menu-builder.plugins.menu-builder.main.plugins.users.profile-list.label','Perfiles','es',0),(13,'plugins.menu-builder.plugins.menu-builder.main.plugins.users.users-list.label','Listado de usuarios','es',0),(14,'plugins.menu-builder.plugins.menu-builder.main.plugins.users.user-data.label','User data','en',0),(15,'plugins.menu-builder.plugins.menu-builder.main.plugins.users.profile-list.label','Profiles','en',0),(16,'plugins.menu-builder.plugins.menu-builder.main.plugins.users.users-list.label','Users list','en',0),(17,'plugins.menu-builder.plugins.menu-builder.main.plugins.dashboard.dashboard.label','Panel de control','es',0),(18,'plugins.menu-builder.plugins.menu-builder.main.plugins.dashboard.dashboard.label','Dashboard','en',0),(19,'plugins.menu-builder.plugins.menu-builder.main.plugins.calendar.kanban.label','Kanban','es',0),(20,'plugins.menu-builder.plugins.menu-builder.main.plugins.calendar.kanban.label','Kanban','en',0),(21,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.tasks.label','Tareas','es',0),(22,'plugins.menu-builder.plugins.menu-builder.main.plugins.curriculum.curriculum-new.label','Nuevo curriculum','es',0),(23,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.tests.label','Tests','es',0),(24,'plugins.menu-builder.plugins.menu-builder.main.plugins.assignables.activities.label','Actividades en curso','es',0),(25,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-calendar.portfolio-calendar.label','Calendario Académico','es',0),(26,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.portfolio.label','Portfolio Académico','es',0),(27,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.rules.label','Reglas Académicas','es',0),(28,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.tests.label','Tests','en',0),(29,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.tasks.label','Tasks','en',0),(30,'plugins.menu-builder.plugins.menu-builder.main.plugins.curriculum.curriculum-new.label','New curriculum','en',0),(31,'plugins.menu-builder.plugins.menu-builder.main.plugins.assignables.activities.label','Ongoing Activities','en',0),(32,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-calendar.portfolio-calendar.label','Academic Calendar','en',0),(33,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.portfolio.label','Academic Portfolio','en',0),(34,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.rules.label','Academic Rules','en',0),(35,'plugins.menu-builder.plugins.menu-builder.main.plugins.scores.scores.label','Evaluaciones','es',0),(36,'plugins.menu-builder.plugins.menu-builder.main.plugins.scores.scores.label','Scores','en',0),(37,'plugins.menu-builder.plugins.menu-builder.main.plugins.leebrary.library.label','Librería','es',0),(38,'plugins.menu-builder.plugins.menu-builder.main.plugins.leebrary.library.label','Library','en',0),(39,'plugins.menu-builder.plugins.menu-builder.main.plugins.scores.scores.notebook.label','Cuaderno de notas','es',0),(40,'plugins.menu-builder.plugins.menu-builder.main.plugins.scores.scores.scores.label','Notas','es',0),(41,'plugins.menu-builder.plugins.menu-builder.main.plugins.scores.scores.periods.label','Periodos','es',0),(42,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.promotions.label','Reglas de promoción','es',0),(43,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.dependencies.label','Dependencias','es',0),(44,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.evaluations.label','Sistemas de evaluación','es',0),(45,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.welcome.label','Bienvenida','es',0),(46,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.subjects.label','Asignaturas','es',0),(47,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.tree.label','Árbol académico','es',0),(48,'plugins.menu-builder.plugins.menu-builder.main.plugins.assignables.activities.history.label','Histórico','es',0),(49,'plugins.menu-builder.plugins.menu-builder.main.plugins.assignables.activities.ongoing.label','En curso','es',0),(50,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.welcome.label','Bienvenida','es',0),(51,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.profiles.label','Perfiles','es',0),(52,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.programs.label','Programas educativos','es',0),(53,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.programs.label','Learning Programs','en',0),(54,'plugins.menu-builder.plugins.menu-builder.main.plugins.scores.scores.notebook.label','Evaluation Notebook','en',0),(55,'plugins.menu-builder.plugins.menu-builder.main.plugins.scores.scores.scores.label','Scores','en',0),(56,'plugins.menu-builder.plugins.menu-builder.main.plugins.scores.scores.periods.label','Periods','en',0),(57,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.promotions.label','Promotion rules','en',0),(58,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.dependencies.label','Dependencies','en',0),(59,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.evaluations.label','Evaluation system','en',0),(60,'plugins.menu-builder.plugins.menu-builder.main.plugins.grades.welcome.label','Welcome','en',0),(61,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.subjects.label','Subjects','en',0),(62,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.tree.label','Portfolio Tree','en',0),(63,'plugins.menu-builder.plugins.menu-builder.main.plugins.assignables.activities.history.label','History','en',0),(64,'plugins.menu-builder.plugins.menu-builder.main.plugins.assignables.activities.ongoing.label','Ongoing','en',0),(65,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.welcome.label','Welcome','en',0),(66,'plugins.menu-builder.plugins.menu-builder.main.plugins.academic-portfolio.profiles.label','Profiles','en',0),(67,'plugins.menu-builder.plugins.menu-builder.main.plugins.calendar.calendar-config.label','Configuración calendario','es',0),(68,'plugins.menu-builder.plugins.menu-builder.main.plugins.calendar.calendar-config.label','Calendar setup','en',0),(69,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.new-task.label','Nueva tarea','es',0),(70,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.library.label','Librería','es',0),(71,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.welcome.label','Bienvenida','es',0),(72,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.profiles.label','Perfiles','es',0),(73,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.new-task.label','New task','en',0),(74,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.library.label','Library','en',0),(75,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.welcome.label','Welcome','en',0),(76,'plugins.menu-builder.plugins.menu-builder.main.plugins.tasks.profiles.label','Profiles','en',0),(77,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.new-test.label','Nuevo test','es',0),(78,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.questionBanks.label','Bancos de preguntas','es',0),(79,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.new-questionBanks.label','Nuevo banco de preguntas','es',0),(80,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.new-questionBanks.label','New question bank','en',0),(81,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.new-test.label','New tests','en',0),(82,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.questionBanks.label','Questions banks','en',0),(83,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.test.label','Librería de tests','es',0),(84,'plugins.menu-builder.plugins.menu-builder.main.plugins.tests.test.label','Tests library','en',0),(85,'plugins.menu-builder.plugins.menu-builder.main.plugins.curriculum.curriculum-library.label','Libreria','es',0),(86,'plugins.menu-builder.plugins.menu-builder.main.plugins.curriculum.curriculum-library.label','Library','en',0),(87,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.media-files.label','Archivos multimedia','es',0),(88,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.media-files.label','Media files','en',0),(89,'plugins.menu-builder.plugins.menu-builder.main.plugins.calendar.calendar-classroom.label','Calendarios','es',0),(90,'plugins.menu-builder.plugins.menu-builder.main.plugins.calendar.calendar-classroom.label','Calendars','en',0),(91,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.bookmarks.label','Marcadores','es',0),(92,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.bookmarks.label','Bookmarks','en',0),(93,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.assignables.tests.label','Tests','es',0),(94,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.assignables.tests.label','Tests','en',0),(95,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.assignables.task.label','Tareas','es',0),(96,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.assignables.task.label','Tasks','en',0),(97,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.tests-questions-banks.label','Bancos de preguntas','es',0),(98,'plugins.menu-builder.plugins.leebrary.categories.plugins.leebrary.tests-questions-banks.label','Questions Banks','en',0);
/*!40000 ALTER TABLE `plugins_multilanguage::contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_multilanguage::locales`
--

DROP TABLE IF EXISTS `plugins_multilanguage::locales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_multilanguage::locales` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(12) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_multilanguage::locales_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_multilanguage::locales`
--

LOCK TABLES `plugins_multilanguage::locales` WRITE;
/*!40000 ALTER TABLE `plugins_multilanguage::locales` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_multilanguage::locales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_scores::periods`
--

DROP TABLE IF EXISTS `plugins_scores::periods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_scores::periods` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `center` char(36) NOT NULL,
  `program` char(36) NOT NULL,
  `course` char(36) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `createdBy` char(36) DEFAULT NULL,
  `public` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_scores::periods`
--

LOCK TABLES `plugins_scores::periods` WRITE;
/*!40000 ALTER TABLE `plugins_scores::periods` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_scores::periods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::attachments`
--

DROP TABLE IF EXISTS `plugins_tasks::attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::attachments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `task` varchar(255) DEFAULT NULL,
  `attachment` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::attachments`
--

LOCK TABLES `plugins_tasks::attachments` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::groups`
--

DROP TABLE IF EXISTS `plugins_tasks::groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::groups` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `group` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `subject` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::groups`
--

LOCK TABLES `plugins_tasks::groups` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::groupsInstances`
--

DROP TABLE IF EXISTS `plugins_tasks::groupsInstances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::groupsInstances` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `group` varchar(255) DEFAULT NULL,
  `instance` char(36) DEFAULT NULL,
  `student` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::groupsInstances`
--

LOCK TABLES `plugins_tasks::groupsInstances` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::groupsInstances` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::groupsInstances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::instances`
--

DROP TABLE IF EXISTS `plugins_tasks::instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::instances` (
  `id` char(36) NOT NULL,
  `task` varchar(255) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `visualizationDate` datetime DEFAULT NULL,
  `executionTime` int DEFAULT NULL,
  `alwaysOpen` tinyint(1) DEFAULT NULL,
  `closeDate` datetime DEFAULT NULL,
  `message` text,
  `status` varchar(255) DEFAULT NULL,
  `showCurriculum` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::instances`
--

LOCK TABLES `plugins_tasks::instances` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::instances` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::instances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::profiles`
--

DROP TABLE IF EXISTS `plugins_tasks::profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::profiles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `profile` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::profiles`
--

LOCK TABLES `plugins_tasks::profiles` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::settings`
--

DROP TABLE IF EXISTS `plugins_tasks::settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::settings` (
  `id` char(36) NOT NULL,
  `hideWelcome` tinyint(1) DEFAULT NULL,
  `configured` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::settings`
--

LOCK TABLES `plugins_tasks::settings` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::tags`
--

DROP TABLE IF EXISTS `plugins_tasks::tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::tags` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `task` char(36) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::tags`
--

LOCK TABLES `plugins_tasks::tags` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::taskAssessmentCriteria`
--

DROP TABLE IF EXISTS `plugins_tasks::taskAssessmentCriteria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::taskAssessmentCriteria` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `task` varchar(255) DEFAULT NULL,
  `assessmentCriteria` varchar(255) DEFAULT NULL,
  `subject` char(36) DEFAULT NULL,
  `position` int DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::taskAssessmentCriteria`
--

LOCK TABLES `plugins_tasks::taskAssessmentCriteria` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::taskAssessmentCriteria` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::taskAssessmentCriteria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::taskContents`
--

DROP TABLE IF EXISTS `plugins_tasks::taskContents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::taskContents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `task` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `subject` char(36) DEFAULT NULL,
  `position` int DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::taskContents`
--

LOCK TABLES `plugins_tasks::taskContents` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::taskContents` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::taskContents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::taskObjectives`
--

DROP TABLE IF EXISTS `plugins_tasks::taskObjectives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::taskObjectives` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `task` varchar(255) DEFAULT NULL,
  `objective` varchar(255) DEFAULT NULL,
  `subject` char(36) DEFAULT NULL,
  `position` int DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::taskObjectives`
--

LOCK TABLES `plugins_tasks::taskObjectives` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::taskObjectives` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::taskObjectives` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::tasks`
--

DROP TABLE IF EXISTS `plugins_tasks::tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::tasks` (
  `id` varchar(255) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `summary` text,
  `cover` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `methodology` varchar(255) DEFAULT NULL,
  `recommendedDuration` int DEFAULT NULL,
  `statement` text,
  `development` text,
  `submissions` json DEFAULT NULL,
  `preTask` varchar(255) DEFAULT NULL,
  `preTaskOptions` json DEFAULT NULL,
  `selfReflection` json DEFAULT NULL,
  `feedback` json DEFAULT NULL,
  `instructionsForTeacher` text,
  `instructionsForStudent` text,
  `center` char(36) DEFAULT NULL,
  `program` char(36) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::tasks`
--

LOCK TABLES `plugins_tasks::tasks` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::taskSubjects`
--

DROP TABLE IF EXISTS `plugins_tasks::taskSubjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::taskSubjects` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `task` varchar(255) NOT NULL,
  `course` varchar(255) NOT NULL,
  `subject` char(36) NOT NULL,
  `level` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::taskSubjects`
--

LOCK TABLES `plugins_tasks::taskSubjects` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::taskSubjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::taskSubjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::tasksVersioning`
--

DROP TABLE IF EXISTS `plugins_tasks::tasksVersioning`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::tasksVersioning` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `last` varchar(255) DEFAULT NULL,
  `current` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::tasksVersioning`
--

LOCK TABLES `plugins_tasks::tasksVersioning` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::tasksVersioning` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::tasksVersioning` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::tasksVersions`
--

DROP TABLE IF EXISTS `plugins_tasks::tasksVersions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::tasksVersions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `task` char(36) DEFAULT NULL,
  `major` int DEFAULT NULL,
  `minor` int DEFAULT NULL,
  `patch` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::tasksVersions`
--

LOCK TABLES `plugins_tasks::tasksVersions` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::tasksVersions` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::tasksVersions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::teacherInstances`
--

DROP TABLE IF EXISTS `plugins_tasks::teacherInstances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::teacherInstances` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `instance` char(36) DEFAULT NULL,
  `teacher` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::teacherInstances`
--

LOCK TABLES `plugins_tasks::teacherInstances` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::teacherInstances` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::teacherInstances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::userDeliverables`
--

DROP TABLE IF EXISTS `plugins_tasks::userDeliverables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::userDeliverables` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `instance` char(36) DEFAULT NULL,
  `user` char(36) DEFAULT NULL,
  `deliverable` json DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::userDeliverables`
--

LOCK TABLES `plugins_tasks::userDeliverables` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::userDeliverables` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::userDeliverables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tasks::userInstances`
--

DROP TABLE IF EXISTS `plugins_tasks::userInstances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tasks::userInstances` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `instance` char(36) DEFAULT NULL,
  `user` char(36) DEFAULT NULL,
  `opened` datetime DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `grade` char(36) DEFAULT NULL,
  `teacherFeedback` text,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tasks::userInstances`
--

LOCK TABLES `plugins_tasks::userInstances` WRITE;
/*!40000 ALTER TABLE `plugins_tasks::userInstances` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tasks::userInstances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tests::assign-saved-config`
--

DROP TABLE IF EXISTS `plugins_tests::assign-saved-config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tests::assign-saved-config` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `config` json DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tests::assign-saved-config`
--

LOCK TABLES `plugins_tests::assign-saved-config` WRITE;
/*!40000 ALTER TABLE `plugins_tests::assign-saved-config` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tests::assign-saved-config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tests::question-bank-categories`
--

DROP TABLE IF EXISTS `plugins_tests::question-bank-categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tests::question-bank-categories` (
  `id` char(36) NOT NULL,
  `questionBank` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `order` float(8,2) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tests::question-bank-categories`
--

LOCK TABLES `plugins_tests::question-bank-categories` WRITE;
/*!40000 ALTER TABLE `plugins_tests::question-bank-categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tests::question-bank-categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tests::question-bank-subjects`
--

DROP TABLE IF EXISTS `plugins_tests::question-bank-subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tests::question-bank-subjects` (
  `id` char(36) NOT NULL,
  `questionBank` varchar(255) DEFAULT NULL,
  `subject` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_tests::question_bank_subjects_subject_foreign` (`subject`),
  CONSTRAINT `plugins_tests::question_bank_subjects_subject_foreign` FOREIGN KEY (`subject`) REFERENCES `plugins_academic-portfolio::subjects` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tests::question-bank-subjects`
--

LOCK TABLES `plugins_tests::question-bank-subjects` WRITE;
/*!40000 ALTER TABLE `plugins_tests::question-bank-subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tests::question-bank-subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tests::questions`
--

DROP TABLE IF EXISTS `plugins_tests::questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tests::questions` (
  `id` char(36) NOT NULL,
  `questionBank` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `withImages` tinyint(1) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `question` text,
  `questionImage` varchar(255) DEFAULT NULL,
  `clues` json DEFAULT NULL,
  `category` char(36) DEFAULT NULL,
  `properties` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_tests::questions_category_foreign` (`category`),
  CONSTRAINT `plugins_tests::questions_category_foreign` FOREIGN KEY (`category`) REFERENCES `plugins_tests::question-bank-categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tests::questions`
--

LOCK TABLES `plugins_tests::questions` WRITE;
/*!40000 ALTER TABLE `plugins_tests::questions` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tests::questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tests::questions-banks`
--

DROP TABLE IF EXISTS `plugins_tests::questions-banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tests::questions-banks` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `program` char(36) DEFAULT NULL,
  `published` tinyint(1) DEFAULT '0',
  `asset` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_tests::questions_banks_program_foreign` (`program`),
  CONSTRAINT `plugins_tests::questions_banks_program_foreign` FOREIGN KEY (`program`) REFERENCES `plugins_academic-portfolio::programs` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tests::questions-banks`
--

LOCK TABLES `plugins_tests::questions-banks` WRITE;
/*!40000 ALTER TABLE `plugins_tests::questions-banks` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tests::questions-banks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tests::questions-tests`
--

DROP TABLE IF EXISTS `plugins_tests::questions-tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tests::questions-tests` (
  `id` char(36) NOT NULL,
  `test` varchar(255) DEFAULT NULL,
  `question` char(36) DEFAULT NULL,
  `order` float(8,2) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_tests::questions_tests_question_foreign` (`question`),
  CONSTRAINT `plugins_tests::questions_tests_question_foreign` FOREIGN KEY (`question`) REFERENCES `plugins_tests::questions` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tests::questions-tests`
--

LOCK TABLES `plugins_tests::questions-tests` WRITE;
/*!40000 ALTER TABLE `plugins_tests::questions-tests` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tests::questions-tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tests::tests`
--

DROP TABLE IF EXISTS `plugins_tests::tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tests::tests` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `questionBank` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `level` varchar(255) DEFAULT NULL,
  `statement` text,
  `instructionsForTeacher` text,
  `instructionsForStudent` text,
  `filters` text,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tests::tests`
--

LOCK TABLES `plugins_tests::tests` WRITE;
/*!40000 ALTER TABLE `plugins_tests::tests` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tests::tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tests::user-agent-assignable-instance-responses`
--

DROP TABLE IF EXISTS `plugins_tests::user-agent-assignable-instance-responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tests::user-agent-assignable-instance-responses` (
  `id` char(36) NOT NULL,
  `instance` varchar(255) DEFAULT NULL,
  `question` char(36) DEFAULT NULL,
  `userAgent` varchar(255) DEFAULT NULL,
  `clues` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `points` float(8,2) DEFAULT NULL,
  `properties` json DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tests::user-agent-assignable-instance-responses`
--

LOCK TABLES `plugins_tests::user-agent-assignable-instance-responses` WRITE;
/*!40000 ALTER TABLE `plugins_tests::user-agent-assignable-instance-responses` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tests::user-agent-assignable-instance-responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_tests::user-feedback`
--

DROP TABLE IF EXISTS `plugins_tests::user-feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_tests::user-feedback` (
  `id` char(36) NOT NULL,
  `instance` varchar(255) DEFAULT NULL,
  `toUserAgent` varchar(255) DEFAULT NULL,
  `fromUserAgent` varchar(255) DEFAULT NULL,
  `feedback` text,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_tests::user-feedback`
--

LOCK TABLES `plugins_tests::user-feedback` WRITE;
/*!40000 ALTER TABLE `plugins_tests::user-feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_tests::user-feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_timetable::breaks`
--

DROP TABLE IF EXISTS `plugins_timetable::breaks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_timetable::breaks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `timetable` int unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `start` time DEFAULT NULL,
  `end` time DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `plugins_timetable::breaks_timetable_foreign` (`timetable`),
  CONSTRAINT `plugins_timetable::breaks_timetable_foreign` FOREIGN KEY (`timetable`) REFERENCES `plugins_timetable::config` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_timetable::breaks`
--

LOCK TABLES `plugins_timetable::breaks` WRITE;
/*!40000 ALTER TABLE `plugins_timetable::breaks` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_timetable::breaks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_timetable::config`
--

DROP TABLE IF EXISTS `plugins_timetable::config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_timetable::config` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `days` varchar(255) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `slot` int NOT NULL,
  `entities` varchar(255) NOT NULL,
  `entityTypes` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_timetable::config`
--

LOCK TABLES `plugins_timetable::config` WRITE;
/*!40000 ALTER TABLE `plugins_timetable::config` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_timetable::config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_timetable::settings`
--

DROP TABLE IF EXISTS `plugins_timetable::settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_timetable::settings` (
  `id` char(36) NOT NULL,
  `hideWelcome` tinyint(1) DEFAULT NULL,
  `configured` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_timetable::settings`
--

LOCK TABLES `plugins_timetable::settings` WRITE;
/*!40000 ALTER TABLE `plugins_timetable::settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_timetable::settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_timetable::timetable`
--

DROP TABLE IF EXISTS `plugins_timetable::timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_timetable::timetable` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `class` char(36) DEFAULT NULL,
  `day` varchar(255) DEFAULT NULL,
  `dayWeek` int DEFAULT NULL,
  `start` varchar(255) DEFAULT NULL,
  `end` varchar(255) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_timetable::timetable`
--

LOCK TABLES `plugins_timetable::timetable` WRITE;
/*!40000 ALTER TABLE `plugins_timetable::timetable` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_timetable::timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::actions`
--

DROP TABLE IF EXISTS `plugins_users::actions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::actions` (
  `id` char(36) NOT NULL,
  `actionName` varchar(255) NOT NULL,
  `order` int DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_users::actions_actionname_unique` (`actionName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::actions`
--

LOCK TABLES `plugins_users::actions` WRITE;
/*!40000 ALTER TABLE `plugins_users::actions` DISABLE KEYS */;
INSERT INTO `plugins_users::actions` VALUES ('481143cd-f848-4c64-9848-30de368105cc','assign',41,0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('855b8491-7ef1-4ce3-ba87-054b9a161ae7','delete',31,0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('c5010ca4-9796-4426-8e85-6f782ed5f192','view',1,0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('cb019504-c449-413e-9712-5014a5bbdcb5','admin',51,0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('d9b66f4b-714f-49af-9e8d-0bf24ebab155','create',21,0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('f92e2237-818d-4190-8831-ee3cba78855e','update',11,0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL);
/*!40000 ALTER TABLE `plugins_users::actions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::centers`
--

DROP TABLE IF EXISTS `plugins_users::centers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::centers` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `locale` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `uri` varchar(255) NOT NULL,
  `timezone` varchar(255) DEFAULT NULL,
  `firstDayOfWeek` float(8,2) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `postalCode` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `contactEmail` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_users::centers_name_unique` (`name`),
  UNIQUE KEY `plugins_users::centers_uri_unique` (`uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::centers`
--

LOCK TABLES `plugins_users::centers` WRITE;
/*!40000 ALTER TABLE `plugins_users::centers` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::centers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::config`
--

DROP TABLE IF EXISTS `plugins_users::config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::config` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_users::config_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::config`
--

LOCK TABLES `plugins_users::config` WRITE;
/*!40000 ALTER TABLE `plugins_users::config` DISABLE KEYS */;
INSERT INTO `plugins_users::config` VALUES ('66784171-b322-49e1-ab63-5800094aba39','jwt-private-key','rs7c453701b56d57b914f8c79e58a45aa9b9dc392835d5e3e9d839d9edb564',0,'2022-08-03 05:55:44','2022-08-03 05:55:44',NULL);
/*!40000 ALTER TABLE `plugins_users::config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::group-role`
--

DROP TABLE IF EXISTS `plugins_users::group-role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::group-role` (
  `id` char(36) NOT NULL,
  `group` char(36) DEFAULT NULL,
  `role` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::group_role_group_foreign` (`group`),
  KEY `plugins_users::group_role_role_foreign` (`role`),
  CONSTRAINT `plugins_users::group_role_group_foreign` FOREIGN KEY (`group`) REFERENCES `plugins_users::groups` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::group_role_role_foreign` FOREIGN KEY (`role`) REFERENCES `plugins_users::roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::group-role`
--

LOCK TABLES `plugins_users::group-role` WRITE;
/*!40000 ALTER TABLE `plugins_users::group-role` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::group-role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::group-user-agent`
--

DROP TABLE IF EXISTS `plugins_users::group-user-agent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::group-user-agent` (
  `id` char(36) NOT NULL,
  `group` char(36) DEFAULT NULL,
  `userAgent` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::group_user_agent_group_foreign` (`group`),
  KEY `plugins_users::group_user_agent_useragent_foreign` (`userAgent`),
  CONSTRAINT `plugins_users::group_user_agent_group_foreign` FOREIGN KEY (`group`) REFERENCES `plugins_users::groups` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::group_user_agent_useragent_foreign` FOREIGN KEY (`userAgent`) REFERENCES `plugins_users::user-agent` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::group-user-agent`
--

LOCK TABLES `plugins_users::group-user-agent` WRITE;
/*!40000 ALTER TABLE `plugins_users::group-user-agent` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::group-user-agent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::groups`
--

DROP TABLE IF EXISTS `plugins_users::groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::groups` (
  `id` char(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::groups`
--

LOCK TABLES `plugins_users::groups` WRITE;
/*!40000 ALTER TABLE `plugins_users::groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::item-permissions`
--

DROP TABLE IF EXISTS `plugins_users::item-permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::item-permissions` (
  `id` char(36) NOT NULL,
  `permissionName` text NOT NULL,
  `actionName` varchar(255) NOT NULL,
  `target` varchar(255) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `item` varchar(255) NOT NULL,
  `center` text,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::item-permissions`
--

LOCK TABLES `plugins_users::item-permissions` WRITE;
/*!40000 ALTER TABLE `plugins_users::item-permissions` DISABLE KEYS */;
INSERT INTO `plugins_users::item-permissions` VALUES ('010bd19c-804e-4a0e-b098-0b8dbd8dd3f2','plugins.leebrary.library','create',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.bookmarks',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('039bfd31-1229-418f-9a0e-fefd20f8c177','plugins.tests.questionsBanks','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tests.questionBanks',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('07559e95-f581-4a4a-92aa-b67aae227279','plugins.leebrary.library','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.leebrary.library',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('07af1000-c6ac-4639-98f5-7464beec4258','plugins.tasks.library','admin',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.assignables.task',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('0f0f92d7-7bef-4401-aca2-525893596ca3','plugins.grades.evaluations','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.grades.evaluations',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('0fcaba9f-26d7-4d33-b500-c27ee3333e25','plugins.users.user-data','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.users.user-data',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('11f05661-8360-4181-b5ef-d83449cd22b0','plugins.assignables.history','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.assignables.activities.history',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('1591b143-6f6c-4f69-8238-08f5e74942bf','plugins.academic-portfolio.programs','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.academic-portfolio.programs',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('1729dd45-4bd5-4c67-8d73-1a5038bd93a4','plugins.scores.scoresMenu','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.scores.scores',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('17d491dd-2ffe-44ba-a69f-b26cab1c5cf0','plugins.tasks.library','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.library',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('1836b8c1-878b-4555-99e0-b7fcdf72015e','plugins.curriculum.curriculum','create',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.curriculum.curriculum-new',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('19cdb7b5-8421-49e0-970a-4cfb48e9c723','plugins.curriculum.curriculum','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.curriculum.curriculum-new',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('1c8f13a1-c4e1-467a-819b-59b8c803f27d','plugins.leebrary.library','update',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.bookmarks',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('20f6a55d-a5cf-4ace-84f7-f052b7f308fe','plugins.tasks.profiles','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.profiles',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('21282ca7-fe3b-4473-a1e6-555e446a402f','plugins.calendar.calendar','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.calendar.kanban',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('22e9038d-97e4-4a35-aa3b-fb0fcaf43b59','plugins.leebrary.library','view',NULL,'plugins.menu-builder.menu','plugins.leebrary.categories',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('2406ad21-f19d-4a5b-8ecb-70c4ef936deb','plugins.tasks.library','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.library',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('2751e01e-d93b-4fcc-9918-2e469ef439a7','plugins.leebrary.library','create',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.media-files',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('283fbb05-b40f-40c5-82b9-862cc2023494','plugins.leebrary.library','update',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.media-files',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('2c9dc9ec-37d0-4a7b-9b0b-d985406d4379','plugins.leebrary.library','create',NULL,'plugins.menu-builder.menu','plugins.leebrary.categories',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('2cb555de-9628-45e9-a3a4-1216e91c3b61','plugins.leebrary.library','view',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.bookmarks',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('2d6d1533-21e3-4962-972b-b92b7308d901','plugins.users.profiles','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.users.profile-list',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('2eee1743-5d40-4223-8d72-328ba3a87091','plugins.calendar.calendar','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.calendar.kanban',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('2fc0aa5e-d819-4054-98ab-5d02ae3b66cc','plugins.tests.questionsBanks','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tests.new-questionBanks',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('31ba2544-680e-414a-bd1e-4b6a944b0fb6','plugins.users.users','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.users.users',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('34478b7b-e564-4434-acdc-8977e3801141','plugins.calendar.calendar','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.calendar.calendar',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('37d94a4a-9b32-48f8-836c-5dbf82a4b9d4','plugins.tasks.profiles','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.welcome',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('386927c2-1a3d-48d4-b843-5bcdc5f46136','plugins.scores.periods','create',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.scores.scores.periods',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('39dce949-8b14-4947-beb4-17617734b542','plugins.tests.tests','admin',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.assignables.tests',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('3ebc9cd4-24de-4cab-8aaa-2109be723c2e','plugins.users.profiles','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.users.profile-list',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('439faa79-8a23-4142-aa4d-4d22c5831bce','plugins.tasks.tasks','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.tasks',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('4721bc6b-0d96-48e8-bce1-76048bc4228f','plugins.leebrary.library','admin',NULL,'plugins.menu-builder.menu','plugins.leebrary.categories',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('4ba58571-fa60-4347-840e-7ca768a68250','plugins.leebrary.library','admin',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.media-files',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('5963bfd4-cf65-4974-8360-db1e70286d06','plugins.academic-portfolio.tree','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.academic-portfolio.tree',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('5e1f2d77-3080-4dc8-b744-d7700632aab6','plugins.users.any','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.dashboard.dashboard',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('683523ea-8239-4cfe-a041-ca5bd1c3658d','plugins.academic-portfolio.profiles','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.academic-portfolio.profiles',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('68679ab0-8e34-40b4-b99a-8878ec9ecc2c','plugins.tasks.library','view',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.assignables.task',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('69cbfd8c-6ec2-4c6c-a60c-51a2e3fc7d70','plugins.calendar.calendar','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.calendar.calendar',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('6b4fb475-dede-4e8c-8f67-aa97585d5be3','plugins.scores.scores','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.scores.scores.scores',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('707466cc-a7a3-4296-8ce3-b3adec17bcf9','plugins.curriculum.curriculum-menu','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.curriculum.curriculum',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('75ec10fb-20c7-4096-b838-d670b3102c4a','plugins.users.users','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.users.users-list',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('7c96e8bd-bb39-45b1-9152-64ba6cc4d773','plugins.calendar.calendar-classroom','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.calendar.calendar-classroom',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('81ae2352-ce3c-41be-9d63-284be9865743','plugins.tests.tests','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tests.new-test',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('83520c5d-6667-490f-a693-22e2cb90bc23','plugins.tasks.tasks','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.tasks',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('856d84e5-05fa-4ba2-89b4-ccaef4b8ec73','plugins.academic-calendar.config','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.academic-calendar.portfolio-calendar',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('87d521a7-ba98-4cdf-878b-1405459f433c','plugins.leebrary.library','create',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.leebrary.library',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('88bc1da7-72d9-4f75-aefb-fae903ca4330','plugins.assignables.ongoing','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.assignables.activities.ongoing',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('8a4a480b-58eb-4920-b780-5272655c2442','plugins.academic-portfolio.subjects','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.academic-portfolio.subjects',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('8bf2fd97-c988-45c4-ab3a-d09e2f2a12ef','plugins.assignables.activities','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.assignables.activities',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('90168d7a-76bc-4af6-a231-543486cdee33','plugins.tasks.profiles','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.profiles',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('92a696a3-4c2c-425d-95fe-a9bda27431ea','plugins.leebrary.library','delete',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.leebrary.library',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('950e83de-7c83-452b-92a2-a7ce7acbcfb7','plugins.tests.tests','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tests.test',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('95ce9ad3-0fe7-496d-96e6-0cf0a57339fd','plugins.curriculum.curriculum-menu','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.curriculum.curriculum-library',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('9927b0e5-c450-4abd-be78-d57fd855327b','plugins.tests.questionsBanks','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tests.tests',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('9f078296-f7b5-4661-81f3-6bf1b61858d1','plugins.scores.periods','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.scores.scores.periods',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('9f58e8e1-03fc-47eb-9103-de02c164ae27','plugins.tests.questionsBanks','admin',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.tests-questions-banks',NULL,0,'2022-08-03 05:55:55','2022-08-03 05:55:55',NULL),('a284368d-06c1-4e3c-9e7a-2dc98b6fea1b','plugins.curriculum.curriculum','update',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.curriculum.curriculum-new',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('aa89fa94-b724-4090-9faa-0b2f4fec7225','plugins.scores.periods','delete',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.scores.scores.periods',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('aaccd22c-7c75-4c68-8027-a365c944f107','plugins.scores.notebook','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.scores.scores.notebook',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('aaea9fc7-b014-4217-8f0f-5be646374c43','plugins.tests.tests','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tests.tests',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('ae96beb3-2230-4a2e-8faf-463fba880416','plugins.leebrary.library','update',NULL,'plugins.menu-builder.menu','plugins.leebrary.categories',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('afbbd49f-c91d-431b-8cac-7f99b5d977d9','plugins.tasks.library','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.new-task',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('b038ffa6-5410-4343-b0b4-cd0eb237afff','plugins.scores.periods','update',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.scores.scores.periods',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('b0eed9d7-b0be-41cf-ae96-982a4c1f5d64','plugins.leebrary.library','view',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.media-files',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('bd678c9d-0373-48a9-af05-0b0b0742a2a0','plugins.leebrary.library','delete',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.bookmarks',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('c54ebc5f-6f5f-49fc-827f-077cbed15c1a','plugins.tasks.profiles','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.welcome',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('c8942a81-3016-44bd-ad06-658d34db8783','plugins.calendar.calendar-configs','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.calendar.calendar-config',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('d6efc646-5714-4e6b-9e0c-5ec38910454a','plugins.leebrary.library','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.leebrary.library',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('d853dd12-46d9-45d4-81cc-f0eb32265e4c','plugins.leebrary.library','delete',NULL,'plugins.menu-builder.menu','plugins.leebrary.categories',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('daaf1e10-1a4a-49a4-9aee-637a702fea71','plugins.grades.dependencies','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.grades.dependencies',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('e02e77a4-85e6-4e24-84dc-2dc8c804fc74','plugins.calendar.calendar-configs','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.calendar.calendar-config',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('e0ff53ec-31b1-41bd-87f3-c2102ac91a7a','plugins.scores.notebook','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.scores.scores.notebook',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('e3465953-3e45-4753-9138-d90f550b9056','plugins.tasks.library','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.tasks.new-task',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('eb8a32ae-c270-4b80-942b-2f7633ef5329','plugins.grades.promotions','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.grades.promotions',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('ec4f3678-ac10-4161-a17c-1acd5d2cd6cc','plugins.academic-portfolio.portfolio','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.academic-portfolio.portfolio',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('ec51d099-7544-4299-953a-bddd6eef644f','plugins.academic-portfolio.profiles','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.academic-portfolio.welcome',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('f2a34525-c289-4fb1-948f-bf5e850b2fbd','plugins.leebrary.library','admin',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.bookmarks',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('f4f9a5fa-cb0d-4410-b9c5-df16bedb4391','plugins.grades.rules','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.grades.welcome',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('f997891a-1b7b-4eb2-abe3-dea861591059','plugins.users.user-data','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.users.user-data',NULL,0,'2022-08-03 05:55:51','2022-08-03 05:55:51',NULL),('facf1397-2643-45c4-868c-15fc97a1cd6f','plugins.leebrary.library','update',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.leebrary.library',NULL,0,'2022-08-03 05:55:53','2022-08-03 05:55:53',NULL),('fe8c2469-56b1-47c7-b525-85a710030b54','plugins.grades.rules','admin',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.grades.rules',NULL,0,'2022-08-03 05:55:52','2022-08-03 05:55:52',NULL),('ffceb2b9-6397-4515-9027-df888d497feb','plugins.calendar.calendar-classroom','view',NULL,'plugins.menu-builder.plugins.menu-builder.main.menu-item','plugins.calendar.calendar-classroom',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL),('fffd0415-01c7-43b5-8aa0-1de824989d51','plugins.leebrary.library','delete',NULL,'plugins.menu-builder.plugins.leebrary.categories.menu-item','plugins.leebrary.media-files',NULL,0,'2022-08-03 05:55:54','2022-08-03 05:55:54',NULL);
/*!40000 ALTER TABLE `plugins_users::item-permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::permission-action`
--

DROP TABLE IF EXISTS `plugins_users::permission-action`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::permission-action` (
  `id` char(36) NOT NULL,
  `permissionName` varchar(255) NOT NULL,
  `actionName` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::permission-action`
--

LOCK TABLES `plugins_users::permission-action` WRITE;
/*!40000 ALTER TABLE `plugins_users::permission-action` DISABLE KEYS */;
INSERT INTO `plugins_users::permission-action` VALUES ('035be5f5-8c9a-460f-b2f8-b5db1bf1622b','plugins.admin.setup','update',0,'2022-08-03 05:55:48','2022-08-03 05:55:48',NULL),('035cc902-d369-46f4-a23e-25c3ee653082','plugins.grades.promotions','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('048d6140-49c5-4508-853c-2eb716db463f','plugins.users.user-data','view',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('064165b8-3651-4466-8418-884194a6b33c','plugins.academic-portfolio.tree','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('0659e122-61d6-4215-8e85-1df346df2cd0','plugins.users.centers','update',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('0887ec2d-da46-47c9-95b7-e4fb79a065e7','plugins.admin.setup','admin',0,'2022-08-03 05:55:48','2022-08-03 05:55:48',NULL),('09718c07-1366-4830-b93b-cc5caddb8334','plugins.package-manager.plugins','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('0a880252-51c7-49a2-91e8-31dbe55921c5','plugins.users.users','view',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('0b4aa970-8497-4296-a43f-36b1d7bcd089','plugins.academic-portfolio.subjects','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('0bf290c9-7515-4761-8391-6b9653235fb4','plugins.grades.dependencies','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('102d83d6-3762-4b7a-aeca-b06327046acb','plugins.academic-portfolio.profiles','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('109e0f94-b5b0-4592-8aa9-44891d3a5734','plugins.admin.setup','view',0,'2022-08-03 05:55:48','2022-08-03 05:55:48',NULL),('112be782-42be-4be6-8bb6-12d454aa23f5','plugins.tests.questionsBanks','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('11bba0ed-a095-4844-b50c-b6f6227fc608','plugins.leebrary.library','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('126b9466-491d-4d4a-9642-6f8a92ce2e31','plugins.curriculum.curriculum','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('19231a37-a49c-4e81-9220-862324becabb','plugins.dataset.dataset','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('1964ca31-aa3b-456f-9669-9c241ec3c85a','plugins.tests.questionsBanks','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('1a903fce-9a89-4577-8f05-b2f230a776d1','plugins.calendar.calendar-configs','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('1be904b8-d347-4a56-bc56-ce40c3f3090f','plugins.leebrary.library','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('1c76d150-563a-4fa9-9717-9383e41ba2ef','plugins.package-manager.plugins','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('228f7efa-69b6-435f-b42e-b06728264102','plugins.users.centers','view',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('22c82821-9f6c-4cb0-8c69-cc2c17a6bcaa','plugins.timetable.config','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('270e5121-e773-47e8-8b25-810c8da0ad2a','plugins.users.profiles','update',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('279b9d9c-93ba-4022-94ac-2d72c8e76eef','plugins.grades.rules','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('2872bc86-5351-49f4-a250-e0dc9d2df1bd','plugins.grades.evaluations','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('29467e18-d0e0-415b-97ce-ea8761ad7979','plugins.grades.evaluations','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('2b375d65-ed62-4547-83d2-6182f835d712','plugins.scores.periods','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('2b7bb840-908a-4221-9969-6ab71b052c38','plugins.timetable.config','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('2c0859e6-da49-492b-8c27-c56633ae99e7','plugins.tasks.library','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('2d26e7dd-c40f-4760-bd32-027cf18c7661','plugins.dataset.dataset','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('2e627722-4033-4833-91ae-c3952595f89a','plugins.assignables.history','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('30f975ba-7d5c-4018-bdbc-db8282cff20e','plugins.scores.notebook','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('325ae626-ed3a-4ed4-88d4-635f418fd94a','plugins.tasks.tasks','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('3684016f-553c-457f-a20a-26c37c65585c','plugins.academic-portfolio.subjects','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('374559cd-9a43-4d35-84ce-6adcfa696bf9','plugins.scores.notebook','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('37cae903-9ff2-4026-8aa0-349c2c042ed8','plugins.grades.dependencies','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('38cd9cb4-3628-4cb8-93c3-a1f73735c745','plugins.curriculum.curriculum','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('39b46059-d8e1-4604-8859-f1d01464b956','plugins.timetable.config','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('3d061932-2791-484d-b673-1acf74c84a7c','plugins.scores.notebook','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('3e716c25-3df1-467e-93f2-8269229dfef4','plugins.package-manager.plugins','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('3eb67fdc-c9b4-4ec6-a28e-bd1012b9859c','plugins.academic-portfolio.portfolio','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('3f096d86-90fc-4c15-9f05-27a61ebc66ae','plugins.users.profiles','create',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('405822e6-f507-44d4-ac5c-7f4e1fecafc3','plugins.tasks.tasks','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('40f2e476-d419-4d8a-82c8-7e1f2a25db3d','plugins.timetable.timetable','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('44ab3e39-581f-4a2a-b871-70a84e46c0df','plugins.calendar.calendar-configs','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('46077563-452f-45ad-8c37-f0824d93fd9a','plugins.tests.tests','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('46c5c9ff-a793-4f20-9c8c-532518536ca1','plugins.tests.questionsBanks','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('46f3ccfb-1b40-44ff-8144-80608ee6c338','plugins.grades.evaluations','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('490822b8-f226-4431-b31d-83c4b2cffabf','plugins.calendar.calendar-configs','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('4eaf8913-9170-47b5-9769-45495c461903','plugins.academic-portfolio.profiles','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('50b1a71c-3ae4-41d5-ace4-e981349f0131','plugins.grades.rules','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('52463788-7b91-43c5-821e-8fece2745f60','plugins.academic-portfolio.subjects','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('536f3776-831a-4ff7-80e1-dc74b4371b31','plugins.users.user-data','admin',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('539c2652-d1f4-4ce0-abc8-cba064539c09','plugins.scores.notebook','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('545a2c3b-c518-4f15-8591-a6bccbd2b9cf','plugins.grades.promotions','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('55cecdd0-744b-41c0-8279-68c8b282f2be','plugins.academic-portfolio.tree','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('566a528b-b003-49a2-b3d8-0823f358f549','plugins.academic-portfolio.tree','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('5697ab0d-41e2-478a-8cea-8c93fd803009','plugins.academic-portfolio.programs','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('56ba348b-5122-48a1-92d4-c8af7fd5130a','plugins.timetable.timetable','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('5e61e4a2-469c-4615-855b-6d62ac199a06','plugins.academic-portfolio.tree','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('6055f61e-b7db-499a-a185-02f6b029e2f8','plugins.users.users','create',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('66edaec7-76db-49f5-9088-12cce3705ae4','plugins.grades.dependencies','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('66f74f3b-b199-4d68-a8ee-711d85f628f5','plugins.tests.questionsBanks','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('6784e94c-9467-497e-aca6-a17a128e6733','plugins.timetable.config','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('67ed34bd-0d46-48a6-a364-587778de2f77','plugins.tasks.tasks','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('69082f64-7bb7-413f-9cf0-8ba36b7a1634','plugins.academic-calendar.config','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('69f49cab-c7ef-4082-87ad-5259c40ff124','plugins.calendar.calendar-classroom','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('6a52e62b-467f-45f4-9fd3-b4704698338b','plugins.dataset.dataset','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('6c365d5a-9c1c-44df-8f01-8cd79c4af84a','plugins.tests.tests','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('6ce5d716-c44d-4ea7-b8a8-d5854971bc3d','plugins.academic-portfolio.portfolio','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('6da34e96-feb2-49ca-8252-728835fd479b','plugins.academic-calendar.config','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('73ad6d57-c3b2-49e7-9dd9-c42fe1fdf1bc','plugins.tests.tests','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('7508c42c-8f8f-4c79-9744-89227f107b62','plugins.scores.scores','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('77fd24ec-7543-4b89-97b5-96f7ad7499e7','plugins.dataset.dataset','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('7852d15c-1936-4f95-9429-6241e9b6ea9e','plugins.scores.periods','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('79d6df99-bf72-4578-9ee5-5ffe67280e5a','plugins.users.profiles','view',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('7ab5ebc5-5f74-45fc-a961-b00d67007056','plugins.users.users','update',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('7c495ecf-0e97-4e3b-82d9-33361b14b8e3','plugins.academic-calendar.config','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('7c760179-9590-4bce-928b-635ef42cfb69','plugins.timetable.timetable','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('7d6a58a7-d7fb-4ba3-8665-e26a1e79b361','plugins.leebrary.library','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('7fb70aab-46bb-464a-a30d-dcc47b087348','plugins.academic-portfolio.profiles','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('80b3a8d1-e810-461b-92fb-89c7900d79ea','plugins.tasks.library','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('8130c19f-9a8e-46e4-8089-521e37b64413','plugins.calendar.calendar-classroom','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('87d35485-e5bf-4f70-aa8e-ab0bf5e24001','plugins.scores.periods','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('89cb2b3b-98cb-441f-8e27-2a4f1cb5a452','plugins.dataset.dataset','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('8b503193-8581-4c38-99f9-d57fe78a8b18','plugins.tasks.tasks','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('8b701a1c-bb89-4f04-9ae5-5fe8571a0d46','plugins.academic-portfolio.programs','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('8e1e1a72-e616-4797-bb9b-c654e6284ac2','plugins.package-manager.plugins','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('8e931925-f020-46b7-8000-8e6a0f663b37','plugins.tasks.tasks','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('8f15eabc-ea58-4fee-804e-51448953ca9c','plugins.admin.setup','delete',0,'2022-08-03 05:55:48','2022-08-03 05:55:48',NULL),('95325b04-7825-4175-8473-c870e00ea204','plugins.calendar.calendar','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('962c3c2b-a382-4de9-8e1e-e2beef6ee0f1','plugins.users.profiles','delete',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('9a87b3bf-e0ad-4dd3-b50b-d203d9f47a8a','plugins.tests.tests','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('9ca2b913-d90e-4d0d-b00f-dbc6262278d3','plugins.tasks.profiles','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('9d1dcfdb-7360-47af-8ccc-cc2353cd1870','plugins.scores.notebook','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('9e2fa148-2ffe-4a34-9ef3-724c11071795','plugins.academic-portfolio.profiles','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('9e85824c-6257-4660-bb2a-ba0143ba1f67','plugins.scores.periods','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('a43e8cee-7b14-4f46-8546-ba78fa4d1c70','plugins.assignables.activities','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('a452ef9f-cb05-4aed-8c49-772a69e1067a','plugins.academic-calendar.config','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('a4f6a5ce-2304-48d4-bbeb-eb53502df818','plugins.timetable.timetable','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('a5424e07-24f0-42dd-b43b-29c4bb6853f9','plugins.scores.scoresMenu','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('a8010913-cd16-4e03-b24f-3043d4bb06ff','plugins.users.user-data','update',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('a9b0af6b-94fe-497e-aedb-821ead2458cd','plugins.grades.rules','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('a9f55398-7af4-4a34-9e07-224736b9a146','plugins.academic-portfolio.portfolio','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('aacd6924-abcf-4633-92b4-468405107efb','plugins.curriculum.curriculum-menu','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('ab4f6966-80a7-4320-ac3e-cd8094ded8cc','plugins.grades.promotions','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('adf9580b-a633-4f39-9dae-2a23354e901b','plugins.grades.promotions','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('b019e89e-3628-4317-9eb6-afdff14843e0','plugins.academic-portfolio.subjects','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('b020bbb7-0b90-49a4-b409-ca7e40db1501','plugins.users.users','delete',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('b23c67b9-3e8c-4d16-a724-a3ca7f6fd585','plugins.tasks.profiles','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('b5fa1949-257f-485f-b099-0f7dc5c396fc','plugins.tests.questionsBanks','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('b61fa20d-b4e4-4fbb-be12-c6fcf5f8954d','plugins.grades.evaluations','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('b6495058-affe-4c0d-a4ef-e677d487f81d','plugins.grades.rules','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('b7cd2eec-80b2-4b4e-a029-b37abfdbb79f','plugins.grades.promotions','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('ba65f336-f9a9-4330-b3be-8277ec615c49','plugins.calendar.calendar-configs','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('bd14896c-b178-45aa-8d06-fb70268ca4cd','plugins.leebrary.library','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('c1d91516-475c-411d-a825-1b5d3f0ac904','plugins.academic-portfolio.portfolio','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('c2025421-6592-4be0-b6a0-29e3669487f8','plugins.calendar.calendar','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('c2e80550-cb68-4b22-887d-65b0f1f9f942','plugins.academic-portfolio.tree','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('c5879edd-f632-4493-ae9d-209f91f2b770','plugins.grades.dependencies','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('c5c6b1ec-2afd-4c6a-887f-656de2e709d5','plugins.admin.setup','create',0,'2022-08-03 05:55:48','2022-08-03 05:55:48',NULL),('c79a15c2-f5f3-4db2-b75f-507fc01bc690','plugins.academic-calendar.config','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('c863a325-e7a8-4d10-b88f-e0ae8d9da433','plugins.tasks.profiles','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('cbd2fa27-18cb-483c-aa2a-4da2c4f8dba2','plugins.curriculum.curriculum','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('cc2ee4e4-c5c9-4e14-9813-cb875d8d9c16','plugins.scores.periods','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('cd93e867-f0b6-41c8-88a8-0f51288035ec','plugins.grades.evaluations','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('ce2aadfb-05aa-486c-90bc-fa3f0e1c604c','plugins.academic-portfolio.subjects','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('d3e6a52b-d32b-492f-bccc-c77a826d16f3','plugins.grades.rules','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('d51a2f49-a996-4569-a4e3-f163c6e56109','plugins.tests.tests','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('d6bc2970-e925-4a81-b70f-01f5b3dab873','plugins.assignables.ongoing','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('d6cbccb1-f8ad-48f9-897b-dacb7ef0ad7c','plugins.calendar.calendar','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('d7919736-3a97-4a43-ae74-839e4a60f5fa','plugins.curriculum.curriculum','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('d7adcbc3-6399-4cce-87ae-d0b88a57a641','plugins.users.centers','create',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('d87f023e-2e19-49d0-9c58-1805f60a398f','plugins.users.profiles','admin',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('d906f109-cd69-44d8-8015-62c731803ec7','plugins.academic-portfolio.programs','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('db1ee85f-2f78-4b3e-afba-c0530f763653','plugins.package-manager.plugins','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('dca5cc10-c45c-4a46-9c19-1408322c7e05','plugins.users.users','admin',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('dd30301e-3deb-4942-a158-62b7dcc36aa6','plugins.users.centers','admin',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('e2022d0d-c1b3-48a7-a18d-9e870e0c5eff','plugins.calendar.calendar-classroom','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('e2540b04-6841-4771-98d1-2216134f1069','plugins.timetable.config','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('e2724b94-58d3-4129-b7ab-5cc7d7206ad5','plugins.users.centers','delete',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('e392d3fc-3bc8-44a4-b1a6-eba5d6e55056','plugins.academic-portfolio.programs','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('e6ab7b34-9dc8-473b-bf21-3130a6048acc','plugins.calendar.calendar-configs','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('e7a9b4b7-838c-4940-abf8-e6afef658f3b','plugins.users.user-data','delete',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('e87531d7-644e-429a-824a-c5c411d0a62e','plugins.academic-portfolio.portfolio','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('eaa754db-796e-42ce-b1da-8c7d7c3ccff2','plugins.leebrary.library','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('ec2f1505-baed-42d4-a35c-fcfb52ff820d','plugins.grades.dependencies','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('f0fb00dc-885c-4f84-989e-3195aa3f5357','plugins.timetable.timetable','update',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('f7a58066-88da-49ed-b7e3-4245721b69e5','plugins.calendar.calendar-classroom','view',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('f8ecc35b-6c5f-44c4-a516-54850e6bf7fa','plugins.tasks.profiles','create',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('f9f4577d-e350-4f3d-9fe7-9720ed447f61','plugins.academic-portfolio.programs','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('fe11ed61-a242-4d5b-afaf-61a61a89bd47','plugins.curriculum.curriculum','delete',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL),('ffd555c1-d121-4c14-a613-1e6a47de8686','plugins.calendar.calendar-classroom','admin',0,'2022-08-03 05:55:47','2022-08-03 05:55:47',NULL);
/*!40000 ALTER TABLE `plugins_users::permission-action` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::permissions`
--

DROP TABLE IF EXISTS `plugins_users::permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::permissions` (
  `id` char(36) NOT NULL,
  `permissionName` varchar(255) NOT NULL,
  `pluginName` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::permissions`
--

LOCK TABLES `plugins_users::permissions` WRITE;
/*!40000 ALTER TABLE `plugins_users::permissions` DISABLE KEYS */;
INSERT INTO `plugins_users::permissions` VALUES ('0bdacdea-e4df-4937-81ad-617d0e542d2b','plugins.grades.evaluations','plugins.grades',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('1156ae96-50db-40c3-9b5c-c620cd648872','plugins.admin.setup','plugins.admin',0,'2022-08-03 05:55:48','2022-08-03 05:55:48',NULL),('23381f3e-5cc2-4497-a9f5-f254a82195c9','plugins.calendar.calendar','plugins.calendar',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('27aa26dd-563d-4e8e-a4aa-821d1b7352ce','plugins.tests.questionsBanks','plugins.tests',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('2c0ccc64-c6e6-4edc-b72e-48d3b444fcba','plugins.academic-calendar.config','plugins.academic-calendar',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('30d419a1-8a26-4fa8-9f6a-c5c5e0660290','plugins.academic-portfolio.tree','plugins.academic-portfolio',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('341c5441-cb78-4fb6-8c1d-3f7d1a757e56','plugins.assignables.ongoing','plugins.assignables',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('35f04b8e-294e-4b78-9c8c-56e92b4ce3f1','plugins.calendar.calendar-configs','plugins.calendar',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('380aa21f-299b-4e74-ab4c-7347b596d7ad','plugins.users.user-data','plugins.users',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('38a6c478-c1c8-47f8-981b-6a4c51311d0f','plugins.assignables.history','plugins.assignables',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('48fea5e5-188e-432e-9d4e-4a82392fb178','plugins.assignables.activities','plugins.assignables',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('4a30941b-03bb-4ea8-b6e8-6d021850849b','plugins.calendar.calendar-classroom','plugins.calendar',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('62959b37-e0f5-4e86-9546-1e37b1c1ffd1','plugins.users.users','plugins.users',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('6a03bba6-aa94-422d-b993-66500ff8668c','plugins.academic-portfolio.programs','plugins.academic-portfolio',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('6eb387de-4a8a-4538-8873-cb5ca32223c7','plugins.curriculum.curriculum','plugins.curriculum',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('77732061-cf7b-44cf-ae25-1acbf2768003','plugins.dataset.dataset','plugins.dataset',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('780017c0-78b2-4959-91d9-f593156f2581','plugins.users.profiles','plugins.users',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('78ee9ea0-87ef-44bb-90f4-71a159ecb4d5','plugins.leebrary.library','plugins.leebrary',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('7e6d92d5-3f33-4c10-af99-f18404564eed','plugins.timetable.timetable','plugins.timetable',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('83bffb6d-71aa-4314-a255-aa60930b530b','plugins.scores.notebook','plugins.scores',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('84f46a81-c377-41c6-940f-124a6f54457f','plugins.grades.dependencies','plugins.grades',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('8a297dc4-1325-4cd7-b6dd-39c09cc71df7','plugins.academic-portfolio.profiles','plugins.academic-portfolio',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('99af9418-d853-408a-86c1-2481795eed5d','plugins.academic-portfolio.subjects','plugins.academic-portfolio',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('9c55d8c1-563f-4a7a-bd24-3f259b7f5846','plugins.grades.rules','plugins.grades',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('b628c10f-e0ae-4f4b-a44a-7454cd9ebe9c','plugins.academic-portfolio.portfolio','plugins.academic-portfolio',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('c1f04dba-6f97-4448-b681-8967db534357','plugins.package-manager.plugins','plugins.package-manager',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('d067be24-3dde-42d7-8be7-a66fa0a899ed','plugins.curriculum.curriculum-menu','plugins.curriculum',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('d087917c-8c6c-4156-a7d5-216a583322c4','plugins.scores.periods','plugins.scores',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('d1b32b3e-2a4d-4347-89be-91dec75ba850','plugins.tasks.library','plugins.tasks',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('e0b940fa-aa34-47da-9473-ea2c056ad2aa','plugins.timetable.config','plugins.timetable',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('e5dd443b-6718-4b12-beb8-a977bc4a9f49','plugins.users.centers','plugins.users',0,'2022-08-03 05:55:45','2022-08-03 05:55:45',NULL),('e61f82a1-b1ee-4ee4-bc13-48c4b8560a9b','plugins.scores.scoresMenu','plugins.scores',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('f0df251e-944a-410e-a9d9-a46c2d310b0c','plugins.grades.promotions','plugins.grades',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('f7f8fa84-660e-4d62-a99b-ab71022a4640','plugins.scores.scores','plugins.scores',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('fafed43a-2c19-4bf3-ad53-349b2c2de412','plugins.tasks.tasks','plugins.tasks',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('fba37ce9-5413-4bb0-a384-662b185114d9','plugins.tasks.profiles','plugins.tasks',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL),('fe55b99e-3887-4425-b54b-7afed01f28fc','plugins.tests.tests','plugins.tests',0,'2022-08-03 05:55:46','2022-08-03 05:55:46',NULL);
/*!40000 ALTER TABLE `plugins_users::permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::profile-contacts`
--

DROP TABLE IF EXISTS `plugins_users::profile-contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::profile-contacts` (
  `id` char(36) NOT NULL,
  `fromProfile` char(36) DEFAULT NULL,
  `toProfile` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::profile_contacts_fromprofile_foreign` (`fromProfile`),
  KEY `plugins_users::profile_contacts_toprofile_foreign` (`toProfile`),
  CONSTRAINT `plugins_users::profile_contacts_fromprofile_foreign` FOREIGN KEY (`fromProfile`) REFERENCES `plugins_users::profiles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::profile_contacts_toprofile_foreign` FOREIGN KEY (`toProfile`) REFERENCES `plugins_users::profiles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::profile-contacts`
--

LOCK TABLES `plugins_users::profile-contacts` WRITE;
/*!40000 ALTER TABLE `plugins_users::profile-contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::profile-contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::profile-role`
--

DROP TABLE IF EXISTS `plugins_users::profile-role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::profile-role` (
  `id` char(36) NOT NULL,
  `profile` char(36) DEFAULT NULL,
  `role` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::profile_role_profile_foreign` (`profile`),
  KEY `plugins_users::profile_role_role_foreign` (`role`),
  CONSTRAINT `plugins_users::profile_role_profile_foreign` FOREIGN KEY (`profile`) REFERENCES `plugins_users::profiles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::profile_role_role_foreign` FOREIGN KEY (`role`) REFERENCES `plugins_users::roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::profile-role`
--

LOCK TABLES `plugins_users::profile-role` WRITE;
/*!40000 ALTER TABLE `plugins_users::profile-role` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::profile-role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::profiles`
--

DROP TABLE IF EXISTS `plugins_users::profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::profiles` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `uri` varchar(255) NOT NULL,
  `role` char(36) DEFAULT NULL,
  `indexable` tinyint(1) NOT NULL DEFAULT '1',
  `sysName` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_users::profiles_name_unique` (`name`),
  UNIQUE KEY `plugins_users::profiles_uri_unique` (`uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::profiles`
--

LOCK TABLES `plugins_users::profiles` WRITE;
/*!40000 ALTER TABLE `plugins_users::profiles` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::role-center`
--

DROP TABLE IF EXISTS `plugins_users::role-center`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::role-center` (
  `id` char(36) NOT NULL,
  `role` char(36) DEFAULT NULL,
  `center` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::role_center_role_foreign` (`role`),
  KEY `plugins_users::role_center_center_foreign` (`center`),
  CONSTRAINT `plugins_users::role_center_center_foreign` FOREIGN KEY (`center`) REFERENCES `plugins_users::centers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::role_center_role_foreign` FOREIGN KEY (`role`) REFERENCES `plugins_users::roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::role-center`
--

LOCK TABLES `plugins_users::role-center` WRITE;
/*!40000 ALTER TABLE `plugins_users::role-center` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::role-center` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::role-permission`
--

DROP TABLE IF EXISTS `plugins_users::role-permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::role-permission` (
  `id` char(36) NOT NULL,
  `role` char(36) DEFAULT NULL,
  `permissionName` varchar(255) NOT NULL,
  `actionName` varchar(255) NOT NULL,
  `target` varchar(255) DEFAULT NULL,
  `isCustom` tinyint(1) NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::role_permission_role_foreign` (`role`),
  CONSTRAINT `plugins_users::role_permission_role_foreign` FOREIGN KEY (`role`) REFERENCES `plugins_users::roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::role-permission`
--

LOCK TABLES `plugins_users::role-permission` WRITE;
/*!40000 ALTER TABLE `plugins_users::role-permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::role-permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::roles`
--

DROP TABLE IF EXISTS `plugins_users::roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::roles` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `uri` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::roles`
--

LOCK TABLES `plugins_users::roles` WRITE;
/*!40000 ALTER TABLE `plugins_users::roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::super-admin-user`
--

DROP TABLE IF EXISTS `plugins_users::super-admin-user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::super-admin-user` (
  `id` char(36) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::super_admin_user_user_foreign` (`user`),
  CONSTRAINT `plugins_users::super_admin_user_user_foreign` FOREIGN KEY (`user`) REFERENCES `plugins_users::users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::super-admin-user`
--

LOCK TABLES `plugins_users::super-admin-user` WRITE;
/*!40000 ALTER TABLE `plugins_users::super-admin-user` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::super-admin-user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::user-agent`
--

DROP TABLE IF EXISTS `plugins_users::user-agent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::user-agent` (
  `id` char(36) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `role` char(36) DEFAULT NULL,
  `reloadPermissions` tinyint(1) DEFAULT '0',
  `datasetIsGood` tinyint(1) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::user-agent`
--

LOCK TABLES `plugins_users::user-agent` WRITE;
/*!40000 ALTER TABLE `plugins_users::user-agent` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::user-agent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::user-agent-contacts`
--

DROP TABLE IF EXISTS `plugins_users::user-agent-contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::user-agent-contacts` (
  `id` char(36) NOT NULL,
  `fromUserAgent` char(36) DEFAULT NULL,
  `fromCenter` char(36) DEFAULT NULL,
  `fromProfile` char(36) DEFAULT NULL,
  `toUserAgent` char(36) DEFAULT NULL,
  `toCenter` char(36) DEFAULT NULL,
  `toProfile` char(36) DEFAULT NULL,
  `pluginName` varchar(255) NOT NULL,
  `target` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::user_agent_contacts_fromuseragent_foreign` (`fromUserAgent`),
  KEY `plugins_users::user_agent_contacts_fromcenter_foreign` (`fromCenter`),
  KEY `plugins_users::user_agent_contacts_fromprofile_foreign` (`fromProfile`),
  KEY `plugins_users::user_agent_contacts_touseragent_foreign` (`toUserAgent`),
  KEY `plugins_users::user_agent_contacts_tocenter_foreign` (`toCenter`),
  KEY `plugins_users::user_agent_contacts_toprofile_foreign` (`toProfile`),
  CONSTRAINT `plugins_users::user_agent_contacts_fromcenter_foreign` FOREIGN KEY (`fromCenter`) REFERENCES `plugins_users::centers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_agent_contacts_fromprofile_foreign` FOREIGN KEY (`fromProfile`) REFERENCES `plugins_users::profiles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_agent_contacts_fromuseragent_foreign` FOREIGN KEY (`fromUserAgent`) REFERENCES `plugins_users::user-agent` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_agent_contacts_tocenter_foreign` FOREIGN KEY (`toCenter`) REFERENCES `plugins_users::centers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_agent_contacts_toprofile_foreign` FOREIGN KEY (`toProfile`) REFERENCES `plugins_users::profiles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_agent_contacts_touseragent_foreign` FOREIGN KEY (`toUserAgent`) REFERENCES `plugins_users::user-agent` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::user-agent-contacts`
--

LOCK TABLES `plugins_users::user-agent-contacts` WRITE;
/*!40000 ALTER TABLE `plugins_users::user-agent-contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::user-agent-contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::user-agent-permission`
--

DROP TABLE IF EXISTS `plugins_users::user-agent-permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::user-agent-permission` (
  `id` char(36) NOT NULL,
  `userAgent` char(36) DEFAULT NULL,
  `permissionName` varchar(255) NOT NULL,
  `actionName` varchar(255) NOT NULL,
  `target` varchar(255) DEFAULT NULL,
  `role` char(36) DEFAULT NULL,
  `center` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::user_agent_permission_useragent_foreign` (`userAgent`),
  KEY `plugins_users::user_agent_permission_role_foreign` (`role`),
  KEY `plugins_users::user_agent_permission_center_foreign` (`center`),
  CONSTRAINT `plugins_users::user_agent_permission_center_foreign` FOREIGN KEY (`center`) REFERENCES `plugins_users::centers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_agent_permission_role_foreign` FOREIGN KEY (`role`) REFERENCES `plugins_users::roles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_agent_permission_useragent_foreign` FOREIGN KEY (`userAgent`) REFERENCES `plugins_users::user-agent` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::user-agent-permission`
--

LOCK TABLES `plugins_users::user-agent-permission` WRITE;
/*!40000 ALTER TABLE `plugins_users::user-agent-permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::user-agent-permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::user-preferences`
--

DROP TABLE IF EXISTS `plugins_users::user-preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::user-preferences` (
  `id` char(36) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `pronoun` varchar(255) DEFAULT NULL,
  `pluralPronoun` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::user_preferences_user_foreign` (`user`),
  CONSTRAINT `plugins_users::user_preferences_user_foreign` FOREIGN KEY (`user`) REFERENCES `plugins_users::users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::user-preferences`
--

LOCK TABLES `plugins_users::user-preferences` WRITE;
/*!40000 ALTER TABLE `plugins_users::user-preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::user-preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::user-profile`
--

DROP TABLE IF EXISTS `plugins_users::user-profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::user-profile` (
  `id` char(36) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `profile` char(36) DEFAULT NULL,
  `role` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::user_profile_user_foreign` (`user`),
  KEY `plugins_users::user_profile_profile_foreign` (`profile`),
  KEY `plugins_users::user_profile_role_foreign` (`role`),
  CONSTRAINT `plugins_users::user_profile_profile_foreign` FOREIGN KEY (`profile`) REFERENCES `plugins_users::profiles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_profile_role_foreign` FOREIGN KEY (`role`) REFERENCES `plugins_users::roles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_profile_user_foreign` FOREIGN KEY (`user`) REFERENCES `plugins_users::users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::user-profile`
--

LOCK TABLES `plugins_users::user-profile` WRITE;
/*!40000 ALTER TABLE `plugins_users::user-profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::user-profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::user-recover-password`
--

DROP TABLE IF EXISTS `plugins_users::user-recover-password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::user-recover-password` (
  `id` char(36) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::user_recover_password_user_foreign` (`user`),
  CONSTRAINT `plugins_users::user_recover_password_user_foreign` FOREIGN KEY (`user`) REFERENCES `plugins_users::users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::user-recover-password`
--

LOCK TABLES `plugins_users::user-recover-password` WRITE;
/*!40000 ALTER TABLE `plugins_users::user-recover-password` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::user-recover-password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::user-register-password`
--

DROP TABLE IF EXISTS `plugins_users::user-register-password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::user-register-password` (
  `id` char(36) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::user_register_password_user_foreign` (`user`),
  CONSTRAINT `plugins_users::user_register_password_user_foreign` FOREIGN KEY (`user`) REFERENCES `plugins_users::users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::user-register-password`
--

LOCK TABLES `plugins_users::user-register-password` WRITE;
/*!40000 ALTER TABLE `plugins_users::user-register-password` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::user-register-password` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::user-remember-login`
--

DROP TABLE IF EXISTS `plugins_users::user-remember-login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::user-remember-login` (
  `id` char(36) NOT NULL,
  `user` char(36) DEFAULT NULL,
  `profile` char(36) DEFAULT NULL,
  `center` char(36) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plugins_users::user_remember_login_user_foreign` (`user`),
  KEY `plugins_users::user_remember_login_profile_foreign` (`profile`),
  KEY `plugins_users::user_remember_login_center_foreign` (`center`),
  CONSTRAINT `plugins_users::user_remember_login_center_foreign` FOREIGN KEY (`center`) REFERENCES `plugins_users::centers` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_remember_login_profile_foreign` FOREIGN KEY (`profile`) REFERENCES `plugins_users::profiles` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `plugins_users::user_remember_login_user_foreign` FOREIGN KEY (`user`) REFERENCES `plugins_users::users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::user-remember-login`
--

LOCK TABLES `plugins_users::user-remember-login` WRITE;
/*!40000 ALTER TABLE `plugins_users::user-remember-login` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::user-remember-login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_users::users`
--

DROP TABLE IF EXISTS `plugins_users::users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_users::users` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surnames` varchar(255) DEFAULT NULL,
  `secondSurname` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `avatarAsset` varchar(255) DEFAULT NULL,
  `birthdate` datetime NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `locale` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(255) DEFAULT NULL,
  `gender` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_users::users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_users::users`
--

LOCK TABLES `plugins_users::users` WRITE;
/*!40000 ALTER TABLE `plugins_users::users` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_users::users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_widgets::widget-item`
--

DROP TABLE IF EXISTS `plugins_widgets::widget-item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_widgets::widget-item` (
  `id` char(36) NOT NULL,
  `zoneKey` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `pluginName` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `order` float(8,2) DEFAULT NULL,
  `properties` text,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_widgets::widget_item_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_widgets::widget-item`
--

LOCK TABLES `plugins_widgets::widget-item` WRITE;
/*!40000 ALTER TABLE `plugins_widgets::widget-item` DISABLE KEYS */;
INSERT INTO `plugins_widgets::widget-item` VALUES ('07d97dad-f595-4006-8c66-4136b7777b6f','plugins.academic-portfolio.class.detail','plugins.academic-portfolio.user.class.detail','class-detail/index','academic-portfolio',NULL,NULL,NULL,'{}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('1ec43008-3c8c-4277-bb6c-943eb2abd24e','plugins.dashboard.class.tabs','plugins.assignables.class.tab.ongoing','dashboard/tab-ongoing/index','assignables',NULL,NULL,NULL,'{\"label\":\"plugins.assignables.ongoing.activities\"}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('447d87ee-8c72-45bc-961b-5cea49797d6a','plugins.dashboard.class.tabs','plugins.calendar.class.tab.kanban','tab-kanban/index','calendar',NULL,NULL,NULL,'{\"label\":\"plugins.calendar.tabKanban.label\"}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('4c7e3f20-f241-480a-b781-c49055ea31ea','plugins.dashboard.class.tabs','plugins.calendar.class.tab.calendar','tab-calendar/index','calendar',NULL,NULL,NULL,'{\"label\":\"plugins.calendar.tabCalendar.label\"}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('52c24664-9b21-4704-acdf-6099faffaf02','plugins.dashboard.program.left','plugins.calendar.user.program.calendar','user-program-calendar/index','calendar',NULL,NULL,NULL,'{}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('7ed7a605-1665-4b1a-8451-b5b92b2fdec9','plugins.dashboard.class.tabs','plugins.academic-portfolio.class.tab.detail','tab-detail/index','academic-portfolio',NULL,NULL,NULL,'{\"label\":\"plugins.academic-portfolio.tabDetail.label\",\"hideRightSide\":true}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('8a69caa2-2887-4489-9375-e9a3bc936142','plugins.dashboard.class.right-tabs','plugins.academic-portfolio.user.class.students','class-students/index','academic-portfolio',NULL,NULL,NULL,'{\"label\":\"plugins.academic-portfolio.classStudents.label\"}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('8d029a13-4173-4a3f-9e9e-0c7d8af62a5d','plugins.calendar.class.calendar','plugins.calendar.user.class.calendar.calendar','user-program-calendar/index','calendar',NULL,NULL,NULL,'{}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('a1ece36e-fcb9-40c9-a5d5-6001eaa4edf2','plugins.assignables.class.ongoing','plugins.assignables.class.ongoing','dashboard/ongoing/index','assignables',NULL,NULL,NULL,'{}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('acbe3a6e-67ea-4db1-b9ea-ede66501c684','plugins.dashboard.program.left','plugins.academic-portfolio.user.classes.swiper','user-classes-swiper/index','academic-portfolio',NULL,NULL,NULL,'{}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('d28883d2-9e7f-42ed-9ac5-cd5993d3f24c','plugins.calendar.class.kanban','plugins.calendar.user.class.kanban.kanban','user-program-kanban/index','calendar',NULL,NULL,NULL,'{\"useAllColumns\":true}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('dfd795fc-76ee-41dc-92c1-c473a26a6631','plugins.dashboard.program.left','plugins.calendar.user.program.kanban','user-program-kanban/index','calendar',NULL,NULL,NULL,'{}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('e11ddca9-b977-4de3-b7b2-3ea929df4f7c','plugins.assignables.class.ongoing','plugins.assignables.dashboard.subject.need-your-attention','dashboard/nya/index','assignables',NULL,NULL,NULL,'{}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('eceaa214-8648-4a73-9c94-69013988a6fb','plugins.dashboard.program.left','plugins.assignables.dashboard.need-your-attention','dashboard/nya/index','assignables',NULL,NULL,NULL,'{}',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL);
/*!40000 ALTER TABLE `plugins_widgets::widget-item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_widgets::widget-item-profile`
--

DROP TABLE IF EXISTS `plugins_widgets::widget-item-profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_widgets::widget-item-profile` (
  `id` char(36) NOT NULL,
  `zoneKey` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `profile` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_widgets::widget-item-profile`
--

LOCK TABLES `plugins_widgets::widget-item-profile` WRITE;
/*!40000 ALTER TABLE `plugins_widgets::widget-item-profile` DISABLE KEYS */;
/*!40000 ALTER TABLE `plugins_widgets::widget-item-profile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plugins_widgets::widget-zone`
--

DROP TABLE IF EXISTS `plugins_widgets::widget-zone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plugins_widgets::widget-zone` (
  `id` char(36) NOT NULL,
  `key` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plugins_widgets::widget_zone_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plugins_widgets::widget-zone`
--

LOCK TABLES `plugins_widgets::widget-zone` WRITE;
/*!40000 ALTER TABLE `plugins_widgets::widget-zone` DISABLE KEYS */;
INSERT INTO `plugins_widgets::widget-zone` VALUES ('12a207b3-e51e-410a-922e-fae6d8226b84','plugins.dashboard.class.tabs',NULL,NULL,0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('2e226922-f627-4e2a-9747-3cd0098d219b','plugins.dashboard.class.right-tabs',NULL,NULL,0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('784a5c47-b0db-402f-b355-55d1ec8c1d8a','plugins.academic-portfolio.class.detail',NULL,NULL,0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('7d2553a1-ed9b-4030-8c93-3914c7eca2a2','plugins.dashboard.program.right',NULL,NULL,0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('92a3d3e3-b377-4731-b727-e9d5c9579f6c','plugins.calendar.class.kanban',NULL,NULL,0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('b3173efb-facf-403f-858b-9d3f8983ebad','plugins.assignables.class.ongoing','Ongoing activities','Zone for ongoing activities',0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('b69d5b10-9508-43c1-bff1-b1aa27f728c0','plugins.calendar.class.calendar',NULL,NULL,0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('cd09a69c-af72-4925-a7f2-1e1ee8bf127d','plugins.users.user-detail',NULL,NULL,0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL),('f7c7ad9e-e95c-48c3-9841-ad9a14fe5e14','plugins.dashboard.program.left',NULL,NULL,0,'2022-08-03 05:55:43','2022-08-03 05:55:43',NULL);
/*!40000 ALTER TABLE `plugins_widgets::widget-zone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providers_emails-amazon-ses::config`
--

DROP TABLE IF EXISTS `providers_emails-amazon-ses::config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `providers_emails-amazon-ses::config` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `accessKey` varchar(255) NOT NULL,
  `secretAccessKey` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providers_emails-amazon-ses::config`
--

LOCK TABLES `providers_emails-amazon-ses::config` WRITE;
/*!40000 ALTER TABLE `providers_emails-amazon-ses::config` DISABLE KEYS */;
/*!40000 ALTER TABLE `providers_emails-amazon-ses::config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providers_emails-smtp::config`
--

DROP TABLE IF EXISTS `providers_emails-smtp::config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `providers_emails-smtp::config` (
  `id` char(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `secure` tinyint(1) DEFAULT NULL,
  `port` float(8,2) NOT NULL,
  `host` varchar(255) NOT NULL,
  `user` varchar(255) DEFAULT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providers_emails-smtp::config`
--

LOCK TABLES `providers_emails-smtp::config` WRITE;
/*!40000 ALTER TABLE `providers_emails-smtp::config` DISABLE KEYS */;
/*!40000 ALTER TABLE `providers_emails-smtp::config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providers_leebrary-aws-s3::config`
--

DROP TABLE IF EXISTS `providers_leebrary-aws-s3::config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `providers_leebrary-aws-s3::config` (
  `id` char(36) NOT NULL,
  `bucket` varchar(255) NOT NULL,
  `region` varchar(255) NOT NULL,
  `accessKey` varchar(255) NOT NULL,
  `secretAccessKey` varchar(255) NOT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providers_leebrary-aws-s3::config`
--

LOCK TABLES `providers_leebrary-aws-s3::config` WRITE;
/*!40000 ALTER TABLE `providers_leebrary-aws-s3::config` DISABLE KEYS */;
/*!40000 ALTER TABLE `providers_leebrary-aws-s3::config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'testing'
--

--
-- Dumping routines for database 'testing'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-08-03  9:58:31
