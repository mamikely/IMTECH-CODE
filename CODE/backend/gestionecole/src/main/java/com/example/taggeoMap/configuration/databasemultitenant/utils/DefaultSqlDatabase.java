package com.example.taggeoMap.configuration.databasemultitenant.utils;

public class DefaultSqlDatabase {
    public static  String create_data_base="CREATE DATABASE IF NOT EXISTS ";

    public  static  String create_table_absence="CREATE TABLE IF NOT EXISTS `absence` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`date` DATE NOT NULL,\n" +
            "\t`heure_debut` TIME(6) NULL DEFAULT NULL,\n" +
            "\t`heure_fin` TIME(6) NULL DEFAULT NULL,\n" +
            "\t`justifiee` BIT(1) NOT NULL,\n" +
            "\t`motif` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`type` ENUM('ABSENCE','RETARD') NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`eleve_id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`matiere_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE,\n" +
            "\tINDEX `FKgr70df9w2efr2q7wqo4cnotle` (`eleve_id`) USING BTREE,\n" +
            "\tINDEX `FKcsvufh7p9u8k0pvi15b7gtwvv` (`matiere_id`) USING BTREE,\n" +
            "\tCONSTRAINT `FKcsvufh7p9u8k0pvi15b7gtwvv` FOREIGN KEY (`matiere_id`) REFERENCES `matiere` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,\n" +
            "\tCONSTRAINT `FKgr70df9w2efr2q7wqo4cnotle` FOREIGN KEY (`eleve_id`) REFERENCES `eleve` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";
    public static String create_table_annee_scolaire="CREATE TABLE IF NOT EXISTS `annee_scolaire` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`annee_scolaire` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";

    public static String create_table_classe="CREATE TABLE  IF NOT EXISTS `classe` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`niveau` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`nom` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";
    public static String create_table_eleve="CREATE TABLE IF NOT EXISTS `eleve` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`adresse` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`adresse_parent` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`adresse_tutaire` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`apv` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`charge_etude` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`codeunique` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`comportement_enfant` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`date_bapteme` DATE NULL DEFAULT NULL,\n" +
            "\t`date_naissance` DATE NULL DEFAULT NULL,\n" +
            "\t`devoire_mere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`devoire_pere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`eglise` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`eglise1` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`eglise_parent` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`enfant_habita` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`faritra` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`fikambanana_mere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`fikambanana_pere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`finona_mere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`finona_pere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`finona_zaza` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`lieu_bapteme` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`lieu_naissance` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`lieu_travail_mere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`lieu_travail_pere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`matricule` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`mere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`nom` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`nom_tutaire` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`numero` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`numero_economat` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`old_ecole` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`pere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`prenom` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`profession_mere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`profession_pere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`qui_premier_responsable` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`raintampo` INT(11) NOT NULL,\n" +
            "\t`raintampo_ecole` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`raintampo_faha` INT(11) NOT NULL,\n" +
            "\t`raintampo_lahy` INT(11) NOT NULL,\n" +
            "\t`raintampo_vavy` INT(11) NOT NULL,\n" +
            "\t`raison` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`raison_hampidirana` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`sinon_enfant_habita` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`status` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`status_parent` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`tel_mere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`tel_pere` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`tel_tutaire` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`telephone_parent` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`url_photo` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`vonona_ve` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE,\n" +
            "\tUNIQUE INDEX `UK2ftap3uo9r61bk750q8uqf1cg` (`numero`) USING BTREE,\n" +
            "\tUNIQUE INDEX `UK58ehtrh20tftb77dida2y3qp1` (`codeunique`) USING BTREE,\n" +
            "\tUNIQUE INDEX `UKtj0b5oabvt2uyys676n2qsmbu` (`matricule`) USING BTREE\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";

    public  static  String create_table_examen="CREATE TABLE IF NOT EXISTS `examen` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`date_debut` DATE NULL DEFAULT NULL,\n" +
            "\t`date_fin` DATE NULL DEFAULT NULL,\n" +
            "\t`libelle` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`trimestre_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE,\n" +
            "\tINDEX `FKjupcwhpxnvdvpmkjf93wswaip` (`trimestre_id`) USING BTREE,\n" +
            "\tCONSTRAINT `FKjupcwhpxnvdvpmkjf93wswaip` FOREIGN KEY (`trimestre_id`) REFERENCES `trimestre` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";

