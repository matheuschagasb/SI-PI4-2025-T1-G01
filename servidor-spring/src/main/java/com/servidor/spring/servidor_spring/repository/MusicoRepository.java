package com.servidor.spring.servidor_spring.repository;

import com.servidor.spring.servidor_spring.model.Musico;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface MusicoRepository extends JpaRepository<Musico, String> {
    UserDetails findByEmail(String email);
    List<Musico> findByGeneroMusical(String generoMusical);
}
