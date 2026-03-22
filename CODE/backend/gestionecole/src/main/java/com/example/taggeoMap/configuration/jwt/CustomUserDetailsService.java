package com.example.taggeoMap.configuration.jwt;

import com.example.taggeoMap.Model.Table.Utilisateur;
import com.example.taggeoMap.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UtilisateurRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) {
      Utilisateur user = userRepository.findByUsername(username)
              .orElseThrow(() -> new UsernameNotFoundException("User not found"));

      return User.withUsername(user.getUsername()).password(user.getPassword()).roles(user.getRole()).build();

  }

}