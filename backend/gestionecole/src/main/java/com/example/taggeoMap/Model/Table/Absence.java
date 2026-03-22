package com.example.taggeoMap.Model.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
public class Absence {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false)
    @JsonBackReference
    private Eleve eleve;

    @ManyToOne(fetch = FetchType.LAZY)
    private Matiere matiere;

    @Column(nullable = false)
    private LocalDate date;

    private LocalTime heureDebut;
    
    private LocalTime heureFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeAbsence type;

    private boolean justifiee;
    
    private String motif;

    public enum TypeAbsence {
        ABSENCE,
        RETARD
    }

    // Constructeur pour une absence
    public Absence(Eleve eleve, Matiere matiere, LocalDate date, boolean justifiee, String motif) {
        this.eleve = eleve;
        this.matiere = matiere;
        this.date = date;
        this.type = TypeAbsence.ABSENCE;
        this.justifiee = justifiee;
        this.motif = motif;
    }

    // Constructeur pour un retard
    public Absence(Eleve eleve, Matiere matiere, LocalDate date, LocalTime heureDebut, LocalTime heureFin, boolean justifiee, String motif) {
        this.eleve = eleve;
        this.matiere = matiere;
        this.date = date;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.type = TypeAbsence.RETARD;
        this.justifiee = justifiee;
        this.motif = motif;
    }
}
