package com.servidor.spring.servidor_spring.dto;

import com.servidor.spring.servidor_spring.model.Contrato;
import com.servidor.spring.servidor_spring.model.StatusContrato;

import java.time.LocalDateTime;

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
