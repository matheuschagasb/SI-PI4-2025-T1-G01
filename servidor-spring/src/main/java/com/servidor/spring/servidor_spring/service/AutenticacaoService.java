package com.servidor.spring.servidor_spring.service;

import com.servidor.spring.servidor_spring.repository.ContratanteRepository;
import com.servidor.spring.servidor_spring.repository.MusicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AutenticacaoService implements UserDetailsService {

    @Autowired
    private MusicoRepository musicoRepository;

    @Autowired
    private ContratanteRepository contratanteRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        String[] parts = username.split(":");
        if (parts.length != 2) {
            throw new UsernameNotFoundException("Formato de usuário inválido!");
        }
        String role = parts[0];
        String email = parts[1];

        UserDetails user;
        if ("musico".equalsIgnoreCase(role)) {
            user = musicoRepository.findByEmail(email);
        } else if ("contratante".equalsIgnoreCase(role)) {
            user = contratanteRepository.findByEmail(email);
        } else {
            throw new UsernameNotFoundException("Tipo de usuário desconhecido: " + role);
        }

        if (user == null) {
            throw new UsernameNotFoundException("Dados inválidos!");
        }

        return user;
    }
}
