package com.example.taggeoMap.controller;

import com.example.taggeoMap.Model.Table.Paiement;
import com.example.taggeoMap.Repository.PaiementRepository;
import com.example.taggeoMap.Service.PaiementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/paiements")
@CrossOrigin("*")
public class PaiemnentController {private Map<String,Object>
map=new HashMap<>();
    @Autowired
    private PaiementRepository repository;
    @Autowired
    private PaiementService paiementService;
    @PostMapping("/save/{matricule}/{id_annescolaire}")
    @CrossOrigin
    public ResponseEntity<Map<String,Object>>save(@RequestBody Paiement paiement, @PathVariable String matricule,@PathVariable String id_annescolaire){
        map.clear();
        try {
            paiement.setId(null);
            paiementService.save(paiement,matricule,id_annescolaire);
            map.put("message","ok");
            return  ResponseEntity.ok(map);

        }catch (Exception e){
            e.fillInStackTrace();
            map.put("message","ko"+e.getMessage());
            return  ResponseEntity.badRequest().body(map);

        }

    }
    @GetMapping
    @CrossOrigin
    public List<Paiement>getAll(){
        return  repository.findAll();
    }
}
