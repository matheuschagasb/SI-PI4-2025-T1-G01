package com.servidor.spring.servidor_spring.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Table(name = "avaliacao")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Integer nota; // 1 a 5

    @Column(columnDefinition = "TEXT")
    private String comentario;

    private LocalDateTime dataAvaliacao = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "musico_id")
    private Musico musico;

    @ManyToOne
    @JoinColumn(name = "contratante_id")
    private Contratante contratante;

    @OneToOne
    @JoinColumn(name = "contrato_id")
    private Contrato contrato; // Um contrato só pode ter uma avaliação
}