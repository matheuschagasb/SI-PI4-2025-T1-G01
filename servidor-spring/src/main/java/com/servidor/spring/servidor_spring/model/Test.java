/*
 * Autor: Victor Ramalho Borges de Souza – 24007532
 */

package com.servidor.spring.servidor_spring.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

// Classe de teste para validação de endpoints
@Setter
@Getter
@AllArgsConstructor
public class Test {
    private String name;
    private String email;

    public String getName() {
        return name;
    }
}
