package com.lina.polizas.controller;

import com.lina.polizas.dto.CrearRiesgoRequest;
import com.lina.polizas.dto.PolizaResponse;
import com.lina.polizas.dto.RenovarPolizaRequest;
import com.lina.polizas.dto.RiesgoResponse;
import com.lina.polizas.model.EstadoPoliza;
import com.lina.polizas.model.TipoPoliza;
import com.lina.polizas.service.PolizaService;
import com.lina.polizas.service.RiesgoService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/polizas")
public class PolizaController {

    private final PolizaService polizaService;
    private final RiesgoService riesgoService;

    public PolizaController(
            PolizaService polizaService,
            RiesgoService riesgoService) {
        this.polizaService = polizaService;
        this.riesgoService = riesgoService;
    }

    @GetMapping
    public List<PolizaResponse> listar(
            @RequestParam(required = false) TipoPoliza tipo,
            @RequestParam(required = false) EstadoPoliza estado) {
        return polizaService.listar(tipo, estado);
    }

    @GetMapping("/{id}/riesgos")
    public List<RiesgoResponse> listarRiesgos(
            @PathVariable Long id) {
        return riesgoService.listar(id);
    }

    @PostMapping("/{id}/renovar")
    public PolizaResponse renovar(
            @PathVariable Long id,
            @Valid @RequestBody RenovarPolizaRequest request) {
        return polizaService.renovar(id, request.ipc());
    }

    @PostMapping("/{id}/cancelar")
    public PolizaResponse cancelar(@PathVariable Long id) {
        return polizaService.cancelar(id);
    }

    @PostMapping("/{id}/riesgos")
    @ResponseStatus(HttpStatus.CREATED)
    public RiesgoResponse agregarRiesgo(
            @PathVariable Long id,
            @Valid @RequestBody CrearRiesgoRequest request) {
        return riesgoService.agregar(id, request);
    }
}