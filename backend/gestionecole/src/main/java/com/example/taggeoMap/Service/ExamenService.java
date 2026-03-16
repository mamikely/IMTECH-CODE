package com.example.taggeoMap.Service;

import com.example.taggeoMap.Model.Table.Examen;
import com.example.taggeoMap.Repository.ExamenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExamenService {

    @Autowired
    private ExamenRepository examenRepository;

    public List<Examen> getAllExamens() {
        return examenRepository.findAll();
    }

    public Optional<Examen> getExamenById(String id) {
        return examenRepository.findById(id);
    }

    public List<Examen> getExamensByClasseId(String classeId) {
        return examenRepository.findExamensByClasseId(classeId);
    }

    public Examen createExamen(Examen examen) {
        return examenRepository.save(examen);
    }

    public Examen updateExamen(String id, Examen examenDetails) {
        Examen examen = examenRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Examen not found with id: " + id));

        examen.setLibelle(examenDetails.getLibelle());
        examen.setDateDebut(examenDetails.getDateDebut());
        examen.setDateFin(examenDetails.getDateFin());


        return examenRepository.save(examen);
    }

    public void deleteExamen(String id) {
        Examen examen = examenRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Examen not found with id: " + id));
        
        examenRepository.delete(examen);
    }
}
