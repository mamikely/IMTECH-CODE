package com.example.taggeoMap.configuration;

import com.example.taggeoMap.configuration.jwt.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Autoriser les requêtes OPTIONS partout (pour CORS preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/view/**").permitAll()


                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/api/check").permitAll()
                        .requestMatchers("/api/PARENT/save/**").permitAll()
                        .requestMatchers("/api/PARENT/update").hasAnyRole("PARENT")
                        .requestMatchers("/api/PARENT/delete").hasAnyRole("PARENT")
                        .requestMatchers("/api/PARENT/getAll").hasAnyRole("PARENT")
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/ecole/**").hasAnyRole("SUPERADMIN", "PARENT")

                        .requestMatchers("/api/anneescolaire/**").hasAnyRole("ADMIN","PARENT","SECRETAIRE","ECONOMAT")
                        .requestMatchers("/api/eleve/**").hasAnyRole("ADMIN", "PARENT","SECRETAIRE")
                        .requestMatchers("/api/classe/**").hasAnyRole("ADMIN","PARENT","SECRETAIRE")
                        .requestMatchers("/api/inscriptions/**").hasAnyRole("ADMIN","PARENT","SECRETAIRE","ECONOMAT")
                        .requestMatchers("/api/paiements/**").hasAnyRole("ECONOMAT")
                        .requestMatchers("/api/tarifs/**").hasAnyRole("ADMIN")
                        .requestMatchers("/api/users/**").hasAnyRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}