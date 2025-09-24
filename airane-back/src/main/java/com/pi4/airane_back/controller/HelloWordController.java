package com.pi4.airane_back.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Controller
@ResponseBody
@RequestMapping("/hello-world")
public class HelloWordController {

    @GetMapping("/get")
    public String helloWorld() {
        return "Hello World";
    }



}
