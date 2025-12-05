package com.servidor.spring.servidor_spring.dto;

public record AvaliacaoRequestDTO(
        String contratoId,
        String musicoId, // Opcional, pois podemos pegar pelo contrato, mas vamos manter
        Integer nota,
        String comentario
) {}