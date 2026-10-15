package com.lina.polizas.dto;

import com.lina.polizas.model.EstadoRiesgo;
import com.lina.polizas.model.Riesgo;

public record RiesgoResponse(
        Long id,
        Long polizaId,
        String direccionInmueble,
        String arrendatario,
        String arrendador,
        EstadoRiesgo estado
) {

    public static RiesgoResponse desde(Riesgo riesgo) {
        return new RiesgoResponse(
                riesgo.getId(),
                riesgo.getPoliza().getId(),
                riesgo.getDireccionInmueble(),
                riesgo.getArrendatario(),
                riesgo.getArrendador(),
                riesgo.getEstado()
        );
    }
}