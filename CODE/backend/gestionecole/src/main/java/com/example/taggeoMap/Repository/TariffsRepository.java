package com.example.taggeoMap.Repository;

import com.example.taggeoMap.Model.Enum.EnumTypeTarif;
import com.example.taggeoMap.Model.Table.AnneeScolaire;
import com.example.taggeoMap.Model.Table.Classe;
import com.example.taggeoMap.Model.Table.Tarifs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TariffsRepository extends JpaRepository <Tarifs,String>{

    List<Tarifs> findAllByClasseAndAnneeScolaire(Classe classe,AnneeScolaire anneeScolaire);

    boolean existsByTypeAndAndAnneeScolaireAndClasse(EnumTypeTarif type, AnneeScolaire anneeScolaire, Classe classe);
}
