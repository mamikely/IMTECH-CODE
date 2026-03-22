package com.example.taggeoMap.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/check")
public class TestController {
    @GetMapping
    public String hello() {
        return "API V1.0 is runing...";
    }
}