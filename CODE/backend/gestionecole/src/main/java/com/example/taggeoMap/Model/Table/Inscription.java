package com.example.taggeoMap.Model.Table;


import com.example.taggeoMap.Model.Enum.EnumTypeInscription;
import com.example.taggeoMap.Model.Enum.StatutInscription;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;
import java.util.Date;
@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Inscription {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne
    private Eleve eleve;
    @ManyToOne
    private Classe classe;
    @ManyToOne
    private AnneeScolaire anneeScolaire;
    @Enumerated(EnumType.STRING)
    private StatutInscription statut;

    private EnumTypeInscription type;
    private Date dateAffectation;
    @OneToMany(mappedBy = "inscription",fetch = FetchType.LAZY)
    private Collection<Paiement>paiements;
}
