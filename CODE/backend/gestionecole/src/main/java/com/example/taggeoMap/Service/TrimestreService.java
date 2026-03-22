package com.example.taggeoMap.Service;

import com.example.taggeoMap.Model.Table.Trimestre;
import com.example.taggeoMap.Repository.TrimestreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrimestreService {

    @Autowired
    private TrimestreRepository trimestreRepository;

    public List<Trimestre> getAllTrimestres() {
        return trimestreRepository.findAll();
    }

    public Optional<Trimestre> getTrimestreById(String id) {
        return trimestreRepository.findById(id);
    }

    public List<Trimestre> getTrimestresByAnneeScolaireId(String anneeScolaireId) {
        return trimestreRepository.findByAnneeScolaireId(anneeScolaireId);
    }

    public Trimestre createTrimestre(Trimestre trimestre) {
        return trimestreRepository.save(trimestre);
    }

    public Trimestre updateTrimestre(String id, Trimestre trimestreDetails) {
        Trimestre trimestre = trimestreRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Trimestre not found with id: " + id));
        
        trimestre.setLibelle(trimestreDetails.getLibelle());
        trimestre.setDateDebut(trimestreDetails.getDateDebut());
        trimestre.setDateFin(trimestreDetails.getDateFin());
        trimestre.setAnneeScolaire(trimestreDetails.getAnneeScolaire());
        
        return trimestreRepository.save(trimestre);
    }

    public void deleteTrimestre(String id) {
        Trimestre trimestre = trimestreRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Trimestre not found with id: " + id));
        
        trimestreRepository.delete(trimestre);
    }
}
