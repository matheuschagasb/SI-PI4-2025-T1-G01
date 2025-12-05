//Guilherme Padilha - 24005138
package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.model.Contratante;
import com.servidor.spring.servidor_spring.service.ContratanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.servidor.spring.servidor_spring.dto.ContratanteUpdate;

// Controller responsável por gerenciar endpoints de contratante
@RestController
@RequestMapping("/v1/contratante")
public class ContratanteController {

    @Autowired
    private ContratanteService contratanteService;

    // Retorna todos os contratantes
    @GetMapping
    public List<Contratante> getAllContratante() {
        return contratanteService.getAllContratante();
    }

    // Cria um novo contratante
    @PostMapping
    public Contratante createContratante(@RequestBody Contratante contratante) {
        return contratanteService.createContratante(contratante);
    }

    // Retorna dados do usuário autenticado usando token JWT
    @GetMapping("/me")
    public Contratante getUsuarioLogado(Authentication auth) {
        String email = auth.getName();
        return contratanteService.findByEmail(email);
    }

    // Atualiza contratante por ID
    @PutMapping("/{id}")
    public Contratante updateContratante(@PathVariable String id, @RequestBody ContratanteUpdate dados) {
        return contratanteService.updateContratante(id, dados);
    }
}