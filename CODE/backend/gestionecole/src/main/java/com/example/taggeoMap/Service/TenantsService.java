package com.example.taggeoMap.Service;


import com.example.taggeoMap.Model.Table.Tenants;
import com.example.taggeoMap.Repository.TenantsRepository;
import com.example.taggeoMap.configuration.databasemultitenant.DataSourceConfig;
import com.example.taggeoMap.configuration.databasemultitenant.MultiTenantDataSource;
import com.example.taggeoMap.configuration.databasemultitenant.utils.DefaultDataSourceProperties;
import com.example.taggeoMap.configuration.databasemultitenant.utils.DefaultSqlDatabase;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;

@Service
public class TenantsService {

    @Autowired
    private DataSource dataSource; // Notre MultiTenantDataSource

    @Autowired
    private DataSourceConfig dataSourceConfig; // Pour utiliser la méthode createDataSource

    @Autowired
    private TenantsRepository tenantInfoRepository;

    public void addTenant(String tenantId, String url, String username, String password) {
        createDatabase(tenantId + "_db");
        if (dataSource instanceof MultiTenantDataSource multiTenantDataSource) {
            DataSource newDataSource = dataSourceConfig.createDataSource(url, username, password);
            multiTenantDataSource.addDataSource(tenantId, newDataSource);
        } else {
            throw new IllegalStateException("Le bean DataSource n'est pas de type MultiTenantDataSource");
        }
    }

    // 🔹 Charger les tenants au démarrage
    @PostConstruct
    public void loadTenantsAtStartup() {
        List<Tenants> tenants = tenantInfoRepository.findAll();
        System.out.println("🔍 Bases disponibles: " + tenants.size());

        for (Tenants tenant : tenants) {
            if (tenant.getUrl_db() != null && !tenant.getTenantId().equals(DefaultDataSourceProperties.db_default_name))
                addTenant(tenant.getTenantId(), tenant.getUrl_db(), tenant.getUsername_db(), tenant.getPassword_db());
        }
    }

    private void createDatabase(String dbName) {

        try (Connection conn = DriverManager.getConnection(DefaultDataSourceProperties.db_url, DefaultDataSourceProperties.db_username, DefaultDataSourceProperties.db_password);
             Statement stmt = conn.createStatement()) {

            stmt.executeUpdate(DefaultSqlDatabase.create_data_base + dbName);
            stmt.executeUpdate("use " + dbName);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_annee_scolaire);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_classe);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_eleve);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_inscription);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_tarifs);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_paiement);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_matiere);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_trimestre);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_absence);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_examen);
            stmt.executeUpdate(DefaultSqlDatabase.create_table_note);


            System.out.println("Database created: " + dbName);

        } catch (SQLException e) {
            System.out.println(e.fillInStackTrace());
            throw new RuntimeException("Failed to create database: " + dbName, e);
        }
    }


}
