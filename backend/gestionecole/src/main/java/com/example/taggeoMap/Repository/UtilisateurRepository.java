package com.example.taggeoMap.Repository;

import com.example.taggeoMap.Model.Table.Tenants;
import com.example.taggeoMap.Model.Table.Utilisateur;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur,String> {
    Optional<Utilisateur> findByUsername(String username);


    <S extends Utilisateur> List<S> findAllByTenants(Tenants tenants);

    Optional<Utilisateur>findByUsernameAndPassword(String username, String password);
}
