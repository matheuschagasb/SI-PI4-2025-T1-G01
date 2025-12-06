package com.servidor.spring.servidor_spring.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Table(name = "bloqueio_agenda")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class BloqueioAgenda {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "musico_id")
    private Musico musico;

    @Column(nullable = false)
    private LocalDate data;
}