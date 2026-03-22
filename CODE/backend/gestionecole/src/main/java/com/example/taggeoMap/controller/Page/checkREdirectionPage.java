package com.example.taggeoMap.controller.Page;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class checkREdirectionPage {
    private Map<String,Object>map=new HashMap<>();
    @GetMapping("/check/rootpage")
    public ResponseEntity<Map<String,Object>> rootpage(){
        map.clear();
        try {
            map.put("status","ok");

        }catch (Exception e){
            map.put("status","ko");
        }
        return  ResponseEntity.ok(map);
    }
}
