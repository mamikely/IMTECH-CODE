package com.example.taggeoMap.Service;

import com.example.taggeoMap.Exception.RessourceNotFoundException;
import com.example.taggeoMap.Model.Table.*;
import com.example.taggeoMap.Repository.AbsenceRepository;
import com.example.taggeoMap.Repository.EleveRepository;
import com.example.taggeoMap.Repository.MatiereRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AbsenceService {

    private final AbsenceRepository absenceRepository;
    private final EleveRepository eleveRepository;
    private final MatiereRepository matiereRepository;

    // Enregistrer une absence
    @Transactional
    public Absence enregistrerAbsence(String eleveId, String matiereId, LocalDate date, boolean justifiee, String motif) {
        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RessourceNotFoundException("Élève non trouvé avec l'ID : " + eleveId));
        
        Matiere matiere = null;
        if (matiereId != null) {
            matiere = matiereRepository.findById(matiereId)
                    .orElseThrow(() -> new RessourceNotFoundException("Matière non trouvée avec l'ID : " + matiereId));
        }

        Absence absence = new Absence(eleve, matiere, date, justifiee, motif);
        return absenceRepository.save(absence);
    }

    // Enregistrer un retard
    @Transactional
    public Absence enregistrerRetard(String eleveId, String matiereId, LocalDate date, 
                                    LocalTime heureDebut, LocalTime heureFin, boolean justifiee, String motif) {
        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RessourceNotFoundException("Élève non trouvé avec l'ID : " + eleveId));
        
        Matiere matiere = null;
        if (matiereId != null) {
            matiere = matiereRepository.findById(matiereId)
                    .orElseThrow(() -> new RessourceNotFoundException("Matière non trouvée avec l'ID : " + matiereId));
        }

        Absence retard = new Absence(eleve, matiere, date, heureDebut, heureFin, justifiee, motif);
        return absenceRepository.save(retard);
    }

    // Justifier une absence/retard
    @Transactional
    public Absence justifierAbsence(String absenceId, String motif) {
        Absence absence = absenceRepository.findById(absenceId)
                .orElseThrow(() -> new RessourceNotFoundException("Absence non trouvée avec l'ID : " + absenceId));
        
        absence.setJustifiee(true);
        absence.setMotif(motif);
        return absenceRepository.save(absence);
    }

    // Obtenir les absences d'un élève
    public List<Absence> obtenirAbsencesParEleve(String eleveId) {
        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RessourceNotFoundException("Élève non trouvé avec l'ID : " + eleveId));
        
        return absenceRepository.findByEleve(eleve);
    }

    // Obtenir les retards d'un élève
    public List<Absence> obtenirRetardsParEleve(String eleveId) {
        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RessourceNotFoundException("Élève non trouvé avec l'ID : " + eleveId));
        
        return absenceRepository.findRetardsByEleve(eleve);
    }

    // Obtenir les absences d'une classe à une date donnée
    public List<Absence> obtenirAbsencesParDate(LocalDate date) {
        return absenceRepository.findByDate(date);
    }

    // Supprimer une absence
    @Transactional
    public void supprimerAbsence(String absenceId) {
        absenceRepository.deleteById(absenceId);
    }

    // Compter les absences non justifiées d'un élève
    public long compterAbsencesNonJustifiees(String eleveId) {
        Eleve eleve = eleveRepository.findById(eleveId)
                .orElseThrow(() -> new RessourceNotFoundException("Élève non trouvé avec l'ID : " + eleveId));
        
        return absenceRepository.countByEleveAndJustifieeFalse(eleve);
    }
}
