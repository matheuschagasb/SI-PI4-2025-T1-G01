package com.servidor.spring.servidor_spring.dto;

import jakarta.validation.constraints.NotBlank;

public record DadosLogin(
        @NotBlank
        String email,
        @NotBlank
        String senha,
        @NotBlank
        String role
) {
}
