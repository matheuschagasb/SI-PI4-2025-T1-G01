/*
 * Victor Ramalho Borges de Souza – 24007532
 */

package com.servidor.spring.servidor_spring.dto;

import jakarta.validation.constraints.NotBlank;

// DTO para receber dados de login
public record DadosLogin(
        @NotBlank
        String email,
        @NotBlank
        String senha,
        @NotBlank // Role: MUSICO ou CONTRATANTE
        String role
) {
}
