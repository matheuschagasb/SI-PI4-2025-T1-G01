package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.dto.ContratoRequestDTO;
import com.servidor.spring.servidor_spring.dto.ContratoResponseDTO;
import com.servidor.spring.servidor_spring.exception.ForbiddenException;
import com.servidor.spring.servidor_spring.model.Contrato;
import com.servidor.spring.servidor_spring.model.Musico;
import com.servidor.spring.servidor_spring.service.ContratoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

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

    @PostMapping("/{id}/confirmar-pagamento")
    public ResponseEntity<ContratoResponseDTO> confirmarPagamento(@PathVariable String id, Authentication authentication) {
        String emailContratante = authentication.getName();
        Contrato contratoAtualizado = contratoService.confirmarPagamento(id, emailContratante);
        return ResponseEntity.ok(new ContratoResponseDTO(contratoAtualizado));
    }

    @GetMapping
    public ResponseEntity<List<ContratoResponseDTO>> getContratos(
            @RequestParam String musicoId,
            Authentication authentication) {

        Object principal = authentication.getPrincipal();
        if (principal instanceof Musico) {
            Musico authenticatedMusico = (Musico) principal;
            if (!authenticatedMusico.getId().equals(musicoId)) {
                throw new ForbiddenException("Você não tem permissão para acessar os contratos de outro músico.");
            }
        } else {
             throw new ForbiddenException("Acesso negado. Apenas músicos podem visualizar seus contratos.");
        }

        List<Contrato> contratos = contratoService.getContratosByMusicoId(musicoId);
        List<ContratoResponseDTO> responseDTOs = contratos.stream()
                .map(ContratoResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }
}
