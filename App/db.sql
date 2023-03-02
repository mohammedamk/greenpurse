CREATE TABLE `user` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`uuid` int(8) NOT NULL UNIQUE,
	`facebook_id` varchar(255)  UNIQUE,
	`fb_token` varchar(255)  UNIQUE,
	`username` varchar(255) NOT NULL UNIQUE,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`address_id` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`profile_pic` varchar(255) NOT NULL,
	`points` int ,
	`password` varchar(255) NOT NULL
);

CREATE TABLE `address` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`zone_id` int NOT NULL,
	`street_id` int NOT NULL,
	`house_name` varchar(255) NOT NULL,
	`pincode` varchar(255) NOT NULL,
	`type_id` int NOT NULL,
	`state` varchar(255) NOT NULL DEFAULT 'Maharastra',
	`city` varchar(255) NOT NULL DEFAULT 'Nagpur',
	`country` varchar(255) NOT NULL DEFAULT 'India'
);

CREATE TABLE `zone` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `version` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`version_code` int NOT NULL
);

CREATE TABLE `business_locality` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `street` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`zone_id` int NOT NULL
);

CREATE TABLE `apartment` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`street_id` int NOT NULL
);

CREATE TABLE `type` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `segregation` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL,
	`date` DATE NOT NULL
);

CREATE TABLE `category` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`point_required` int NOT NULL
);

CREATE TABLE `user_offer` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int(8) NOT NULL,
	`offer_id` int(8) NOT NULL,
	`redemeed` bool NOT NULL DEFAULT '0',
	`is_valid` bool NOT NULL DEFAULT '1'
);

CREATE TABLE `offers` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`title` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`category_id` int NOT NULL,
	`images` varchar(255) NOT NULL,
	`business_id` int NOT NULL,
	`validity` DATETIME NOT NULL
);

CREATE TABLE `business` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`owner_name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`website` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL
);

CREATE TABLE `points_transaction` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL,
	`amount` int NOT NULL,
	`type` varchar(255) NOT NULL
);

CREATE TABLE `properties` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`key` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL
);


========================================================================================================================

CREATE TABLE `user` (
	`uuid` int(8) NOT NULL UNIQUE,
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`facebook_id` varchar(255) NOT NULL UNIQUE,
	`fb_token` varchar(255) NOT NULL UNIQUE,
	`username` varchar(255) NOT NULL UNIQUE,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`address_id` int NOT NULL UNIQUE,
	`email` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`profile_pic` varchar(255) NOT NULL,
	`points` int NOT NULL
);

CREATE TABLE `address` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`zone_id` int NOT NULL UNIQUE,
	`street_id` int NOT NULL UNIQUE,
	`address_details` varchar(255) NOT NULL,
	`pincode` varchar(255) NOT NULL,
	`type_id` int NOT NULL UNIQUE,
	`state` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL
);

CREATE TABLE `zone` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `street` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `type` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `segregation` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL UNIQUE,
	`date` DATETIME NOT NULL
);

CREATE TABLE `category` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`point_required` int NOT NULL
);

CREATE TABLE `user_offer` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int(8) NOT NULL UNIQUE,
	`offer_id` int(8) NOT NULL UNIQUE,
	`redemeed` bool NOT NULL DEFAULT 'false',
	`is_valid` bool NOT NULL DEFAULT 'true'
);

CREATE TABLE `offers` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`title` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`category_id` int NOT NULL,
	`images` varchar(255) NOT NULL,
	`business_id` int NOT NULL UNIQUE,
	`validity` DATETIME NOT NULL
);

CREATE TABLE `business` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`owner_name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`website` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL
);

CREATE TABLE `points_transaction` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL UNIQUE,
	`amount` int NOT NULL,
	`type` varchar(255) NOT NULL
);

ALTER TABLE `offers` ADD CONSTRAINT `offers_fk0` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`);

ALTER TABLE `offers` ADD CONSTRAINT `offers_fk1` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`);

==================================================================================================================

CREATE TABLE `user` (
	`uuid` int(8) NOT NULL UNIQUE,
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`facebook_id` varchar(255) NOT NULL UNIQUE,
	`fb_token` varchar(255) NOT NULL UNIQUE,
	`username` varchar(255) NOT NULL UNIQUE,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`address_id` int NOT NULL UNIQUE,
	`email` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`profile_pic` varchar(255) NOT NULL,
	`points` int NOT NULL,
	`user_type` int NOT NULL DEFAULT '1'
);

CREATE TABLE `address` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`zone_id` int NOT NULL UNIQUE,
	`street_id` int NOT NULL UNIQUE,
	`address_details` varchar(255) NOT NULL,
	`pincode` varchar(255) NOT NULL,
	`type_id` int NOT NULL UNIQUE,
	`state` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL
);

CREATE TABLE `zone` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `password_resets` (
	`email` varchar(255) NULL,
	`token` varchar(255) NULL,
	`created_at` timestamp NULL
);

CREATE TABLE `business_user` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL UNIQUE,
	`phone_no` varchar(255) NOT NULL UNIQUE,
	`password` varchar(255) NOT NULL,
	`business_id` int NULL,
	`user_type` int NOT NULL
);

