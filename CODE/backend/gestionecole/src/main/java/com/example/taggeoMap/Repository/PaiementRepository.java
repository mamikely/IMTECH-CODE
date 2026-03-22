package com.example.taggeoMap.Repository;


import com.example.taggeoMap.Model.Table.Paiement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaiementRepository extends JpaRepository<Paiement,String> {
}
