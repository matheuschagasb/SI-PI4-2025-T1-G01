// Guilherme Padilha - 24005138
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
// Entidade JPA que representa um bloqueio de data na agenda do músico
public class BloqueioAgenda {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    // Identificador primário (UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "musico_id")
    // Relacionamento com o músico dono do bloqueio
    private Musico musico;

    @Column(nullable = false)
    // Data bloqueada (obrigatória)
    private LocalDate data;
}