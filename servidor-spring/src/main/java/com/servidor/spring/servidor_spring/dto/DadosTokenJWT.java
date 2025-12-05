/*
 * Matheus Chagas Batista – 24015048
 */

package com.servidor.spring.servidor_spring.dto;

// DTO para retorno do token JWT após autenticação
public record DadosTokenJWT(String token, String id, String role, String cpf,String nome) {
}
