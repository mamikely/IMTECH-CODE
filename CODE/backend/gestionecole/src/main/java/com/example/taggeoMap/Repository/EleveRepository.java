package com.example.taggeoMap.Repository;


import com.example.taggeoMap.Model.Table.Eleve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EleveRepository extends JpaRepository<Eleve,String> {
    Optional<Eleve> findByMatricule(String matricule);
    Optional<Eleve> findByCodeunique(String codeunique);

    boolean existsByMatricule(String matricule);
}
