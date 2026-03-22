package com.example.taggeoMap.controller;

import com.example.taggeoMap.Model.Table.Classe;
import com.example.taggeoMap.Repository.ClasseRepository;
import com.example.taggeoMap.Service.ClasseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/classe")
public class ClasseController {
    @Autowired
    private ClasseRepository repository;
    @Autowired
    private ClasseService service;

    private  Map<String ,Object>map=new HashMap<>();

    @CrossOrigin
    @PostMapping("/save")
   public ResponseEntity<Map<String,Object>>Save(@RequestBody Classe classe){

        map.clear();
        try {
            if (!repository.existsByNom(classe.getNom())) {
                classe.setId(null);
                repository.save(classe);
                map.put("status", "success");
                map.put("message", classe);
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
   public ResponseEntity<Map<String,Object>>Upadate(@RequestBody Classe classe){
       map.clear();
       try {
           if (repository.existsById(classe.getId())) {
               repository.save(classe);
               map.put("status", "success");
               map.put("message", classe);
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
   @DeleteMapping("/delete/{classe_id}")
   public ResponseEntity<Map<String,Object>>Delete(@PathVariable String  classe_id){
       map.clear();
       try {
           if (repository.existsById(classe_id)) {
               repository.deleteById(classe_id);
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
   public ResponseEntity<Map<String,Object>>GetAll(){
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


}}
