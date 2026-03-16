package com.example.taggeoMap.Model.Table;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;


@Entity
@Data @NoArgsConstructor @AllArgsConstructor
public class Eleve {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String numero;

    @Column(unique = true)
    private String matricule;
    
    @Column(unique = true)
    private String codeunique;

    private String numeroEconomat;

    @Column(nullable = false)
    private String nom;

    private String urlPhoto;

    @Column(nullable = false)
    private String prenom;

    @Temporal(TemporalType.DATE)
    private Date dateNaissance;

    private String lieuNaissance;
    private String eglise;
    private String adresse;
    private String pere;
    private String professionPere;
    private String lieuTravailPere;
    private String telPere;
    private String mere;
    private String professionMere;
    private String lieuTravailMere;
    private String telMere;
    private String adresseParent;
    private String telephoneParent;
    private String nomTutaire;
    private String adresseTutaire;
    private String telTutaire;
    private String statusParent;
    private String enfantHabitA;
    private String sinonEnfantHabitA;
    private String chargeEtude;
    private String raison;
    private String finonaPere;
    private String finonaMere;
    private String finonaZaza;

    @Temporal(TemporalType.DATE)
    private Date dateBapteme;

    private String lieuBapteme;
    private String egliseParent;
    private String eglise1;
    private String faritra;
    private String apv;
    private String devoirePere;
    private String devoireMere;
    private String fikambananaPere;
    private String fikambananaMere;
    private String oldEcole;
    private int raintampo;
    private int raintampoLahy;
    private int raintampoVavy;
    private int raintampoFaha;
    private String raintampoEcole;
    private String raisonHampidirana;
    private String quiPremierResponsable;
    private String comportementEnfant;
    private String vononaVe;
    private String status;

    @OneToMany(mappedBy = "eleve", cascade = CascadeType.ALL, orphanRemoval = true)

    private List<Note> notes = new ArrayList<>();
    @OneToMany(mappedBy = "eleve",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Inscription>inscriptions;



}
