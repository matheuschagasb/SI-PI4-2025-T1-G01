package com.servidor.spring.servidor_spring.dto;

import java.util.List;

public record MusicoUpdate(
        String nome,
        String biografia,
        String cidade,
        String estado,
        String generoMusical,
        String telefone,
        String fotoPerfil,
        List<String> fotosBanda,
        String preco,
        String chavePix
) {
}
