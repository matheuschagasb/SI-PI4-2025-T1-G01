package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.model.Contratante;
import com.servidor.spring.servidor_spring.repository.ContratanteRespository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContratanteService {
    @Autowired
    private ContratanteRespository contratanteRespository;

    public Contratante createContratante(Contratante contratante) {
        return contratanteRespository.save(contratante);
    }

    public java.util.List<Contratante> getAllContratante() {
        return contratanteRespository.findAll();
    }
}
