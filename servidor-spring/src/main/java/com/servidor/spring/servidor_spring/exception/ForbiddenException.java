/*
 * Guilherme Padilha Freire Alves – 24005138
 */

package com.servidor.spring.servidor_spring.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Exceção customizada para acesso negado (HTTP 403)
@ResponseStatus(HttpStatus.FORBIDDEN)
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
