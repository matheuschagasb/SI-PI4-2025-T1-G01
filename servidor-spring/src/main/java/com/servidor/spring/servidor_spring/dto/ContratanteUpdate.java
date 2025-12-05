/*
 * Marcos Roberto Mazzero Junior – 24010753
 */

package com.servidor.spring.servidor_spring.dto;

// DTO para atualização de dados do contratante
public record ContratanteUpdate(
        String nome,
        String telefone,
        String nomeEstabelecimento,
        String tipoEstabelecimento,
        String fotoPerfil
) {}