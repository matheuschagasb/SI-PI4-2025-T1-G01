package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.model.Musico;
import com.servidor.spring.servidor_spring.service.MusicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/musico")
public class MusicoController {
    @Autowired
    private MusicoService musicoService;

    @GetMapping
    public List<Musico> getAllMusciso(@RequestParam(name = "genero", required = false) String generoMusical) {
        return musicoService.getAllMusicos(generoMusical);
    }

    @PostMapping
    public Musico createMusico(@RequestBody Musico musico) {
        return musicoService.createMusico(musico);
    }
}