package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.dto.ContratoRequestDTO;
import com.servidor.spring.servidor_spring.dto.ContratoResponseDTO;
import com.servidor.spring.servidor_spring.model.Contrato;
import com.servidor.spring.servidor_spring.service.ContratoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/v1/contratos")
public class ContratoController {

    @Autowired
    private ContratoService contratoService;

    @PostMapping
    public ResponseEntity<ContratoResponseDTO> createContrato(@RequestBody ContratoRequestDTO dados,
                                                              Authentication authentication,
                                                              UriComponentsBuilder uriBuilder) {
        String emailContratante = authentication.getName();
        Contrato novoContrato = contratoService.createContrato(dados, emailContratante);
        ContratoResponseDTO responseDTO = new ContratoResponseDTO(novoContrato);

        URI uri = uriBuilder.path("/v1/contratos/{id}").buildAndExpand(novoContrato.getId()).toUri();

        return ResponseEntity.created(uri).body(responseDTO);
    }
}
