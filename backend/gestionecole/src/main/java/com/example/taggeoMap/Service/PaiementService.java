package com.example.taggeoMap.Service;


import com.example.taggeoMap.Model.Enum.StatutInscription;
import com.example.taggeoMap.Model.Table.AnneeScolaire;
import com.example.taggeoMap.Model.Table.Eleve;
import com.example.taggeoMap.Model.Table.Inscription;
import com.example.taggeoMap.Model.Table.Paiement;
import com.example.taggeoMap.Repository.AnneeScolaireRepository;
import com.example.taggeoMap.Repository.EleveRepository;
import com.example.taggeoMap.Repository.InscriptionRepository;
import com.example.taggeoMap.Repository.PaiementRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;

@Service
@Transactional
public class PaiementService {
    @Autowired
    private PaiementRepository repository;
    private EleveRepository eleveRepository;
    private InscriptionRepository inscriptionRepository;
    private AnneeScolaireRepository anneeScolaireRepository;

    public void save(Paiement paiement, String matricule, String annee_scolaire_id){
        try {
            Eleve eleve=eleveRepository.findByMatricule(matricule).orElse(null);
            AnneeScolaire anneeScolaire=anneeScolaireRepository.findById(annee_scolaire_id).orElse(null);
            if (eleve!=null && anneeScolaire!=null){
                Inscription inscription=inscriptionRepository.findByEleveAndAnneeScolaire(eleve,anneeScolaire).orElse(null);
                if (inscription!=null){
                    inscription.setStatut(StatutInscription.VALIDEE);
                    inscriptionRepository.save(inscription);
                    paiement.setInscription(inscription);
                    paiement.setDatePaiement(LocalDate.now());
                    repository.save(paiement);
                }
            }
        }catch (Exception  e){
            e.fillInStackTrace();
        }


    }
}
