package com.example.taggeoMap.controller;


import com.example.taggeoMap.Model.Table.Role;
import com.example.taggeoMap.Model.Table.Tenants;
import com.example.taggeoMap.Model.Table.Utilisateur;
import com.example.taggeoMap.Repository.RoleRepository;
import com.example.taggeoMap.Repository.TenantsRepository;
import com.example.taggeoMap.Repository.UtilisateurRepository;
import com.example.taggeoMap.Service.TenantsService;
import com.example.taggeoMap.configuration.databasemultitenant.utils.DefaultDataSourceProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ecole")
public class TenantsController {
    @Autowired
    private TenantsRepository tenantInfoRepository;
    @Autowired
    private TenantsService tenantDataSourceService;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RoleRepository roleRepository;
    private Map<String, Object> map = new HashMap<>();

    @CrossOrigin
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> addTenant(@RequestBody Tenants tenant) {
        map.clear();
        try {
            if (!tenantInfoRepository.existsByNom(tenant.getNom())) {
                // Sauvegarder les informations du tenant dans la base par défaut
                tenant.setTenantId(UUID.randomUUID().toString().replaceAll("-", "_"));
                tenant.setUrl_db(DefaultDataSourceProperties.db_url + tenant.getTenantId() + "_db");
                tenant.setUsername_db(DefaultDataSourceProperties.db_username);
                tenant.setPassword_db(DefaultDataSourceProperties.db_password);
                tenant = tenantInfoRepository.save(tenant);

                // Ajouter dynamiquement la datasource pour ce tenant
                tenantDataSourceService.addTenant(
                        tenant.getTenantId(),
                        tenant.getUrl_db(),
                        tenant.getUsername_db(),
                        tenant.getPassword_db()
                );

                //Ajouter un compte admin par defaut dans le tenant creer
                Utilisateur user = new Utilisateur();
                user.setUsername(tenant.getNom());
                user.setPassword(passwordEncoder.encode(tenant.getNom()));
                user.setRole(DefaultDataSourceProperties.defaulte_role_admin_tennat);
                user.setTenants(tenant);
                //assigner l'utilisateur avec un roles
                Role role = roleRepository.findByName(user.getRole().toUpperCase())
                        .orElseGet(() -> roleRepository.save(new Role(null, user.getRole().toUpperCase())));
                user.getRoles().add(role);
                utilisateurRepository.save(user);
                map.put("status", "success");
                map.put("message", tenant);
                return ResponseEntity.status(HttpStatus.CREATED).body(map);
            } else {
                map.put("status", "exist");
                map.put("message", "c' est déjà existe dans la base de données");
                return ResponseEntity.status(HttpStatus.FOUND).body(map);
            }

        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("status", "erreur");
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);

        }

    }

    @CrossOrigin
    @PutMapping("/update")
    public  ResponseEntity<Map<String,Object>>UpdateTenant(@RequestBody Tenants tenants){
        map.clear();
        try{
            if (tenantInfoRepository.existsById(tenants.getId())){
                tenantInfoRepository.save(tenants);
                map.put("status", "success");
                map.put("message", tenants);
                return  ResponseEntity.status(HttpStatus.OK).body(map);
            }else{
                map.put("status", "introuvable");
                map.put("message", "ce n'existe pas dans la base de données");
                return  ResponseEntity.status(HttpStatus.OK).body(map);
            }

        }catch (Exception e){
            map.put("status", "erreur");
            map.put("message", e.getMessage());
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete/{idecole}")
    public  ResponseEntity<Map<String,Object>>DeleteTenant(@PathVariable String  idecole){
        map.clear();
        try{
            if (tenantInfoRepository.existsById(idecole)){
                tenantInfoRepository.deleteById(idecole);
                map.put("status", "success");
                map.put("message", "suppression bien effectuée");
                return  ResponseEntity.status(HttpStatus.OK).body(map);
            }else{
                map.put("status", "introuvable");
                map.put("message", "ce  n'existe pas dans la base de données");
                return  ResponseEntity.status(HttpStatus.OK).body(map);
            }

        }catch (Exception e){
            map.put("status", "erreur");
            map.put("message", e.getMessage());
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    @CrossOrigin("*")
    @GetMapping("/getAll")
    public  ResponseEntity<Map<String,Object>>GetAllTenant(){
        map.clear();
        try{

                map.put("status", "success");
                map.put("message",tenantInfoRepository.findAll());
                return  ResponseEntity.status(HttpStatus.OK).body(map);


        }catch (Exception e){
            map.put("status", "erreur");
            map.put("message",new ArrayList<>());
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }


    @CrossOrigin
    @GetMapping("/count")
    public long getsize(){
        return  tenantInfoRepository.count();
    }
}
