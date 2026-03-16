package com.example.taggeoMap.configuration.databasemultitenant;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

public class MultiTenantDataSource extends AbstractRoutingDataSource {

    // Stocker l'identifiant du tenant dans un ThreadLocal
    private static final ThreadLocal<String> currentTenant = new InheritableThreadLocal<>();

    // Stocker les datasources disponibles
    private final Map<Object, Object> resolvedDataSources = new HashMap<>();

    // Méthode pour définir le tenant courant
    public static void setCurrentTenant(String tenant) {
        currentTenant.set(tenant);
    }

    // Méthode pour effacer le tenant courant
    public static void clear() {
        currentTenant.remove();
    }

    // Méthode de routage qui retourne la clé courante
    @Override
    protected Object determineCurrentLookupKey() {
        String tenant = currentTenant.get();
        System.out.println("🔄 Sélection de la base pour le tenant: " + tenant);
        System.out.println("🔍 Bases disponibles: " + resolvedDataSources.keySet());
        return tenant;
    }

    // Ajout dynamique d'une nouvelle DataSource
    public void addDataSource(String key, DataSource dataSource) {
        resolvedDataSources.put(key, dataSource);
        // Mettre à jour la map dans la superclasse et recharger la configuration
        super.setTargetDataSources(new HashMap<>(resolvedDataSources));
        super.afterPropertiesSet();
    }

    // Initialisation : on peut vérifier qu'au moins une datasource est configurée
    @Override
    public void afterPropertiesSet() {
        if (resolvedDataSources.isEmpty()) {
            throw new IllegalArgumentException("Aucune datasource n'a été configurée");
        }
        super.setTargetDataSources(new HashMap<>(resolvedDataSources));
        super.afterPropertiesSet();
    }

    // Méthode pour récupérer le tenant actuel
    public static String getCurrentTenant() {
        return currentTenant.get();
    }

}
