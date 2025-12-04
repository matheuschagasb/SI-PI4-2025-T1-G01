/*
 * Autor: Guilherme Padilha Freire Alves – 24005138
 */

package com.servidor.spring.servidor_spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

// Classe principal da aplicação Spring Boot
@SpringBootApplication
@ComponentScan(basePackages = {"com.servidor.spring.servidor_spring",
                                "com.servidor.spring.servidor_spring.controller",
                                "com.servidor.spring.servidor_spring.model",
                                "com.servidor.spring.servidor_spring.repository"})
public class ServidorSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServidorSpringApplication.class, args);
	}

}

