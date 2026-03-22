package com.example.taggeoMap.controller;

import com.example.taggeoMap.Model.Table.Trimestre;
import com.example.taggeoMap.Service.TrimestreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trimestres")
public class TrimestreController {

    @Autowired
    private TrimestreService trimestreService;

    @GetMapping
    public List<Trimestre> getAllTrimestres() {
        return trimestreService.getAllTrimestres();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trimestre> getTrimestreById(@PathVariable String id) {
        return trimestreService.getTrimestreById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/annee-scolaire/{anneeScolaireId}")
    public List<Trimestre> getTrimestresByAnneeScolaireId(@PathVariable String anneeScolaireId) {
        return trimestreService.getTrimestresByAnneeScolaireId(anneeScolaireId);
    }

    @PostMapping
    public Trimestre createTrimestre(@RequestBody Trimestre trimestre) {
        return trimestreService.createTrimestre(trimestre);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trimestre> updateTrimestre(@PathVariable String id, @RequestBody Trimestre trimestreDetails) {
        try {
            Trimestre updatedTrimestre = trimestreService.updateTrimestre(id, trimestreDetails);
            return ResponseEntity.ok(updatedTrimestre);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrimestre(@PathVariable String id) {
        try {
            trimestreService.deleteTrimestre(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
