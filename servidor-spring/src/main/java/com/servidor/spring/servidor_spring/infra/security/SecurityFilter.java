/*
 * Thiago Mauri Gonzalez – 24015357
 */

package com.servidor.spring.servidor_spring.infra.security;

import com.servidor.spring.servidor_spring.repository.ContratanteRepository;
import com.servidor.spring.servidor_spring.repository.MusicoRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// Filtro que intercepta todas as requisições para validar o token JWT
@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private MusicoRepository musicoRepository;

    @Autowired
    private ContratanteRepository contratanteRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var tokenJWT = recuperarToken(request);

        if (tokenJWT != null) {
            var subject = tokenService.getSubject(tokenJWT);
            var role = tokenService.getClaim(tokenJWT, "role");

            // Busca usuário de acordo com a role do token
            UserDetails userDetails = null;
            if ("ROLE_MUSICO".equals(role)) {
                userDetails = musicoRepository.findByEmail(subject);
            } else if ("ROLE_CONTRATANTE".equals(role)) {
                userDetails = contratanteRepository.findByEmail(subject);
            }

            if (userDetails != null) {
                // Autentica o usuário no contexto do Spring Security
                var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    // Extrai o token JWT do cabeçalho Authorization
    private String recuperarToken(HttpServletRequest request) {
        var authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null) {
            return authorizationHeader.replace("Bearer ", "").trim();
        }
        return null;
    }
}
