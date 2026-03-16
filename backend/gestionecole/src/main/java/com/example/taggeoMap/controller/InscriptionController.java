package com.example.taggeoMap.controller;


import com.example.taggeoMap.Model.Enum.EnumTypeInscription;
import com.example.taggeoMap.Model.Table.Inscription;
import com.example.taggeoMap.Repository.InscriptionRepository;
import com.example.taggeoMap.Service.InscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("*")

@RequestMapping("/api/inscriptions")
public class InscriptionController {
    @Autowired
    private InscriptionRepository repository;
    @Autowired
    private InscriptionService service;

    @CrossOrigin("*")
    @PostMapping("/save/{matricule_eleve}/{id_classe}/{id_annescolaire}/{type}")
    public ResponseEntity<Map<String, Object>> Inscription(@PathVariable String matricule_eleve, @PathVariable String id_classe, @PathVariable String id_annescolaire, @PathVariable EnumTypeInscription type) {
        return service.inscriptionOrReinscriptionEleve(matricule_eleve, id_classe, id_annescolaire, type);


    }

    @CrossOrigin
    @PutMapping("/update")
    public ResponseEntity<Map<String, Object>> Reinscription(@RequestBody Inscription inscription) {
        return SaveOrUpdate(inscription);
    }

    @CrossOrigin
    @GetMapping("/getAll")
    public ResponseEntity<Map<String, Object>> getAll() {
        Map<String, Object> map = new HashMap<>();
        try {
            map.put("resultat", repository.findAll());
        } catch (Exception e) {
            map.put("resultat", new ArrayList<>());
            System.out.println(e.fillInStackTrace());
        }
        return ResponseEntity.ok(map);
    }

    @CrossOrigin
    @DeleteMapping ("/delete/{inscription_id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String inscription_id) {
        Map<String, Object> map = new HashMap<>();
        try {
            map.put("resultat", repository.findAll());
        } catch (Exception e) {
            map.put("resultat", new ArrayList<>());
            System.out.println(e.fillInStackTrace());
        }
        return ResponseEntity.ok(map);
    }

    private ResponseEntity<Map<String, Object>> SaveOrUpdate(Inscription inscription) {
        Map<String, Object> map = new HashMap<>();
        try {
            repository.save(inscription);
            map.put("resultat", "ok");
        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("resultat", "ko");
        }
        return ResponseEntity.ok(map);
    }
}
