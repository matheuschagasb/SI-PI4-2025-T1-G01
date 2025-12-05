/*
 * Marcos Roberto Mazzero Junior – 24010753
 */

package com.servidor.spring.servidor_spring.dto;

import com.servidor.spring.servidor_spring.model.Musico;

import java.util.List;

// DTO para exposição de dados do músico (sem senha)
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
        List<String> fotosBanda,
        String preco,
        String chavePix
) {
    // Construtor que converte entidade em DTO
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
                musico.getFotosBanda(),
                musico.getPreco(),
                musico.getChavePix()
        );
    }
}
