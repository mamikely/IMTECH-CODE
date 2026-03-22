package com.example.taggeoMap.controller;

import com.example.taggeoMap.Model.Table.AnneeScolaire;
import com.example.taggeoMap.Repository.AnneeScolaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/api/anneescolaire")
public class AnneeScolaireController {
    @Autowired
    private AnneeScolaireRepository repository;
    private Map<String, Object> map = new HashMap<>();

    @CrossOrigin
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> Save(@RequestBody AnneeScolaire anneeScolaire) {
        map.clear();
        try {
            if (!repository.existsByAnneeScolaire(anneeScolaire.getAnneeScolaire())) {

                anneeScolaire.setId(null);
                repository.save(anneeScolaire);
                map.put("status", "success");
                map.put("message", anneeScolaire);
                return ResponseEntity.status(HttpStatus.OK).body(map);
            } else {
                map.put("status", "exist");
                map.put("message", "c' est déjà existe dans la base de données");
                return ResponseEntity.status(HttpStatus.FOUND).body(map);

            }
        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("status", "erreur");
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }

    }

    @CrossOrigin
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> Upadate(@RequestBody AnneeScolaire anneeScolaire) {
        map.clear();
        try {
            if (repository.existsById(anneeScolaire.getId())) {
                repository.save(anneeScolaire);
                map.put("status", "success");
                map.put("message", anneeScolaire);
                return ResponseEntity.status(HttpStatus.OK).body(map);
            } else {
                map.put("status", "introuvable");
                map.put("message", "ce n'existe pas dans la base de données");
                return ResponseEntity.status(HttpStatus.OK).body(map);
            }
        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("status", "erreur");
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    @CrossOrigin
    @DeleteMapping("/delete/{annee_scolaire_id}")
    public ResponseEntity<Map<String, Object>> Delete(@PathVariable String annee_scolaire_id) {
        map.clear();
        try {
            if (repository.existsById(annee_scolaire_id)) {
                repository.deleteById(annee_scolaire_id);
                map.put("status", "success");
                map.put("message", "suppression bien effectuée");
                return ResponseEntity.status(HttpStatus.OK).body(map);
            } else {
                map.put("status", "introuvable");
                map.put("message", "ce  n'existe pas dans la base de données");
                return ResponseEntity.status(HttpStatus.OK).body(map);
            }
        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("status", "erreur");
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }

    }

    @CrossOrigin
    @GetMapping("/getAll")
    public ResponseEntity<Map<String, Object>> GetAll() {
        map.clear();
        try {
            map.put("status", "success");
            map.put("message", repository.findAll());
            return ResponseEntity.status(HttpStatus.OK).body(map);
        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("status", "erreur");
            map.put("message", new ArrayList<>());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);

        }


    }
}