    public static String create_table_inscription="CREATE TABLE IF NOT EXISTS `inscription` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`date_affectation` DATETIME(6) NULL DEFAULT NULL,\n" +
            "\t`statut` ENUM('EN_ATTENTE','REFUSEE','VALIDEE') NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`type` TINYINT(4) NULL DEFAULT NULL,\n" +
            "\t`annee_scolaire_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`classe_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`eleve_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE,\n" +
            "\tINDEX `FK824c4qoiwqerub2w41rfepxe4` (`annee_scolaire_id`) USING BTREE,\n" +
            "\tINDEX `FKo6s2ahy3b4e0bkschg3lr7fnr` (`classe_id`) USING BTREE,\n" +
            "\tINDEX `FKcttrk9ja646r33g42sxlwruic` (`eleve_id`) USING BTREE,\n" +
            "\tCONSTRAINT `FK824c4qoiwqerub2w41rfepxe4` FOREIGN KEY (`annee_scolaire_id`) REFERENCES `annee_scolaire` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,\n" +
            "\tCONSTRAINT `FKcttrk9ja646r33g42sxlwruic` FOREIGN KEY (`eleve_id`) REFERENCES `eleve` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,\n" +
            "\tCONSTRAINT `FKo6s2ahy3b4e0bkschg3lr7fnr` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";

    public  static  String create_table_matiere="CREATE TABLE IF NOT EXISTS  `matiere` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`coefficient` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`description` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`nom` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`classe_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE,\n" +
            "\tUNIQUE INDEX `UK91ncirasc18cynsf8p8efhn45` (`coefficient`) USING BTREE,\n" +
            "\tINDEX `FKspcxtefasu41jjphmjivpyjlw` (`classe_id`) USING BTREE,\n" +
            "\tCONSTRAINT `FKspcxtefasu41jjphmjivpyjlw` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";

    public  static  String create_table_note="CREATE TABLE IF NOT EXISTS `note` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`appreciation` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`valeur` DOUBLE NOT NULL,\n" +
            "\t`eleve_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`examen_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`matiere_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE,\n" +
            "\tINDEX `FKm4rbq37cfv2fk8e2yb28a5ls5` (`eleve_id`) USING BTREE,\n" +
            "\tINDEX `FKqeexjhoqpiewuw1wo7orh8ktt` (`examen_id`) USING BTREE,\n" +
            "\tINDEX `FKjv5stxhvwriu7yyoel2jtwpwc` (`matiere_id`) USING BTREE,\n" +
            "\tCONSTRAINT `FKjv5stxhvwriu7yyoel2jtwpwc` FOREIGN KEY (`matiere_id`) REFERENCES `matiere` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,\n" +
            "\tCONSTRAINT `FKm4rbq37cfv2fk8e2yb28a5ls5` FOREIGN KEY (`eleve_id`) REFERENCES `eleve` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,\n" +
            "\tCONSTRAINT `FKqeexjhoqpiewuw1wo7orh8ktt` FOREIGN KEY (`examen_id`) REFERENCES `examen` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";
    public static String create_table_paiement="CREATE TABLE IF NOT EXISTS `paiement` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`amount` BIGINT(20) NULL DEFAULT NULL,\n" +
            "\t`date_paiement` DATE NULL DEFAULT NULL,\n" +
            "\t`mois` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`type` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`inscription_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE,\n" +
            "\tINDEX `FKg0m4gl53rqm48tbtrwdw2miph` (`inscription_id`) USING BTREE,\n" +
            "\tCONSTRAINT `FKg0m4gl53rqm48tbtrwdw2miph` FOREIGN KEY (`inscription_id`) REFERENCES `inscription` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";
    public static String create_table_tarifs="CREATE TABLE IF NOT EXISTS `tarifs` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`montant` DOUBLE NULL DEFAULT NULL,\n" +
            "\t`type` TINYINT(4) NULL DEFAULT NULL,\n" +
            "\t`annee_scolaire_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`classe_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE,\n" +
            "\tINDEX `FKpmdl4vce5qdhnbjq2tgkd95ae` (`annee_scolaire_id`) USING BTREE,\n" +
            "\tINDEX `FKcmf4svb5wxbg1kdqqytap4akn` (`classe_id`) USING BTREE,\n" +
            "\tCONSTRAINT `FKcmf4svb5wxbg1kdqqytap4akn` FOREIGN KEY (`classe_id`) REFERENCES `classe` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,\n" +
            "\tCONSTRAINT `FKpmdl4vce5qdhnbjq2tgkd95ae` FOREIGN KEY (`annee_scolaire_id`) REFERENCES `annee_scolaire` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";

    public  static  String create_table_trimestre="CREATE TABLE IF NOT EXISTS `trimestre` (\n" +
            "\t`id` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`date_debut` DATE NULL DEFAULT NULL,\n" +
            "\t`date_fin` DATE NULL DEFAULT NULL,\n" +
            "\t`libelle` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',\n" +
            "\t`annee_scolaire_id` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8_general_ci',\n" +
            "\tPRIMARY KEY (`id`) USING BTREE,\n" +
            "\tINDEX `FKftwccf646mihy2itft5l8lvvc` (`annee_scolaire_id`) USING BTREE,\n" +
            "\tCONSTRAINT `FKftwccf646mihy2itft5l8lvvc` FOREIGN KEY (`annee_scolaire_id`) REFERENCES `annee_scolaire` (`id`) ON UPDATE RESTRICT ON DELETE RESTRICT\n" +
            ")\n" +
            "COLLATE='utf8_general_ci'\n" +
            "ENGINE=InnoDB\n" +
            ";\n";







}
