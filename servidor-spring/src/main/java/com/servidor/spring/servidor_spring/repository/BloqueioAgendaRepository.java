// Matheus Chagas Batista – 24015048
package com.servidor.spring.servidor_spring.repository;

import com.servidor.spring.servidor_spring.model.BloqueioAgenda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

// Repositório JPA para operações de bloqueio de agenda
public interface BloqueioAgendaRepository extends JpaRepository<BloqueioAgenda, String> {
    // Retorna todos os bloqueios de um músico
    List<BloqueioAgenda> findByMusicoId(String musicoId);

    // Verifica se já existe bloqueio para a data e músico
    boolean existsByMusicoIdAndData(String musicoId, LocalDate data);

    // Remove o bloqueio de uma data para um músico
    void deleteByMusicoIdAndData(String musicoId, LocalDate data);
}
