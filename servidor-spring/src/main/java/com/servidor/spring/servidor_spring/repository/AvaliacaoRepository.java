package com.servidor.spring.servidor_spring.repository;

import com.servidor.spring.servidor_spring.model.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AvaliacaoRepository extends JpaRepository<Avaliacao, String> {
    List<Avaliacao> findByMusicoId(String musicoId);
    boolean existsByContratoId(String contratoId);
}