package com.example.taggeoMap.Repository;


import com.example.taggeoMap.Model.Table.Classe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClasseRepository extends JpaRepository<Classe,String> {
    boolean existsByNom(String nom);
}
