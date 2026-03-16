package com.example.taggeoMap.Repository;



import com.example.taggeoMap.Model.Table.Tenants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantsRepository extends JpaRepository<Tenants, String> {
    boolean existsByNom(String name);
    Optional<Tenants>findByTenantId(String tenandId);
}
