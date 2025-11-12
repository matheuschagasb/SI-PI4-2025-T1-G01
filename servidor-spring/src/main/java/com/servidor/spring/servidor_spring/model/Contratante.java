package com.servidor.spring.servidor_spring.model;

import jakarta.persistence.*;
import lombok.*;
@Entity
@Data
@Table(name = "contratante")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Contratante {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String nome;
    private String email;
    private String telefone;
    private String senha;
}
