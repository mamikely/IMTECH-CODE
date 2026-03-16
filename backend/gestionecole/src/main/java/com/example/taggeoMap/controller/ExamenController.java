package com.example.taggeoMap.controller;

import com.example.taggeoMap.Model.Table.Examen;
import com.example.taggeoMap.Service.ExamenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examens")
public class ExamenController {

    @Autowired
    private ExamenService examenService;

    @GetMapping
    public List<Examen> getAllExamens() {
        return examenService.getAllExamens();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Examen> getExamenById(@PathVariable String id) {
        return examenService.getExamenById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/classe/{classeId}")
    public List<Examen> getExamensByClasseId(@PathVariable String classeId) {
        return examenService.getExamensByClasseId(classeId);
    }

    @PostMapping
    public Examen createExamen(@RequestBody Examen examen) {
        return examenService.createExamen(examen);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Examen> updateExamen(@PathVariable String id, @RequestBody Examen examenDetails) {
        try {
            Examen updatedExamen = examenService.updateExamen(id, examenDetails);
            return ResponseEntity.ok(updatedExamen);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExamen(@PathVariable String id) {
        try {
            examenService.deleteExamen(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
