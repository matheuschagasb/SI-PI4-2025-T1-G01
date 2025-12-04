/*
 * Matheus Chagas Batista – 24015048
 */

package com.servidor.spring.servidor_spring.configuration;

import com.servidor.spring.servidor_spring.infra.security.SecurityFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

// Configuração de segurança da aplicação
@Configuration
@EnableWebSecurity
public class SecurityConfigurations {

    @Autowired
    private SecurityFilter securityFilter;

    // Configura a cadeia de filtros de segurança
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf(csrf -> csrf.disable()) // Desabilita CSRF para API REST
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Sem sessão (stateless)
                .authorizeHttpRequests(req -> {
                    // Endpoints públicos (sem autenticação)
                    req.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/login").permitAll();

                    // Endpoints de músicos (públicos para consulta e cadastro)
                    req.requestMatchers(HttpMethod.GET, "/v1/musico/**").permitAll();
                    req.requestMatchers(HttpMethod.PUT, "/v1/musico/**").permitAll();

                    req.requestMatchers(HttpMethod.POST, "/v1/musico").permitAll();
                    req.requestMatchers(HttpMethod.POST, "/v1/contratante").permitAll();
                    req.requestMatchers(HttpMethod.GET, "/v1/contratante/me").hasRole("CONTRATANTE");
                    req.requestMatchers(HttpMethod.POST, "/v1/contratos").authenticated();
                    req.requestMatchers(HttpMethod.POST, "/v1/contratos/{id}/confirmar-pagamento").hasRole("CONTRATANTE");
                    req.requestMatchers(HttpMethod.GET, "/v1/contratos").hasRole("MUSICO");
                    req.requestMatchers(HttpMethod.GET, "/v1/contratos/contratante").hasRole("CONTRATANTE");
                    req.requestMatchers("/hello-world").permitAll();
                    req.anyRequest().authenticated();
                })
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    // Encoder para criptografar senhas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuração de CORS para permitir requisições do frontend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://192.168.15.63:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}