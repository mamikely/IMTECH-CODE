package com.example.taggeoMap.Model.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class AnneeScolaire {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private  String id;
    private String anneeScolaire;

    @OneToMany(mappedBy = "anneeScolaire",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Inscription>inscriptions;

    @OneToMany(mappedBy = "anneeScolaire",fetch = FetchType.LAZY ,cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Tarifs>tarifs;

    @OneToMany(mappedBy = "anneeScolaire", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Trimestre> trimestres = new ArrayList<>();
}
