package com.servidor.spring.servidor_spring.controller;

import com.servidor.spring.servidor_spring.dto.DadosLogin;
import com.servidor.spring.servidor_spring.dto.DadosTokenJWT;
import com.servidor.spring.servidor_spring.infra.security.TokenService;
import com.servidor.spring.servidor_spring.model.Contratante;
import com.servidor.spring.servidor_spring.model.Musico;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class AutenticacaoController {
    @Autowired
    private AuthenticationManager manager;
    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosLogin dados) {
        var username = dados.role() + ":" + dados.email();
        var authenticationToken = new UsernamePasswordAuthenticationToken(username, dados.senha());
        var authentication = manager.authenticate(authenticationToken);

        var principal = authentication.getPrincipal();
        var tokenJWT = tokenService.gerarToken((org.springframework.security.core.userdetails.UserDetails) principal);

        String id = null;
        String cpf = null;
        String role = dados.role();
        String nome = null;

        if (principal instanceof Musico) {
            Musico musico = (Musico) principal;
            id = musico.getId();
            cpf = musico.getCpf();
            nome = musico.getNome();
        } else if (principal instanceof Contratante) {
            Contratante contratante = (Contratante) principal;
            id = contratante.getId();
        }

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, id, role, cpf, nome));    }
}
