package com.example.taggeoMap.controller;


import com.example.taggeoMap.Model.Table.AnneeScolaire;
import com.example.taggeoMap.Model.Table.Classe;
import com.example.taggeoMap.Model.Table.Tarifs;
import com.example.taggeoMap.Repository.AnneeScolaireRepository;
import com.example.taggeoMap.Repository.ClasseRepository;
import com.example.taggeoMap.Repository.TariffsRepository;
import com.example.taggeoMap.Service.TarifisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tarifs")
public class TarifsController {
    @Autowired
    private TariffsRepository repository;

    @Autowired
    private ClasseRepository classeRepository;
    @Autowired
    private AnneeScolaireRepository anneeScolaireRepository;
    @Autowired
    private TarifisService tarifisService;
    private Map<String, Object> map = new HashMap<>();

    @CrossOrigin
    @PostMapping("/save/{idClasse}/{idAnnescoalire}")
    public ResponseEntity<Map<String, Object>> Save(@RequestBody Tarifs tarifs, @PathVariable String idClasse, @PathVariable String idAnnescoalire) {

        map.clear();
        try {
            Classe classe = classeRepository.findById(idClasse).orElse(null);
            AnneeScolaire anneeScolaire = anneeScolaireRepository.findById(idAnnescoalire).orElse(null);
            if (classe != null && anneeScolaire != null) {
                if (repository.existsByTypeAndAndAnneeScolaireAndClasse(tarifs.getType(), anneeScolaire,classe)) {
                    map.put("status", "exist");
                    map.put("message", "c' est déjà existe dans la base de données");
                    return ResponseEntity.status(HttpStatus.FOUND).body(map);
                } else {
                    tarifs.setClasse(classe);
                    tarifs.setAnneeScolaire(anneeScolaire);
                    repository.save(tarifs);
                    map.put("status", "success");
                    map.put("message", tarifs);
                    return ResponseEntity.status(HttpStatus.OK).body(map);
                }
            } else {
                map.put("status", "introuvable");
                map.put("message", "classe ou annescolaire  n'existe pas dans la base de données");
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
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> Upadate(@RequestBody Tarifs tarifs) {
        map.clear();
        try {
            if (repository.existsById(tarifs.getId())) {
                repository.save(tarifs);
                map.put("status", "success");
                map.put("message", tarifs);
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
    @DeleteMapping("/delete/{tarifs_id}")
    public ResponseEntity<Map<String, Object>> Delete(@PathVariable String tarifs_id) {
        map.clear();
        try {
            if (repository.existsById(tarifs_id)) {
                repository.deleteById(tarifs_id);
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
