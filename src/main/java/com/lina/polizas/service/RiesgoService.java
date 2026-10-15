package com.lina.polizas.service;

import com.lina.polizas.dto.CrearRiesgoRequest;
import com.lina.polizas.dto.RiesgoResponse;
import com.lina.polizas.exception.RecursoNoEncontradoException;
import com.lina.polizas.exception.ReglaNegocioException;
import com.lina.polizas.integration.CoreAdapter;
import com.lina.polizas.model.EstadoPoliza;
import com.lina.polizas.model.EstadoRiesgo;
import com.lina.polizas.model.Poliza;
import com.lina.polizas.model.Riesgo;
import com.lina.polizas.model.TipoPoliza;
import com.lina.polizas.repository.PolizaRepository;
import com.lina.polizas.repository.RiesgoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RiesgoService {

    private final PolizaRepository polizaRepository;
    private final RiesgoRepository riesgoRepository;
    private final CoreAdapter coreAdapter;

    public RiesgoService(
            PolizaRepository polizaRepository,
            RiesgoRepository riesgoRepository,
            CoreAdapter coreAdapter) {
        this.polizaRepository = polizaRepository;
        this.riesgoRepository = riesgoRepository;
        this.coreAdapter = coreAdapter;
    }

    @Transactional(readOnly = true)
    public List<RiesgoResponse> listar(Long polizaId) {
        buscarPoliza(polizaId);

        return riesgoRepository.findByPolizaId(polizaId)
                .stream()
                .map(RiesgoResponse::desde)
                .toList();
    }

    public RiesgoResponse agregar(
            Long polizaId,
            CrearRiesgoRequest request) {

        Poliza poliza = buscarPoliza(polizaId);

        if (poliza.getTipo() != TipoPoliza.COLECTIVA) {
            throw new ReglaNegocioException(
                    "Solo se pueden agregar riesgos a pólizas colectivas");
        }

        if (poliza.getEstado() == EstadoPoliza.CANCELADA) {
            throw new ReglaNegocioException(
                    "No se pueden agregar riesgos a una póliza cancelada");
        }

        Riesgo riesgo = new Riesgo(
                poliza,
                request.direccionInmueble().trim(),
                request.arrendatario().trim(),
                request.arrendador().trim()
        );

        riesgoRepository.saveAndFlush(riesgo);
        coreAdapter.notificarActualizacion(polizaId);

        return RiesgoResponse.desde(riesgo);
    }

    public RiesgoResponse cancelar(Long id) {
        Riesgo riesgo = riesgoRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Riesgo no encontrado: " + id));

        if (riesgo.getEstado() == EstadoRiesgo.CANCELADO) {
            return RiesgoResponse.desde(riesgo);
        }

        riesgo.setEstado(EstadoRiesgo.CANCELADO);

        riesgoRepository.saveAndFlush(riesgo);
        coreAdapter.notificarActualizacion(
                riesgo.getPoliza().getId());

        return RiesgoResponse.desde(riesgo);
    }

    private Poliza buscarPoliza(Long id) {
        return polizaRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Póliza no encontrada: " + id));
    }
}