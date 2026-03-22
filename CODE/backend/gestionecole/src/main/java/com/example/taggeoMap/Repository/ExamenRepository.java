package com.example.taggeoMap.Repository;

import com.example.taggeoMap.Model.Table.Examen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamenRepository extends JpaRepository<Examen, String> {
    
    @Query("SELECT DISTINCT e FROM Examen e " +
           "JOIN e.notes n " +
           "JOIN n.eleve el " +
           "JOIN el.inscriptions i " +
           "WHERE i.classe.id = :classeId")
    List<Examen> findExamensByClasseId(@Param("classeId") String classeId);
    
    // Si vous avez besoin de la méthode originale qui ne fonctionnait pas,
    // vous pouvez la commenter ou la supprimer
    // List<Examen> findByClasseId(String classeId);
}
