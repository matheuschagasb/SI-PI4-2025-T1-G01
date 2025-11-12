package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.model.Test;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hello-world")
public class TestController {

    @GetMapping
    public String helloWorld() {
        return "Hello World";
    }

    @PostMapping("/{id}")
    public String helloWorldPost(@RequestBody Test body, @RequestParam(value = "filter") String filter, @PathVariable("id") String id) {
        return "Hello World Post " + filter;
    }
}
