// Thiago Mauri - 24015357

package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.dto.MusicoDTO;
import com.servidor.spring.servidor_spring.dto.MusicoUpdate;
import com.servidor.spring.servidor_spring.model.Musico;
import com.servidor.spring.servidor_spring.service.MusicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.servidor.spring.servidor_spring.dto.ChavePixDTO;


import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/v1/musico")
public class MusicoController {
    @Autowired
    private MusicoService musicoService;

    @GetMapping
    public List<MusicoDTO> getAllMusicos(@RequestParam(name = "genero", required = false) String generoMusical) {
        return musicoService.getAllMusicos(generoMusical).stream().map(MusicoDTO::new).collect(Collectors.toList());
    }

    // Retorna músico por ID
    @GetMapping("/{id}")
    public ResponseEntity<MusicoDTO> getMusicoById(@PathVariable String id) {
        Optional<Musico> musico = musicoService.getMusicoById(id);

        if (musico.isPresent()) {
            return ResponseEntity.ok(new MusicoDTO(musico.get()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Retorna chave PIX do músico autenticado
    @GetMapping("/{id}/pix")
    public ResponseEntity<ChavePixDTO> getChavePix(@PathVariable String id, Authentication auth) {
        String email = auth.getName();
        ChavePixDTO chavePixDTO = musicoService.getChavePix(id, email);
        return ResponseEntity.ok(chavePixDTO);
    }

    @PostMapping
    public Musico createMusico(@RequestBody Musico musico) {
        return musicoService.createMusico(musico);
    }

    @PutMapping("/{id}")
    public Musico updateMusico(@PathVariable String id, @RequestBody MusicoUpdate dados) {
        return musicoService.updateMusico(id, dados);
    }

    // Retorna dados do usuário autenticado usando token JWT
    @GetMapping("/me")
    public MusicoDTO getUsuarioLogado(Authentication auth) {
        String email = auth.getName();
        return new MusicoDTO(musicoService.findByEmail(email));
    }
}