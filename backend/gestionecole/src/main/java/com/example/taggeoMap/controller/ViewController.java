package com.example.taggeoMap.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {
    
    @GetMapping("/login")
    public String showLoginPage() {
        return "auth/login";
    }
    
    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/login";
    }
}
