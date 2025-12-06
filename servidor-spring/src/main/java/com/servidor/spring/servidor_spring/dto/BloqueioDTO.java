// Thiago Mauri Gonzalez – 24015357
package com.servidor.spring.servidor_spring.dto;

import java.time.LocalDate;

// DTO simples que transporta a data a ser bloqueada
public record BloqueioDTO(LocalDate data) {
}
