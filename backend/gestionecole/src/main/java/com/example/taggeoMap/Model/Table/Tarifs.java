package com.example.taggeoMap.Model.Table;


import com.example.taggeoMap.Model.Enum.EnumTypeTarif;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Tarifs {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private  String id ;
    private EnumTypeTarif type;
    private Double montant;
    @ManyToOne
    private AnneeScolaire anneeScolaire;
    @ManyToOne
    private Classe classe;
}
