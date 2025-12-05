/*
 * Matheus Chagas Batista – 24015048
 */

package com.servidor.spring.servidor_spring.dto;

import com.servidor.spring.servidor_spring.model.Contratante;

// DTO para exposição de dados do contratante (sem senha)
public record ContratanteDTO(
        String id,
        String nome,
        String nomeEstabelecimento,
        String fotoPerfil
) {
    // Construtor que converte entidade em DTO
    public ContratanteDTO(Contratante contratante) {
        this(
                contratante.getId(),
                contratante.getNome(),
                contratante.getNomeEstabelecimento(),
                contratante.getFotoPerfil()
        );
    }
}
