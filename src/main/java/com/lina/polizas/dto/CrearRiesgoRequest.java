package com.lina.polizas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CrearRiesgoRequest(

        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 255, message = "La dirección admite máximo 255 caracteres")
        String direccionInmueble,

        @NotBlank(message = "El arrendatario es obligatorio")
        @Size(max = 255, message = "El arrendatario admite máximo 255 caracteres")
        String arrendatario,

        @NotBlank(message = "El arrendador es obligatorio")
        @Size(max = 255, message = "El arrendador admite máximo 255 caracteres")
        String arrendador

) {
}