CREATE TABLE `street` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `type` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `segregation` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL UNIQUE,
	`date` DATETIME NOT NULL
);

CREATE TABLE `category` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`point_required` int NOT NULL
);

CREATE TABLE `user_offer` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int(8) NOT NULL UNIQUE,
	`offer_id` int(8) NOT NULL UNIQUE,
	`redemeed` bool NOT NULL DEFAULT 'false',
	`is_valid` bool NOT NULL DEFAULT 'true'
);

CREATE TABLE `offers` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`title` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`images` varchar(255) NOT NULL,
	`business_id` int NOT NULL UNIQUE,
	`validity` DATETIME NOT NULL
);

CREATE TABLE `offer_type` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
);

CREATE TABLE `business` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`owner_name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`website` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL
);

CREATE TABLE `points_transaction` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL UNIQUE,
	`amount` int NOT NULL,
	`type` varchar(255) NOT NULL
);

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


CREATE TABLE `user` (
	`uuid` int(8) NOT NULL UNIQUE,
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`facebook_id` varchar(255) NOT NULL UNIQUE,
	`fb_token` varchar(255) NOT NULL UNIQUE,
	`username` varchar(255) NOT NULL UNIQUE,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`address_id` int NOT NULL UNIQUE,
	`email` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`profile_pic` varchar(255) NOT NULL,
	`points` int NOT NULL
);

CREATE TABLE `address` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`zone_id` int NOT NULL UNIQUE,
	`street_id` int NOT NULL UNIQUE,
	`address_details` varchar(255) NOT NULL,
	`pincode` varchar(255) NOT NULL,
	`type_id` int NOT NULL UNIQUE,
	`state` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL
);

CREATE TABLE `zone` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `street` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `type` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `segregation` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL UNIQUE,
	`date` DATETIME NOT NULL
);

CREATE TABLE `category` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`point_required` int NOT NULL
);

CREATE TABLE `user_offer` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int(8) NOT NULL UNIQUE,
	`offer_id` int(8) NOT NULL UNIQUE,
	`redemeed` bool NOT NULL DEFAULT 'false',
	`is_valid` bool NOT NULL DEFAULT 'true'
);

CREATE TABLE `offers` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`title` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`category_id` int NOT NULL,
	`images` varchar(255) NOT NULL,
	`business_id` int NOT NULL,
	`validity` DATETIME NOT NULL,
	`offer_type_id` int NOT NULL
);

CREATE TABLE `business` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`owner_name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`website` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL
);

CREATE TABLE `points_transaction` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL UNIQUE,
	`amount` int NOT NULL,
	`type` varchar(255) NOT NULL
);

CREATE TABLE `segregation_time` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`start_time` varchar(255) NOT NULL,
	`end_time` varchar(255) NOT NULL
);

CREATE TABLE `offer_type` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar NOT NULL
);

ALTER TABLE `offers` ADD CONSTRAINT `offers_fk0` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`);

ALTER TABLE `offers` ADD CONSTRAINT `offers_fk1` FOREIGN KEY (`business_id`) REFERENCES `business`(`id`);

ALTER TABLE `offers` ADD CONSTRAINT `offers_fk2` FOREIGN KEY (`offer_type_id`) REFERENCES `offer_type`(`id`);


=======================================================================================================================


CREATE TABLE `user` (
	`uuid` int(8) NOT NULL UNIQUE,
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`facebook_id` varchar(255) NOT NULL UNIQUE,
	`fb_token` varchar(255) NOT NULL UNIQUE,
	`username` varchar(255) NOT NULL UNIQUE,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`address_id` int NOT NULL UNIQUE,
	`email` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`profile_pic` varchar(255) NOT NULL,
	`points` int NOT NULL
);

CREATE TABLE `address` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`zone_id` int NOT NULL UNIQUE,
	`street_id` int NOT NULL UNIQUE,
	`address_details` varchar(255) NOT NULL,
	`pincode` varchar(255) NOT NULL,
	`type_id` int NOT NULL UNIQUE,
	`state` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL
);

CREATE TABLE `zone` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `street` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `type` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL
);

CREATE TABLE `segregation` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL UNIQUE,
	`date` DATETIME NOT NULL
);

CREATE TABLE `category` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`point_required` int NOT NULL
);

CREATE TABLE `user_offer` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int(8) NOT NULL UNIQUE,
	`offer_id` int(8) NOT NULL,
	`redemeed` bool NOT NULL DEFAULT 'false',
	`is_valid` bool NOT NULL DEFAULT 'true'
);

CREATE TABLE `offers` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`title` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`images` varchar(255) NOT NULL,
	`business_id` int NOT NULL UNIQUE,
	`validity` DATETIME NOT NULL
);

CREATE TABLE `business` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`name` varchar(255) NOT NULL,
	`owner_name` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`phone_no` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`website` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL
);

CREATE TABLE `points_transaction` (
	`id` int(8) NOT NULL AUTO_INCREMENT UNIQUE,
	`user_id` int NOT NULL UNIQUE,
	`amount` int NOT NULL,
	`type` varchar(255) NOT NULL
);

ALTER TABLE `user_offer` ADD CONSTRAINT `user_offer_fk0` FOREIGN KEY (`offer_id`) REFERENCES `offers`(`id`);



