package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.dto.MusicoUpdate;
import com.servidor.spring.servidor_spring.model.Musico;
import com.servidor.spring.servidor_spring.repository.MusicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MusicoService {

    @Autowired
    private MusicoRepository musicoRepository;
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

        return musicoRepository.save(musico);
    }
}
