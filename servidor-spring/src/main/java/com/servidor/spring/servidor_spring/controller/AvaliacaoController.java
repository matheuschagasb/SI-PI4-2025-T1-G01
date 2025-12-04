package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.dto.AvaliacaoRequestDTO;
import com.servidor.spring.servidor_spring.dto.AvaliacaoResponseDTO;
import com.servidor.spring.servidor_spring.model.Avaliacao;
import com.servidor.spring.servidor_spring.service.AvaliacaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/avaliacoes")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService avaliacaoService;

    @PostMapping
    public ResponseEntity<AvaliacaoResponseDTO> criarAvaliacao(@RequestBody AvaliacaoRequestDTO dados, Authentication auth) {
        String email = auth.getName(); // Pega o email do token JWT
        Avaliacao avaliacao = avaliacaoService.avaliarMusico(dados, email);
        return ResponseEntity.ok(new AvaliacaoResponseDTO(avaliacao));
    }
    @GetMapping("/musico/{musicoId}")
    public ResponseEntity<List<AvaliacaoResponseDTO>> listarPorMusico(@PathVariable String musicoId) {
        List<AvaliacaoResponseDTO> avaliacoes = avaliacaoService.listarAvaliacoesPorMusico(musicoId);
        return ResponseEntity.ok(avaliacoes);
    }
}