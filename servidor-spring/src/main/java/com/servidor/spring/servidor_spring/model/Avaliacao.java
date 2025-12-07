/* Thiago Mauri Gonzalez – 24015357
 */

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
// Entidade que representa uma avaliação feita por um contratante para um músico
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    // Identificador único da avaliação
    private String id;

    private Integer nota; // 1 a 5
    // Nota dada na avaliação

    @Column(columnDefinition = "TEXT")
    private String comentario;
    // Comentário livre do contratante

    private LocalDateTime dataAvaliacao = LocalDateTime.now();
    // Timestamp da avaliação (definido na criação)

    @ManyToOne
    @JoinColumn(name = "musico_id")
    private Musico musico;
    // Referência ao músico avaliado

    @ManyToOne
    @JoinColumn(name = "contratante_id")
    private Contratante contratante;
    // Referência ao contratante que avaliou

    @OneToOne
    @JoinColumn(name = "contrato_id")
    private Contrato contrato; // Um contrato só pode ter uma avaliação
    // Contrato associado à avaliação (relaçao 1:1)
}