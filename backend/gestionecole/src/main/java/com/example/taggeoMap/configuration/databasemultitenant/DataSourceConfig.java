package com.example.taggeoMap.configuration.databasemultitenant;

import com.example.taggeoMap.configuration.databasemultitenant.utils.DefaultDataSourceProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        MultiTenantDataSource multiTenantDataSource = new MultiTenantDataSource();

        // Ajouter la datasource par défaut via addDataSource() afin de remplir resolvedDataSources
        multiTenantDataSource.addDataSource(DefaultDataSourceProperties.db_default_name, defaultDataSource());

        // Définir la datasource par défaut (au cas où aucun tenant ne correspond)
        multiTenantDataSource.setDefaultTargetDataSource(defaultDataSource());

        // Note : addDataSource() appelle déjà afterPropertiesSet()
        return multiTenantDataSource;
    }

    // Exemple de datasource par défaut
    public DataSource defaultDataSource() {
        return DataSourceBuilder.create()
                .url(DefaultDataSourceProperties.db_url+ DefaultDataSourceProperties.db_default_name)
                .username(DefaultDataSourceProperties.db_username)
                .password(DefaultDataSourceProperties.db_password)
                .driverClassName(DefaultDataSourceProperties.db_driver)
                .build();
    }

    // Méthode utilitaire pour créer une datasource pour un tenant donné
    public DataSource createDataSource(String url, String username, String password) {
        return DataSourceBuilder.create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName(DefaultDataSourceProperties.db_driver)
                .build();
    }
}
