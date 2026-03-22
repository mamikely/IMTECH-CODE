package com.example.taggeoMap.Repository;

import com.example.taggeoMap.Model.Table.Trimestre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrimestreRepository extends JpaRepository<Trimestre, String> {
    List<Trimestre> findByAnneeScolaireId(String anneeScolaireId);
}
