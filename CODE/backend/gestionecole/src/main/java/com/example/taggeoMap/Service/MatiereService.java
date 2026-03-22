package com.example.taggeoMap.Service;

import com.example.taggeoMap.Exception.MatiereNotFoundException;
import com.example.taggeoMap.Model.Table.Matiere;
import com.example.taggeoMap.Repository.MatiereRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MatiereService {

    private final MatiereRepository matiereRepository;

    @Autowired
    public MatiereService(MatiereRepository matiereRepository) {
        this.matiereRepository = matiereRepository;
    }

    /**
     * Récupère toutes les matières
     * @return Liste de toutes les matières
     */
    public List<Matiere> getAllMatieres() {
        return matiereRepository.findAll();
    }

    /**
     * Récupère une matière par son ID
     * @param id ID de la matière
     * @return La matière correspondante
     * @throws MatiereNotFoundException Si la matière n'est pas trouvée
     */
    public Matiere getMatiereById(String id) {
        return matiereRepository.findById(id)
                .orElseThrow(() -> new MatiereNotFoundException("Matière non trouvée avec l'ID : " + id));
    }



    /**
     * Crée une nouvelle matière
     * @param matiere La matière à créer
     * @return La matière créée
     */
    public Matiere createMatiere(Matiere matiere) {

        return matiereRepository.save(matiere);
    }

    /**
     * Met à jour une matière existante
     * @param id ID de la matière à mettre à jour
     * @param matiereDetails Détails de la matière à mettre à jour
     * @return La matière mise à jour
     */
    public Matiere updateMatiere(String id, Matiere matiereDetails) {
        matiereDetails.setId(id);
        

        return matiereRepository.save(matiereDetails);
    }

    /**
     * Supprime une matière par son ID
     * @param id ID de la matière à supprimer
     */
    public void deleteMatiere(String id) {
        Matiere matiere = getMatiereById(id);
        matiereRepository.delete(matiere);
    }

    /**
     * Vérifie si une matière existe par son ID
     * @param id ID de la matière
     * @return true si la matière existe, false sinon
     */
    public boolean existsById(String id) {
        return matiereRepository.existsById(id);
    }

    /**
     * Récupère toutes les matières d'une classe spécifique
     * @param classeId ID de la classe
     * @return Liste des matières de la classe
     */

}
