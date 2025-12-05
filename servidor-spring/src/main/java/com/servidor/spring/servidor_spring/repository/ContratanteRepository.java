/*
 * Autor: Matheus Chagas Batista – 24015048
 */

package com.servidor.spring.servidor_spring.repository;

import com.servidor.spring.servidor_spring.model.Contratante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

// Repositório para acesso aos dados de Contratante
public interface ContratanteRepository extends JpaRepository<Contratante, String> {
    Contratante findByEmail(String email);
}
