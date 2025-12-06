package com.servidor.spring.servidor_spring.repository;

import com.servidor.spring.servidor_spring.model.BloqueioAgenda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface BloqueioAgendaRepository extends JpaRepository<BloqueioAgenda, String> {
    List<BloqueioAgenda> findByMusicoId(String musicoId);
    boolean existsByMusicoIdAndData(String musicoId, LocalDate data);
    void deleteByMusicoIdAndData(String musicoId, LocalDate data);
}