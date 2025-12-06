package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.dto.BloqueioDTO;
import com.servidor.spring.servidor_spring.model.BloqueioAgenda;
import com.servidor.spring.servidor_spring.model.Musico;
import com.servidor.spring.servidor_spring.repository.BloqueioAgendaRepository;
import com.servidor.spring.servidor_spring.repository.MusicoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgendaService {

    @Autowired
    private BloqueioAgendaRepository bloqueioRepository;
    @Autowired
    private MusicoRepository musicoRepository;

    public void bloquearData(String emailMusico, LocalDate data) {
        Musico musico = musicoRepository.findByEmail(emailMusico);

        // Evita duplicidade
        if (!bloqueioRepository.existsByMusicoIdAndData(musico.getId(), data)) {
            BloqueioAgenda bloqueio = new BloqueioAgenda();
            bloqueio.setMusico(musico);
            bloqueio.setData(data);
            bloqueioRepository.save(bloqueio);
        }
    }

    @Transactional
    public void desbloquearData(String emailMusico, LocalDate data) {
        Musico musico = musicoRepository.findByEmail(emailMusico);
        bloqueioRepository.deleteByMusicoIdAndData(musico.getId(), data);
    }

    // Retorna lista de datas bloqueadas para o Front pintar de vermelho/cinza
    public List<LocalDate> getDatasBloqueadas(String musicoId) {
        return bloqueioRepository.findByMusicoId(musicoId)
                .stream()
                .map(BloqueioAgenda::getData)
                .collect(Collectors.toList());
    }
}