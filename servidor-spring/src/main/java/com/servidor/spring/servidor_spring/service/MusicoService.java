package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.dto.MusicoUpdate;
import com.servidor.spring.servidor_spring.exception.ForbiddenException;
import com.servidor.spring.servidor_spring.exception.ValidationException;
import com.servidor.spring.servidor_spring.model.Contratante;
import com.servidor.spring.servidor_spring.model.Musico;
import com.servidor.spring.servidor_spring.model.StatusContrato;
import com.servidor.spring.servidor_spring.repository.ContratanteRepository;
import com.servidor.spring.servidor_spring.repository.ContratoRepository;
import com.servidor.spring.servidor_spring.repository.MusicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.servidor.spring.servidor_spring.dto.ChavePixDTO;


import java.util.List;
import java.util.Optional;

@Service
public class MusicoService {

    @Autowired
    private MusicoRepository musicoRepository;
    @Autowired
    private ContratanteRepository contratanteRepository;
    @Autowired
    private ContratoRepository contratoRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Musico createMusico(Musico musico) {
        musico.setSenha(passwordEncoder.encode(musico.getSenha()));
        return musicoRepository.save(musico);
    }

    public List<Musico> getAllMusicos(String generoMusical) {
        if (generoMusical != null && !generoMusical.isEmpty()) {
            return musicoRepository.findByGeneroMusical(generoMusical);
        }
        return musicoRepository.findAll();
    }

    // Novo método adicionado
    public Optional<Musico> getMusicoById(String id) {
        return musicoRepository.findById(id);
    }

    public Musico findByEmail(String email) {
        return musicoRepository.findByEmail(email);
    }

    public ChavePixDTO getChavePix(String musicoId, String contratanteEmail) {
        Contratante contratante = contratanteRepository.findByEmail(contratanteEmail);
        if (contratante == null) {
            throw new ValidationException("Contratante não encontrado.");
        }

        List<StatusContrato> statuses = List.of(StatusContrato.PENDENTE, StatusContrato.CONFIRMADO);
        boolean hasActiveContract = contratoRepository.existsByMusicoIdAndContratanteIdAndStatusIn(musicoId, contratante.getId(), statuses);

        if (!hasActiveContract) {
            throw new ForbiddenException("Você não tem permissão para visualizar a chave PIX deste músico.");
        }

        Musico musico = musicoRepository.findById(musicoId)
                .orElseThrow(() -> new ValidationException("Músico não encontrado."));
        
        if (musico.getTelefone() == null || musico.getTelefone().isBlank()) {
            throw new ValidationException("O músico ainda não cadastrou um telefone para chave PIX.");
        }

        return new ChavePixDTO(musico.getTelefone());
    }

    public Musico updateMusico(String id, MusicoUpdate dados) {
        Musico musico = musicoRepository.findById(id).orElseThrow();
        if(dados.nome() != null) {
            musico.setNome(dados.nome());
        }
        if(dados.biografia() != null) {
            musico.setBiografia(dados.biografia());
        }
        if(dados.cidade() != null) {
            musico.setCidade(dados.cidade());
        }
        if(dados.estado() != null) {
            musico.setEstado(dados.estado());
        }
        if(dados.generoMusical() != null) {
            musico.setGeneroMusical(dados.generoMusical());
        }
        if(dados.telefone() != null) {
            musico.setTelefone(dados.telefone());
        }
        if(dados.fotoPerfil() != null) {
            musico.setFotoPerfil(dados.fotoPerfil());
        }
        if(dados.fotosBanda() != null) {
            musico.setFotosBanda(dados.fotosBanda());
        }
        if(dados.preco() != null) {
            musico.setPreco(dados.preco());
        }
        if(dados.chavePix() != null) {
            musico.setChavePix(dados.chavePix());
        }

        return musicoRepository.save(musico);
    }
}
