package com.servidor.spring.servidor_spring.dto;

public record ContratoRequestDTO(
        String musicoId,
        String data,
        String hora,
        Integer duracao,
        String localEvento,
        String observacoes
) {
}
