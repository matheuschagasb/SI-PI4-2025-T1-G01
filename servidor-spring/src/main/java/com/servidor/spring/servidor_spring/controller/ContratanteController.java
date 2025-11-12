package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.model.Contratante;
import com.servidor.spring.servidor_spring.service.ContratanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

}
