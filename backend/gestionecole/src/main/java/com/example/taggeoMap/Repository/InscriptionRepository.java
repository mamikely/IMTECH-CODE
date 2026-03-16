package com.example.taggeoMap.Repository;


import com.example.taggeoMap.Model.Enum.EnumTypeInscription;
import com.example.taggeoMap.Model.Table.AnneeScolaire;
import com.example.taggeoMap.Model.Table.Eleve;
import com.example.taggeoMap.Model.Table.Inscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InscriptionRepository extends JpaRepository<Inscription,String> {
    Optional<Inscription> findByEleveAndAnneeScolaireAndType(Eleve eleve, AnneeScolaire anneeScolaire, EnumTypeInscription type);
    Optional<Inscription> findByEleveAndAnneeScolaire(Eleve eleve, AnneeScolaire anneeScolaire);


    List<Inscription> findAllByEleve(Eleve eleve);
}
