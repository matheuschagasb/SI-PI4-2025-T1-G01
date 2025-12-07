// Guilherme Padilha - 24005138
package com.servidor.spring.servidor_spring.dto;

// DTO para o request de avaliação do musico
public record AvaliacaoRequestDTO(
        String contratoId,
        String musicoId, // Opcional, pois podemos pegar pelo contrato, mas vamos manter
        Integer nota,
        String comentario
) {}