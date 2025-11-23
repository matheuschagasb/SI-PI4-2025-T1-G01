package com.servidor.spring.servidor_spring.dto;

public record ContratanteUpdate(
        String nome,
        String telefone,
        String nomeEstabelecimento,
        String tipoEstabelecimento,
        String fotoPerfil
) {}