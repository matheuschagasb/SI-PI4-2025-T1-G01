package com.servidor.spring.servidor_spring.repository;

import com.servidor.spring.servidor_spring.model.Contrato;
import com.servidor.spring.servidor_spring.model.StatusContrato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ContratoRepository extends JpaRepository<Contrato, String> {

    List<Contrato> findByMusicoIdOrderByDataEventoDesc(String musicoId);

    List<Contrato> findByContratanteIdOrderByDataEventoDesc(String contratanteId);

    boolean existsByMusicoIdAndContratanteIdAndStatusIn(String musicoId, String contratanteId, List<StatusContrato> statuses);

    @Query(value = "SELECT * FROM contrato c WHERE c.musico_id = :musicoId " +
           "AND c.status = :status " +
           "AND c.data_evento < :fimEvento " +
           "AND (c.data_evento + (c.duracao * interval '1 hour')) > :inicioEvento", nativeQuery = true)
    List<Contrato> findOverlappingContracts(@Param("musicoId") String musicoId,
                                            @Param("status") String status,
                                            @Param("inicioEvento") LocalDateTime inicioEvento,
                                            @Param("fimEvento") LocalDateTime fimEvento);
}