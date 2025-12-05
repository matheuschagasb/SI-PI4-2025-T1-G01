/*
 * Victor Ramalho Borges de Souza – 24007532
 */

package com.servidor.spring.servidor_spring.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.servidor.spring.servidor_spring.model.Contratante;
import com.servidor.spring.servidor_spring.model.Musico;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.stream.Collectors;

// Serviço responsável por gerar e validar tokens JWT
@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    // Gera um token JWT para o usuário autenticado
    public String gerarToken(UserDetails userDetails) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String role = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));

            return JWT.create()
                    .withIssuer("Servidor Spring")
                    .withSubject(userDetails.getUsername())
                    .withClaim("role", role)
                    .withExpiresAt(dataExpiracao())
                    .sign(algorithm);
        } catch (JWTCreationException exception){
            throw new RuntimeException("Erro ao gerar token jwt", exception);
        }
    }

    // Extrai o subject (email) do token JWT
    public String getSubject(String tokenJWT) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("Servidor Spring")
                    .build()
                    .verify(tokenJWT)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    // Extrai uma claim específica do token JWT
    public String getClaim(String tokenJWT, String claim) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("Servidor Spring")
                    .build()
                    .verify(tokenJWT)
                    .getClaim(claim)
                    .asString();
        } catch (JWTVerificationException exception) {
            throw new RuntimeException("Token JWT inválido ou expirado!");
        }
    }

    // Define data de expiração do token (2 horas)
    private Instant dataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
