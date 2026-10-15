package com.lina.polizas.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RenovarPolizaRequest(

        @NotNull(message = "El IPC es obligatorio")
        @DecimalMin(value = "0.0", message = "El IPC no puede ser negativo")
        @DecimalMax(value = "100.0", message = "El IPC no puede superar el 100%")
        BigDecimal ipc

) {
}