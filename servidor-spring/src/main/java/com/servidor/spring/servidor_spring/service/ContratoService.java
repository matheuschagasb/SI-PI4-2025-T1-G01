package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.dto.ContratoRequestDTO;
import com.servidor.spring.servidor_spring.exception.ForbiddenException;
import com.servidor.spring.servidor_spring.exception.ValidationException;
import com.servidor.spring.servidor_spring.model.*;
import com.servidor.spring.servidor_spring.repository.ContratanteRepository;
import com.servidor.spring.servidor_spring.repository.ContratoRepository;
import com.servidor.spring.servidor_spring.repository.MusicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
public class ContratoService {

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private MusicoRepository musicoRepository;

    @Autowired
    private ContratanteRepository contratanteRepository;

    public Contrato createContrato(ContratoRequestDTO dados, String emailContratante) {
        Contratante contratante = contratanteRepository.findByEmail(emailContratante);
        if (contratante == null) {
            throw new ValidationException("Contratante não encontrado.");
        }

        Musico musico = musicoRepository.findById(dados.musicoId())
                .orElseThrow(() -> new ValidationException("Músico não encontrado."));

        LocalDateTime dataEvento = parseDataHora(dados.data(), dados.hora());
        if (dataEvento.isBefore(LocalDateTime.now())) {
            throw new ValidationException("A data e hora do evento devem ser no futuro.");
        }

        LocalDateTime fimEvento = dataEvento.plusHours(dados.duracao());
        List<Contrato> conflitos = contratoRepository.findOverlappingContracts(
                dados.musicoId(),
                StatusContrato.CONFIRMADO.name(),
                dataEvento,
                fimEvento
        );

        if (!conflitos.isEmpty()) {
            throw new ValidationException("O músico não está disponível nesta data e horário.");
        }

        double valorTotal = calcularValorTotal(musico, dados.duracao());

        Contrato contrato = new Contrato();
        contrato.setContratante(contratante);
        contrato.setMusico(musico);
        contrato.setDataEvento(dataEvento);
        contrato.setDuracao(dados.duracao());
        contrato.setLocalEvento(dados.localEvento());
        contrato.setObservacoes(dados.observacoes());
        contrato.setValorTotal(valorTotal);
        contrato.setStatus(StatusContrato.PENDENTE);

        return contratoRepository.save(contrato);
    }

    public Contrato confirmarPagamento(String contratoId, String emailContratante) {
        Contrato contrato = contratoRepository.findById(contratoId)
                .orElseThrow(() -> new ValidationException("Contrato não encontrado."));

        Contratante contratante = contratanteRepository.findByEmail(emailContratante);

        if (!contrato.getContratante().getId().equals(contratante.getId())) {
            throw new ForbiddenException("Você não tem permissão para confirmar o pagamento deste contrato.");
        }

        if (contrato.getStatus() != StatusContrato.CONFIRMADO) {
            throw new ValidationException("Este contrato não pode ser pago. Status atual: " + contrato.getStatus());
        }

        contrato.setStatus(StatusContrato.CONCLUIDO);
        contrato.setDataPagamento(LocalDateTime.now());

        return contratoRepository.save(contrato);
    }

    public List<Contrato> getContratosByMusicoId(String musicoId) {
        return contratoRepository.findByMusicoIdOrderByDataEventoDesc(musicoId);
    }

    private LocalDateTime parseDataHora(String data, String hora) {
        try {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate localDate = LocalDate.parse(data, dateFormatter);
            LocalTime localTime = LocalTime.parse(hora);
            return LocalDateTime.of(localDate, localTime);
        } catch (Exception e) {
            throw new ValidationException("Formato de data ou hora inválido. Use YYYY-MM-DD e HH:MM.");
        }
    }

    private double calcularValorTotal(Musico musico, int duracao) {
        if (musico.getPreco() == null || duracao <= 0) {
            return 0; // Ou lançar exceção, dependendo da regra de negócio
        }
        try {
            double precoPorHora = Double.parseDouble(musico.getPreco());
            return precoPorHora * duracao;
        } catch (NumberFormatException e) {
            throw new ValidationException("Preço do músico não é um número válido.");
        }
    }
}
