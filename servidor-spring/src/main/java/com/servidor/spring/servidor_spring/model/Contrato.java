package com.servidor.spring.servidor_spring.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "contrato")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "musico_id")
    private Musico musico;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contratante_id")
    private Contratante contratante;

    private LocalDateTime dataEvento;
    private Integer duracao;
    private Double valorTotal;

    @Enumerated(EnumType.STRING)
    private StatusContrato status;

    private String localEvento;
    private String observacoes;

    public void setContratante(Contratante contratante) {
        this.contratante = contratante;
    }

    public void setMusico(Musico musico) {
        this.musico = musico;
    }

    public void setDataEvento(LocalDateTime dataEvento) {
        this.dataEvento = dataEvento;
    }

    public void setDuracao(Integer duracao) {
        this.duracao = duracao;
    }

    public void setLocalEvento(String localEvento) {
        this.localEvento = localEvento;
    }

    public void setObservacoes(String observacoes) {
        this.observacoes = observacoes;
    }

    public void setValorTotal(Double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public void setStatus(StatusContrato status) {
        this.status = status;
    }
}
