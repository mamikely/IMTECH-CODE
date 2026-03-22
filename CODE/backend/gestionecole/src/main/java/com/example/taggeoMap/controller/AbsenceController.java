package com.example.taggeoMap.controller;

import com.example.taggeoMap.Model.Table.Absence;
import com.example.taggeoMap.Service.AbsenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/absences")
@RequiredArgsConstructor
public class AbsenceController {
@Autowired
    private final AbsenceService absenceService;

    @PostMapping("/absence")
    public ResponseEntity<Absence> enregistrerAbsence(
            @RequestParam String eleveId,
            @RequestParam(required = false) String matiereId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "false") boolean justifiee,
            @RequestParam(required = false) String motif) {
        
        Absence absence = absenceService.enregistrerAbsence(eleveId, matiereId, date, justifiee, motif);
        return ResponseEntity.ok(absence);
    }

    @PostMapping("/retard")
    public ResponseEntity<Absence> enregistrerRetard(
            @RequestParam String eleveId,
            @RequestParam(required = false) String matiereId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime heureDebut,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime heureFin,
            @RequestParam(defaultValue = "false") boolean justifiee,
            @RequestParam(required = false) String motif) {
        
        Absence retard = absenceService.enregistrerRetard(eleveId, matiereId, date, heureDebut, heureFin, justifiee, motif);
        return ResponseEntity.ok(retard);
    }

    @PutMapping("/{id}/justifier")
    public ResponseEntity<Absence> justifierAbsence(
            @PathVariable String id,
            @RequestParam String motif) {
        
        Absence absence = absenceService.justifierAbsence(id, motif);
        return ResponseEntity.ok(absence);
    }

    @GetMapping("/eleve/{eleveId}")
    public ResponseEntity<List<Absence>> obtenirAbsencesParEleve(@PathVariable String eleveId) {
        List<Absence> absences = absenceService.obtenirAbsencesParEleve(eleveId);
        return ResponseEntity.ok(absences);
    }

    @GetMapping("/eleve/{eleveId}/retards")
    public ResponseEntity<List<Absence>> obtenirRetardsParEleve(@PathVariable String eleveId) {
        List<Absence> retards = absenceService.obtenirRetardsParEleve(eleveId);
        return ResponseEntity.ok(retards);
    }

    @GetMapping("/date")
    public ResponseEntity<List<Absence>> obtenirAbsencesParDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        
        List<Absence> absences = absenceService.obtenirAbsencesParDate(date);
        return ResponseEntity.ok(absences);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerAbsence(@PathVariable String id) {
        absenceService.supprimerAbsence(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/eleve/{eleveId}/compteur-non-justifiees")
    public ResponseEntity<Long> compterAbsencesNonJustifiees(@PathVariable String eleveId) {
        long nombre = absenceService.compterAbsencesNonJustifiees(eleveId);
        return ResponseEntity.ok(nombre);
    }
}
