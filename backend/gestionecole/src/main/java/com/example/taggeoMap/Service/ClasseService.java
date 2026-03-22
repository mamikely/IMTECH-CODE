package com.example.taggeoMap.Service;

import com.example.taggeoMap.Model.Table.Classe;
import com.example.taggeoMap.Repository.ClasseRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ClasseService {
    @Autowired
    private ClasseRepository classeRepository;

    public void save(Classe classe){
        classeRepository.save(classe);
    }

}
