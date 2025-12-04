package com.servidor.spring.servidor_spring.dto;

import com.servidor.spring.servidor_spring.model.Avaliacao;
import java.time.LocalDateTime;

public record AvaliacaoResponseDTO(
        String id,
        Integer nota,
        String comentario,
        String nomeContratante,
        LocalDateTime dataAvaliacao
) {
    public AvaliacaoResponseDTO(Avaliacao avaliacao) {
        this(
                avaliacao.getId(),
                avaliacao.getNota(),
                avaliacao.getComentario(),
                avaliacao.getContratante().getNome(),
                avaliacao.getDataAvaliacao()
        );
    }
}