package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.dto.AvaliacaoRequestDTO;
import com.servidor.spring.servidor_spring.dto.AvaliacaoResponseDTO;
import com.servidor.spring.servidor_spring.exception.ValidationException; // Supondo que você tenha essa classe
import com.servidor.spring.servidor_spring.model.*;
import com.servidor.spring.servidor_spring.repository.AvaliacaoRepository;
import com.servidor.spring.servidor_spring.repository.ContratanteRepository;
import com.servidor.spring.servidor_spring.repository.ContratoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private ContratanteRepository contratanteRepository;

    public Avaliacao avaliarMusico(AvaliacaoRequestDTO dados, String emailContratante) {
        // 1. Buscar o Contratante logado
        Contratante contratante = contratanteRepository.findByEmail(emailContratante);
        if (contratante == null) {
            throw new ValidationException("Contratante não encontrado.");
        }

        // 2. Buscar o Contrato
        Contrato contrato = contratoRepository.findById(dados.contratoId())
                .orElseThrow(() -> new ValidationException("Contrato não encontrado."));

        // 3. Validar se o contrato pertence a esse contratante
        if (!contrato.getContratante().getId().equals(contratante.getId())) {
            throw new ValidationException("Este contrato não pertence a você.");
        }

        // 4. Validar Status (Só pode avaliar se estiver CONCLUIDO)
        if (contrato.getStatus() != StatusContrato.CONCLUIDO) {
            throw new ValidationException("Apenas contratos concluídos podem ser avaliados.");
        }

        // 5. Verificar se já existe avaliação para este contrato
        if (avaliacaoRepository.existsByContratoId(contrato.getId())) {
            throw new ValidationException("Este contrato já foi avaliado.");
        }

        // 6. Salvar Avaliação
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNota(dados.nota());
        avaliacao.setComentario(dados.comentario());
        avaliacao.setContratante(contratante);
        avaliacao.setMusico(contrato.getMusico()); // Pega o músico direto do contrato para garantir consistência
        avaliacao.setContrato(contrato);

        return avaliacaoRepository.save(avaliacao);
    }

    public List<AvaliacaoResponseDTO> listarAvaliacoesPorMusico(String musicoId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByMusicoId(musicoId);
        return avaliacoes.stream()
                .map(AvaliacaoResponseDTO::new)
                .collect(Collectors.toList());
    }
}