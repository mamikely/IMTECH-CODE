package com.example.taggeoMap.Service;



import com.example.taggeoMap.Model.Enum.EnumTypeInscription;
import com.example.taggeoMap.Model.Enum.StatutInscription;
import com.example.taggeoMap.Model.Table.*;
import com.example.taggeoMap.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InscriptionService {
    String[] mois = {
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    };

    @Autowired
    private EleveRepository eleveRepository;
    @Autowired
    private ClasseRepository classeRepository;
    @Autowired
    private AnneeScolaireRepository anneeScolaireRepository;

    @Autowired
    private InscriptionRepository inscriptionRepository;

    private Map<String, Object> map = new HashMap<>();
    private List<Paiement> callBackTransactionMvolaList = new ArrayList<>();

    @Transactional
    public ResponseEntity<Map<String, Object>> inscriptionOrReinscriptionEleve(String matricule_eleve, String classeId, String anneeScolaireId, EnumTypeInscription typeInscription) {
        map.clear();callBackTransactionMvolaList.clear();

        try {
            Eleve eleve = eleveRepository.findByMatricule(matricule_eleve).orElse(null);
            Classe classe = classeRepository.findById(classeId).orElse(null);
            AnneeScolaire anneeScolaire = anneeScolaireRepository.findById(anneeScolaireId).orElse(null);
            if (eleve == null || classe == null || anneeScolaire == null) {
                map.put("status", "introuvable");
                map.put("message", "classe ou eleve ou anneescolaire  n'existe pas dans la base de données");
                return ResponseEntity.status(HttpStatus.OK).body(map);
            } else {
                // Check if already inscribed for this year
                Inscription existingInscriptions = inscriptionRepository.findByEleveAndAnneeScolaire(eleve, anneeScolaire).orElse(null);
                if (existingInscriptions != null) {
                    map.put("status", "exist");
                    map.put("message", "c' est déjà existe dans la base de données");
                    return ResponseEntity.status(HttpStatus.OK).body(map);
                } else {
                    Inscription inscription = new Inscription();
                    inscription.setStatut(StatutInscription.EN_ATTENTE);

                    inscription.setEleve(eleve);
                    inscription.setClasse(classe);
                    inscription.setAnneeScolaire(anneeScolaire);
                    inscription.setType(typeInscription);
                    inscription.setDateAffectation(new Date());



                    inscription= inscriptionRepository.save(inscription);



                    eleve.setStatus("Actif");
                    eleveRepository.save(eleve);
                    map.put("status", "success");
                    map.put("message", eleve);
                    return ResponseEntity.status(HttpStatus.OK).body(map);
                }
            }

        } catch (Exception e) {
            System.out.println(e.fillInStackTrace());
            map.put("status", "erreur");
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }
}
