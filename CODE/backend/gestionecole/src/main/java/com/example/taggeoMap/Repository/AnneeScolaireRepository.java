package com.example.taggeoMap.Repository;


import com.example.taggeoMap.Model.Table.AnneeScolaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnneeScolaireRepository extends JpaRepository<AnneeScolaire,String> {
    boolean existsByAnneeScolaire(String anneeScolaire);
}
