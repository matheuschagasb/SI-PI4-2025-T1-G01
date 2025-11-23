package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.model.Contratante;
import com.servidor.spring.servidor_spring.repository.ContratanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.servidor.spring.servidor_spring.dto.ContratanteUpdate;

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

    public Contratante updateContratante(String id, ContratanteUpdate dados) {
        Contratante contratante = contratanteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contratante não encontrado"));

        // Atualiza apenas se o dado foi enviado (não é nulo)
        if (dados.nome() != null) contratante.setNome(dados.nome());
        if (dados.telefone() != null) contratante.setTelefone(dados.telefone());
        if (dados.nomeEstabelecimento() != null) contratante.setNomeEstabelecimento(dados.nomeEstabelecimento());
        if (dados.tipoEstabelecimento() != null) contratante.setTipoEstabelecimento(dados.tipoEstabelecimento());

        return contratanteRepository.save(contratante);
    }


    public java.util.List<Contratante> getAllContratante() {
        return contratanteRepository.findAll();
    }
}
