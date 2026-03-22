package com.example.taggeoMap.Repository;

import com.example.taggeoMap.Model.Table.Absence;
import com.example.taggeoMap.Model.Table.Eleve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, String> {
    
    // Trouver toutes les absences d'un élève
    List<Absence> findByEleve(Eleve eleve);
    
    // Trouver les absences d'un élève entre deux dates
    List<Absence> findByEleveAndDateBetween(Eleve eleve, LocalDate dateDebut, LocalDate dateFin);
    
    // Trouver les absences d'une classe à une date donnée
    @Query("SELECT a FROM Absence a WHERE a.eleve.id IN (SELECT e.id FROM Eleve e WHERE e.inscriptions IS NOT EMPTY) AND a.date = :date")
    List<Absence> findByDate(@Param("date") LocalDate date);
    
    // Compter le nombre d'absences non justifiées d'un élève
    long countByEleveAndJustifieeFalse(Eleve eleve);
    
    // Trouver les retards d'un élève
    @Query("SELECT a FROM Absence a WHERE a.eleve = :eleve AND a.type = 'RETARD'")
    List<Absence> findRetardsByEleve(@Param("eleve") Eleve eleve);
    
    // Trouver les absences d'une matière spécifique
    List<Absence> findByMatiereId(String matiereId);
}
