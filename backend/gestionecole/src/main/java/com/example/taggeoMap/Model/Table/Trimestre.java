package com.example.taggeoMap.Model.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trimestre {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String libelle; // "Premier Trimestre", "Deuxième Trimestre", "Troisième Trimestre"

    private LocalDate dateDebut;
    private LocalDate dateFin;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private AnneeScolaire anneeScolaire;
    
    @OneToMany(mappedBy = "trimestre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Examen> examens = new ArrayList<>();

}
