package com.servidor.spring.servidor_spring.dto;

import com.servidor.spring.servidor_spring.model.Contratante;

public record ContratanteDTO(
        String id,
        String nome,
        String nomeEstabelecimento,
        String fotoPerfil
) {
    public ContratanteDTO(Contratante contratante) {
        this(
                contratante.getId(),
                contratante.getNome(),
                contratante.getNomeEstabelecimento(),
                contratante.getFotoPerfil()
        );
    }
}
