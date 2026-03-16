package com.example.taggeoMap.Model.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Note {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Eleve eleve;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Matiere matiere;
    
    @ManyToOne(fetch = FetchType.LAZY)
    private Examen examen;
    
    @Column(nullable = false)
    private double valeur; // La note sur 20
    
    private String appreciation;

}
