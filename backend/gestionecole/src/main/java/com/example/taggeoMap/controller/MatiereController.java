package com.example.taggeoMap.controller;

import com.example.taggeoMap.Model.Table.Matiere;
import com.example.taggeoMap.Service.MatiereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matieres")
public class MatiereController {

    @Autowired
    private MatiereService matiereService;

    @GetMapping
    public List<Matiere> getAllMatieres() {
        return matiereService.getAllMatieres();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matiere> getMatiereById(@PathVariable String id) {
        try {
            Matiere matiere = matiereService.getMatiereById(id);
            return ResponseEntity.ok(matiere);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Matiere createMatiere(@RequestBody Matiere matiere) {
        return matiereService.createMatiere(matiere);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Matiere> updateMatiere(@PathVariable String id, @RequestBody Matiere matiereDetails) {
        try {
            Matiere updatedMatiere = matiereService.updateMatiere(id, matiereDetails);
            return ResponseEntity.ok(updatedMatiere);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMatiere(@PathVariable String id) {
        try {
            matiereService.deleteMatiere(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
