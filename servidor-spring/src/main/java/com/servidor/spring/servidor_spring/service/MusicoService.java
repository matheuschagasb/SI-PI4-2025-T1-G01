package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.model.Musico;
import com.servidor.spring.servidor_spring.repository.MusicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MusicoService {

    @Autowired
    private MusicoRepository musicoRepository;

    public Musico createMusico(Musico musico) {
        return musicoRepository.save(musico);
    }

    public java.util.List<Musico> getAllMusicos() {
        return musicoRepository.findAll();
    }
}
