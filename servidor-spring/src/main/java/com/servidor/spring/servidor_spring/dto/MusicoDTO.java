package com.servidor.spring.servidor_spring.dto;

import com.servidor.spring.servidor_spring.model.Musico;

import java.util.List;

public record MusicoDTO(
        String id,
        String nome,
        String biografia,
        String cidade,
        String estado,
        String generoMusical,
        String email,
        String telefone,
        String fotoPerfil,
        List<String> fotosBanda
) {
    public MusicoDTO(Musico musico) {
        this(
                musico.getId(),
                musico.getNome(),
                musico.getBiografia(),
                musico.getCidade(),
                musico.getEstado(),
                musico.getGeneroMusical(),
                musico.getEmail(),
                musico.getTelefone(),
                musico.getFotoPerfil(),
                musico.getFotosBanda()
        );
    }
}
