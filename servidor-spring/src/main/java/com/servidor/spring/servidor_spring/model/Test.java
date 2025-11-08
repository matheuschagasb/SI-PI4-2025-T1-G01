package com.servidor.spring.servidor_spring.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class Test {
    private String name;
    private String email;

    public String getName() {
        return name;
    }
}
