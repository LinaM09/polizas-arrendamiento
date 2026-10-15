package com.lina.polizas.dto;

import com.lina.polizas.model.EstadoPoliza;
import com.lina.polizas.model.Poliza;
import com.lina.polizas.model.TipoPoliza;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PolizaResponse(
        Long id,
        TipoPoliza tipo,
        EstadoPoliza estado,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        Integer mesesVigencia,
        BigDecimal canonMensual,
        BigDecimal prima
) {

    public static PolizaResponse desde(Poliza poliza) {
        return new PolizaResponse(
                poliza.getId(),
                poliza.getTipo(),
                poliza.getEstado(),
                poliza.getFechaInicio(),
                poliza.getFechaFin(),
                poliza.getMesesVigencia(),
                poliza.getCanonMensual(),
                poliza.getPrima()
        );
    }
}