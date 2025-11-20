package com.servidor.spring.servidor_spring.repository;

import com.servidor.spring.servidor_spring.model.Contratante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface ContratanteRepository extends JpaRepository<Contratante, String> {
    UserDetails findByEmail(String email);
}
