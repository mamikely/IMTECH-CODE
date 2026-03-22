package com.example.taggeoMap.controller;


import com.example.taggeoMap.Model.Table.Utilisateur;
import com.example.taggeoMap.Repository.UtilisateurRepository;
import com.example.taggeoMap.configuration.jwt.CustomUserDetailsService;
import com.example.taggeoMap.configuration.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private CustomUserDetailsService userDetailsService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UtilisateurRepository utilisateurRepository;
    private Map<String, Object> map = new HashMap<>();

    @CrossOrigin
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Utilisateur utilisateur) {
        map.clear();
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(utilisateur.getUsername(), utilisateur.getPassword()));
            UserDetails user = userDetailsService.loadUserByUsername(utilisateur.getUsername());
            String token = jwtUtil.generateToken(user);
            Utilisateur utilisateur1 = utilisateurRepository.findByUsernameAndPassword(user.getUsername(),user.getPassword()).orElse(null);
            if (utilisateur1 != null) {
                map.put("status", "success");
                map.put("Token", token);
                map.put("XTenantID", utilisateur1.getTenants().getTenantId());
                map.put("tenants",utilisateur1.getTenants());
                map.put("role",utilisateur1.getRole());


            }
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("status", "erreur");
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.OK).body(map);
        }


    }
}
