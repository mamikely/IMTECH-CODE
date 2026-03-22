package com.example.taggeoMap.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MatiereNotFoundException extends RuntimeException {
    public MatiereNotFoundException(String message) {
        super(message);
    }
}
