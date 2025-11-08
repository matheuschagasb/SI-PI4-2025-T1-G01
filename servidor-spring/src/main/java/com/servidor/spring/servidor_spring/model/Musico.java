package com.servidor.spring.servidor_spring.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table(name = "musico")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Musico {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String nome;
    private String biografia;
    private String cidade;
    private String estado;
    private String generoMusical;
    private String email;
    private String telefone;
    private String senha;
}
