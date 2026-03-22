package com.example.taggeoMap.Model.Table;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.security.PrivateKey;
import java.util.Collection;

@Entity
@Data
@NoArgsConstructor @AllArgsConstructor
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String nom;
    private String niveau;
    @OneToMany(mappedBy = "classe",fetch = FetchType.LAZY)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection <Inscription> inscriptions;
    @OneToMany(mappedBy = "classe",fetch = FetchType.LAZY ,cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Tarifs>tarifs;
    @OneToMany(mappedBy = "classe",fetch = FetchType.LAZY ,cascade = CascadeType.ALL)
    private Collection<Matiere>matieres;
}
