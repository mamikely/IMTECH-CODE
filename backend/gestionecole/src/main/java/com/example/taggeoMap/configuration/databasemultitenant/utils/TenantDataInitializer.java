package com.example.taggeoMap.configuration.databasemultitenant.utils;


import com.example.taggeoMap.Model.Table.Role;
import com.example.taggeoMap.Model.Table.Tenants;
import com.example.taggeoMap.Model.Table.Utilisateur;
import com.example.taggeoMap.Repository.RoleRepository;
import com.example.taggeoMap.Repository.TenantsRepository;
import com.example.taggeoMap.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class TenantDataInitializer implements CommandLineRunner {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private TenantsRepository tenantsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RoleRepository roleRepository;
    @Override
    public void run(String... args) throws Exception {

        if (!tenantsRepository.existsByNom(DefaultDataSourceProperties.supper_admin_tennat)) {
            Tenants tenant = new Tenants();
            tenant.setTenantId(DefaultDataSourceProperties.db_default_name);
            tenant.setNom(DefaultDataSourceProperties.supper_admin_tennat);
            tenant.setUrl_db(DefaultDataSourceProperties.db_url +DefaultDataSourceProperties.db_default_name);
            tenant.setUsername_db(DefaultDataSourceProperties.db_username);
            tenant.setPassword_db(DefaultDataSourceProperties.db_password);
            tenant=tenantsRepository.save(tenant);

            Utilisateur user = new Utilisateur();
            user.setUsername(DefaultDataSourceProperties.defaulte_utilisateur_supper_admin_tennat);
            user.setPassword(passwordEncoder.encode(DefaultDataSourceProperties.defaulte_passeword_supper_admin_tennat));
            user.setRole(DefaultDataSourceProperties.defaulte_role_supper_admin_tennat);
            user.setTenants(tenant);

            Role role = roleRepository.findByName(user.getRole().toUpperCase())
                    .orElseGet(() -> roleRepository.save(new Role(null, user.getRole().toUpperCase())));
            user.getRoles().add(role);
            utilisateurRepository.save(user);
            System.out.println("Inserted tenant: " + tenant);
        } else {
            System.out.println("Tenant with ID 1 already exists, skipping insertion");
        }


    }
}