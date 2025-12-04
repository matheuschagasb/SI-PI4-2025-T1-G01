/*
 * Thiago Mauri Gonzalez – 24015357
 */

package com.servidor.spring.servidor_spring.dto;

import com.servidor.spring.servidor_spring.model.Contrato;
import com.servidor.spring.servidor_spring.model.StatusContrato;

import java.time.LocalDateTime;

// DTO para retorno de dados do contrato com informações completas
public record ContratoResponseDTO(
        String id,
        MusicoDTO musico,
        ContratanteDTO contratante,
        LocalDateTime dataEvento,
        Integer duracao,
        Double valorTotal,
        StatusContrato status,
        String localEvento,
        String observacoes,
        LocalDateTime dataPagamento,
        String comprovantePagamentoUrl
) {
    // Construtor que converte entidade em DTO
    public ContratoResponseDTO(Contrato contrato) {
        this(
                contrato.getId(),
                new MusicoDTO(contrato.getMusico()),
                new ContratanteDTO(contrato.getContratante()),
                contrato.getDataEvento(),
                contrato.getDuracao(),
                contrato.getValorTotal(),
                contrato.getStatus(),
                contrato.getLocalEvento(),
                contrato.getObservacoes(),
                contrato.getDataPagamento(),
                contrato.getComprovantePagamentoUrl()
        );
    }
}
