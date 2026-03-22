package com.example.taggeoMap.controller;

import com.example.taggeoMap.Model.Table.Role;
import com.example.taggeoMap.Model.Table.Tenants;
import com.example.taggeoMap.Model.Table.Utilisateur;
import com.example.taggeoMap.Repository.RoleRepository;
import com.example.taggeoMap.Repository.TenantsRepository;
import com.example.taggeoMap.Repository.UtilisateurRepository;
import io.jsonwebtoken.lang.Maps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UtilisateurController {
@Autowired
private TenantsRepository tenantsRepository;
    @Autowired
    private UtilisateurRepository userRepository;
    @Autowired private RoleRepository roleRepository;
   @Autowired private PasswordEncoder passwordEncoder;
private Map<String,Object>map=new HashMap<>();
   @CrossOrigin
    @PostMapping("/register/{id_tenant}")
    public ResponseEntity<Map<String,Object>> register(@RequestBody Utilisateur user, @PathVariable  String id_tenant) {
       System.out.println("Tenant ID=============================="+id_tenant);
       map.clear();
       try{
           Tenants t=tenantsRepository.findById(id_tenant).orElse(null);


           user.setTenants(t);
           user.setPassword(passwordEncoder.encode(user.getPassword()));
           Role role = roleRepository.findByName(user.getRole().toUpperCase())
                   .orElseGet(() -> roleRepository.save(new Role(null, user.getRole().toUpperCase())));
           user.getRoles().add(role);
           userRepository.save(user);
           map.put("message","User registered");
           return ResponseEntity.ok(map);
       }catch (Exception e){
           e.fillInStackTrace();
           map.put("message","erreur");
           return ResponseEntity.ok(map);
       }

    }
    @CrossOrigin
    @PostMapping("/delete/{id_user}")
    public ResponseEntity<Map<String,Object>> delete( @PathVariable  String id_user) {

       map.clear();
       try{

           userRepository.deleteById(id_user);
           map.put("message","User registered");
           return ResponseEntity.ok(map);
       }catch (Exception e){
           e.fillInStackTrace();
           map.put("message","erreur");
           return ResponseEntity.ok(map);
       }

    }
       @CrossOrigin
    @GetMapping("/getAll/{id_tenant}")
    public List<?> register(@PathVariable String id_tenant) {
           Tenants t=tenantsRepository.findByTenantId(id_tenant).orElse(null);

           return userRepository.findAllByTenants(t);

    }


    @CrossOrigin
    @GetMapping("/count")
    public long getsize(){
       return  userRepository.count();
    }
}
