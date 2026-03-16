package com.example.taggeoMap.controller;

import com.example.taggeoMap.Model.Table.Eleve;
import com.example.taggeoMap.Model.Table.Inscription;
import com.example.taggeoMap.Model.Table.Tarifs;

import com.example.taggeoMap.Repository.EleveRepository;
import com.example.taggeoMap.Repository.InscriptionRepository;
import com.example.taggeoMap.Repository.TariffsRepository;
import com.example.taggeoMap.Service.EleveService;
import com.example.taggeoMap.Utils.Utilis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eleve")
public class EleveController {
    @Autowired
    private EleveRepository repository;

    @Autowired
    private EleveService service;
    @Autowired
    private InscriptionRepository inscriptionRepository;
    @Autowired
    private TariffsRepository tariffsRepository;
    private Map<String, Object> map = new HashMap<>();

    @CrossOrigin
    @PostMapping("/save")
    public ResponseEntity<Map<String, Object>> Save(@RequestBody Eleve eleve) {
        map.clear();
        System.out.println("Eleve to string="+eleve.toString());
        System.out.println("eleve.getid="+eleve.getId());

        try {
            if (!repository.existsByMatricule(eleve.getMatricule())) {
                eleve.setStatus("Inactif");
                Long count=repository.count()+1;
                String annee = String.valueOf(Year.now().getValue());
                eleve.setId(null);

                String numero = "N-" + annee + "-" + String.format("%07d", count);
                String economat = "E-" + annee + "-" + String.format("%07d", count);
                eleve.setNumero(numero);
                eleve.setNumeroEconomat(economat);
                repository.save(eleve);
                map.put("status", "success");
                map.put("message", eleve);
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
    public ResponseEntity<Map<String, Object>> Upadate(@RequestBody Eleve eleve) {
        map.clear();
        try {
            if (repository.existsById(eleve.getId())) {
                repository.save(eleve);
                map.put("status", "success");
                map.put("message", eleve);
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
    @PutMapping("/update/status/{id_eleve}")
    public ResponseEntity<Map<String, Object>> UpadateStatus(@PathVariable String id_eleve) {
        map.clear();
        try {
            if (repository.existsById(id_eleve)) {
                Eleve e = repository.findById(id_eleve).orElse(null);
                e.setStatus("Actif");
                repository.save(e);
                map.put("status", "success");
                map.put("message", e);
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
    @DeleteMapping("/delete/{eleve_id}")
    public ResponseEntity<Map<String, Object>> Delete(@PathVariable String eleve_id) {
        map.clear();
        try {
            if (repository.existsById(eleve_id)) {
                repository.deleteById(eleve_id);
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

    @CrossOrigin
    @GetMapping("/getByMatricule/{eleve_matricule}")
    public ResponseEntity<Map<String, Object>> findByMatricule(@PathVariable String eleve_matricule) {
        Map<String, Object> map = new HashMap<>();
        try {
            map.put("message", repository.findByMatricule(eleve_matricule).orElse(null));
            map.put("status", "success");
        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("message", e.getMessage());
            map.put("status", "erreur");
        }
        return ResponseEntity.ok(map);
    }

    @CrossOrigin
    @GetMapping("/getBycodeUnique/{code_unique}")
    public ResponseEntity<Map<String, Object>> findByCodeUnique(@PathVariable String code_unique) {
        Map<String, Object> map = new HashMap<>();
        try {
            map.put("status", "success");
            map.put("message", repository.findByCodeunique(code_unique).orElse(null));
        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("message", e.getMessage());
            map.put("status", "erreur");
        }
        return ResponseEntity.ok(map);
    }


}
