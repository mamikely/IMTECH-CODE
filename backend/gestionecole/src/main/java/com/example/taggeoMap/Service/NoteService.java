package com.example.taggeoMap.Service;

import com.example.taggeoMap.Model.Table.Note;
import com.example.taggeoMap.Repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<Note> getNoteById(String id) {
        return noteRepository.findById(id);
    }

    public List<Note> getNotesByEleveId(String eleveId) {
        return noteRepository.findByEleveId(eleveId);
    }

    public List<Note> getNotesByMatiereId(String matiereId) {
        return noteRepository.findByMatiereId(matiereId);
    }

    public Note createNote(Note note) {
        return noteRepository.save(note);
    }

    public Note updateNote(String id, Note noteDetails) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        
        note.setValeur(noteDetails.getValeur());

        note.setAppreciation(noteDetails.getAppreciation());
        note.setEleve(noteDetails.getEleve());
        note.setMatiere(noteDetails.getMatiere());
        note.setExamen(noteDetails.getExamen());
        
        return noteRepository.save(note);
    }

    public void deleteNote(String id) {
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        
        noteRepository.delete(note);
    }
}
