/*
 * Thiago Mauri Gonzalez – 24015357
 */

package com.servidor.spring.servidor_spring.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Exceção customizada para erros de validação (HTTP 400)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }
}
