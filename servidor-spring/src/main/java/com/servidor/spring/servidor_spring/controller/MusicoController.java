package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.model.Musico;
import com.servidor.spring.servidor_spring.service.MusicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/v1/musico")
public class MusicoController {
    @Autowired
    private MusicoService musicoService;

    @GetMapping
    public List<Musico> getAllMusicos(@RequestParam(name = "genero", required = false) String generoMusical) {
        return musicoService.getAllMusicos(generoMusical);
    }

    // Novo endpoint adicionado
    @GetMapping("/{id}")
    public ResponseEntity<Musico> getMusicoById(@PathVariable String id) {
        Optional<Musico> musico = musicoService.getMusicoById(id);

        if (musico.isPresent()) {
            return ResponseEntity.ok(musico.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Musico createMusico(@RequestBody Musico musico) {
        return musicoService.createMusico(musico);
    }
}