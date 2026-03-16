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
public class Examen {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(nullable = false)
    private String libelle; // "Devoir 1", "Devoir 2", "Composition 1", etc.
    
    private LocalDate dateDebut;
    
    private LocalDate dateFin;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Trimestre trimestre;
    
    @OneToMany(mappedBy = "examen", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Note> notes = new ArrayList<>();
    

}
