package com.example.taggeoMap.Model.Table;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;

@Entity
@Data
@NoArgsConstructor @AllArgsConstructor
@ToString
public class Tenants {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;


    private String tenantId;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String url_db;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String username_db;
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password_db;

    private String nom;
    private String adresse;
    private String telephone;
    private String logo;
    private String slogan;
    private  String email;
    private String status;
    private  String couleurHeader;
    private  String couleurFooter;
    private  String couleurBody;

    @OneToMany(mappedBy = "tenants",fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Collection<Utilisateur> uilUtilisateurs;




}
