package com.lina.polizas.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/core-mock")
public class CoreMockController {

    private static final Logger log =
            LoggerFactory.getLogger(CoreMockController.class);

    public record EventoRequest(
            @NotBlank String evento,
            @NotNull @Positive Long polizaId
    ) {
    }

    @PostMapping("/evento")
    public Map<String, String> registrarEvento(
            @Valid @RequestBody EventoRequest request) {

        log.info(
                "Intento de actualización enviado al CORE: evento={}, polizaId={}",
                request.evento(),
                request.polizaId()
        );

        return Map.of("mensaje", "Evento registrado");
    }
}