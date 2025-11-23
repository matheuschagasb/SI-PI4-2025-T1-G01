package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.model.Contratante;
import com.servidor.spring.servidor_spring.service.ContratanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.servidor.spring.servidor_spring.dto.ContratanteUpdate;

@RestController
@RequestMapping("/v1/contratante")
public class ContratanteController {

    @Autowired
    private ContratanteService contratanteService;

    @GetMapping
    public List<Contratante> getAllContratante() {
        return contratanteService.getAllContratante();
    }

    @PostMapping
    public Contratante createContratante(@RequestBody Contratante contratante) {
        return contratanteService.createContratante(contratante);
    }

    @GetMapping("/me")
    public Contratante getUsuarioLogado(Authentication auth) {
        String email = auth.getName(); // pega o email do token JWT
        return contratanteService.findByEmail(email);
    }

    @PutMapping("/{id}")
    public Contratante updateContratante(@PathVariable String id, @RequestBody ContratanteUpdate dados) {
        return contratanteService.updateContratante(id, dados);
    }


}
