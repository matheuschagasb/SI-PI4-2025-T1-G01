package com.servidor.spring.servidor_spring.repository;

import com.servidor.spring.servidor_spring.model.Musico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MusicoRepository extends JpaRepository<Musico, String> {
}
