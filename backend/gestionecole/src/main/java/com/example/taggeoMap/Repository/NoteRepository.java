package com.example.taggeoMap.Repository;

import com.example.taggeoMap.Model.Table.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, String> {
    List<Note> findByEleveId(String eleveId);
    List<Note> findByMatiereId(String matiereId);
}
