package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.model.Contratante;
import com.servidor.spring.servidor_spring.repository.ContratanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ContratanteService {
    @Autowired
    private ContratanteRepository contratanteRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public Contratante createContratante(Contratante contratante) {
        contratante.setSenha(passwordEncoder.encode(contratante.getSenha()));
        return contratanteRepository.save(contratante);
    }

    public Contratante findByEmail(String email) {
        return (Contratante) contratanteRepository.findByEmail(email);
    }


    public java.util.List<Contratante> getAllContratante() {
        return contratanteRepository.findAll();
    }
}
