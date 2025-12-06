package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.dto.BloqueioDTO;
import com.servidor.spring.servidor_spring.service.AgendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/v1/agenda")
public class AgendaController {

    @Autowired
    private AgendaService agendaService;

    // Músico bloqueia uma data (Ex: clica no calendário)
    @PostMapping("/bloquear")
    public ResponseEntity<Void> bloquearData(@RequestBody BloqueioDTO dto, Authentication auth) {
        agendaService.bloquearData(auth.getName(), dto.data());
        return ResponseEntity.ok().build();
    }

    // Músico desbloqueia uma data
    @DeleteMapping("/desbloquear/{data}")
    public ResponseEntity<Void> desbloquearData(@PathVariable LocalDate data, Authentication auth) {
        agendaService.desbloquearData(auth.getName(), data);
        return ResponseEntity.noContent().build();
    }

    // PÚBLICO/PRIVADO: Busca as datas bloqueadas de um músico específico
    // Usado tanto pelo músico (para ver sua agenda) quanto pelo contratante (para ver disponibilidade)
    @GetMapping("/musico/{musicoId}")
    public ResponseEntity<List<LocalDate>> getDatasBloqueadas(@PathVariable String musicoId) {
        List<LocalDate> datas = agendaService.getDatasBloqueadas(musicoId);
        return ResponseEntity.ok(datas);
    }
}