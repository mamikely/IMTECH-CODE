package com.example.taggeoMap.controller.Page;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/view")
public class routerPage {
    @GetMapping("/")
    public ModelAndView indexPage(){
        return  new ModelAndView("pages/auth");
    }
    @GetMapping("/admin.html")
    public ModelAndView authPage(){
        return  new ModelAndView("pages/admin");
    }
    @GetMapping("/acceuil.html")
    public ModelAndView acceuilPage(){
        return  new ModelAndView("pages/acceuil");
    }
    @GetMapping("/tenants.html")
    public ModelAndView tenantsPage(){
        return  new ModelAndView("pages/tenants");
    }
}
