// Victor Ramalho Borges de Souza – 24007532
package com.servidor.spring.servidor_spring.dto;

import com.servidor.spring.servidor_spring.model.Avaliacao;
import java.time.LocalDateTime;
// DTO para a response de avaliação do musico

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
                // Proteção contra NullPointerException aqui:
                (avaliacao.getContratante() != null) ? avaliacao.getContratante().getNome() : "Contratante Desconhecido",
                avaliacao.getDataAvaliacao()
        );
    }
}