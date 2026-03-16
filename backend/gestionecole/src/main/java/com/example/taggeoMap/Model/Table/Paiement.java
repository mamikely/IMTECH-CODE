package com.example.taggeoMap.Model.Table;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;


    private Long amount;

    private LocalDate datePaiement;
    private String mois;
    private String type;
    @ManyToOne
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Inscription inscription;
}
