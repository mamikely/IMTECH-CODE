package com.example.taggeoMap.Repository;

import com.example.taggeoMap.Model.Table.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatiereRepository extends JpaRepository<Matiere, String> {

}
