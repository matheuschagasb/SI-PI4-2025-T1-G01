/*
 * Guilherme Padilha Freire Alves – 24005138
 */

package com.servidor.spring.servidor_spring.dto;

// DTO para criação de novo contrato
public record ContratoRequestDTO(
        String musicoId,
        String data,
        String hora,
        Integer duracao,
        String localEvento,
        String observacoes
) {
}
