package com.example.taggeoMap.Service;

import com.example.taggeoMap.Repository.AnneeScolaireRepository;
import com.example.taggeoMap.Repository.ClasseRepository;
import com.example.taggeoMap.Repository.TariffsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TarifisService {
    @Autowired
    private TariffsRepository repository;
    @Autowired
    private AnneeScolaireRepository anneeScolaireRepository;
    @Autowired
    private ClasseRepository classeRepository;

}
