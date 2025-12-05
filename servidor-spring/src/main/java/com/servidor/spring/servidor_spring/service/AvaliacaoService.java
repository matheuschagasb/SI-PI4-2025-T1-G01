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

import java.time.LocalDateTime;
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
        // 1. Buscar o contrato
        Contrato contrato = contratoRepository.findById(dados.contratoId())
                .orElseThrow(() -> new ValidationException("Contrato não encontrado"));

        // 2. Validar se o contrato pertence ao contratante logado
        if (!contrato.getContratante().getEmail().equals(emailContratante)) {
            throw new ValidationException("Este contrato não pertence a você.");
        }

        // 3. LÓGICA NOVA: Atualizar status automaticamente se a data já passou
        if (contrato.getStatus() != StatusContrato.CONCLUIDO) {
            // Se a data do evento é ANTERIOR a hoje (ontem ou antes)
            if (contrato.getDataEvento().isBefore(LocalDateTime.now())) {
                contrato.setStatus(StatusContrato.CONCLUIDO);
                contratoRepository.save(contrato); // Salva a atualização no banco
            } else {
                // Se é hoje ou futuro, bloqueia
                throw new ValidationException("O evento ainda não foi concluído. Aguarde a data passar para avaliar.");
            }
        }

        // 4. Verificar se já existe avaliação para este contrato
        if (avaliacaoRepository.existsByContratoId(contrato.getId())) {
            throw new ValidationException("Você já avaliou este contrato.");
        }

        // 5. Criar e salvar a avaliação
        Musico musico = contrato.getMusico();
        Contratante contratante = contrato.getContratante();

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setContrato(contrato);
        avaliacao.setMusico(musico);
        avaliacao.setContratante(contratante);
        avaliacao.setNota(dados.nota());
        avaliacao.setComentario(dados.comentario());
        avaliacao.setDataAvaliacao(LocalDateTime.now());

        return avaliacaoRepository.save(avaliacao);
    }
    public List<AvaliacaoResponseDTO> listarAvaliacoesPorMusico(String musicoId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByMusicoId(musicoId);
        return avaliacoes.stream()
                .map(AvaliacaoResponseDTO::new)
                .collect(Collectors.toList());
    }
}