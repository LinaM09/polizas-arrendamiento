package com.lina.polizas.service;

import com.lina.polizas.dto.PolizaResponse;
import com.lina.polizas.exception.RecursoNoEncontradoException;
import com.lina.polizas.exception.ReglaNegocioException;
import com.lina.polizas.integration.CoreAdapter;
import com.lina.polizas.model.*;
import com.lina.polizas.repository.PolizaRepository;
import com.lina.polizas.repository.RiesgoRepository;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional
public class PolizaService {

    private final PolizaRepository polizaRepository;
    private final RiesgoRepository riesgoRepository;
    private final CoreAdapter coreAdapter;

    public PolizaService(
            PolizaRepository polizaRepository,
            RiesgoRepository riesgoRepository,
            CoreAdapter coreAdapter) {
        this.polizaRepository = polizaRepository;
        this.riesgoRepository = riesgoRepository;
        this.coreAdapter = coreAdapter;
    }

    @Transactional(readOnly = true)
    public List<PolizaResponse> listar(
            TipoPoliza tipo,
            EstadoPoliza estado) {

        Specification<Poliza> filtros = (root, query, cb) -> {
            var condiciones =
                    new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();

            if (tipo != null) {
                condiciones.add(cb.equal(root.get("tipo"), tipo));
            }

            if (estado != null) {
                condiciones.add(cb.equal(root.get("estado"), estado));
            }

            return cb.and(condiciones.toArray(
                    jakarta.persistence.criteria.Predicate[]::new));
        };

        return polizaRepository.findAll(filtros)
                .stream()
                .map(PolizaResponse::desde)
                .toList();
    }

    public PolizaResponse renovar(Long id, BigDecimal ipc) {
        Poliza poliza = buscarPoliza(id);

        if (poliza.getEstado() == EstadoPoliza.CANCELADA) {
            throw new ReglaNegocioException(
                    "No se puede renovar una póliza cancelada");
        }

        if (ipc == null
                || ipc.compareTo(BigDecimal.ZERO) < 0
                || ipc.compareTo(new BigDecimal("100")) > 0) {
            throw new ReglaNegocioException(
                    "El IPC debe estar entre 0 y 100");
        }

        BigDecimal factor = BigDecimal.ONE.add(
                ipc.movePointLeft(2));

        BigDecimal nuevoCanon = poliza.getCanonMensual()
                .multiply(factor)
                .setScale(2, RoundingMode.HALF_UP);

        poliza.setCanonMensual(nuevoCanon);
        poliza.setPrima(nuevoCanon.multiply(
                BigDecimal.valueOf(poliza.getMesesVigencia())));

        poliza.setFechaInicio(poliza.getFechaFin());
        poliza.setFechaFin(poliza.getFechaInicio()
                .plusMonths(poliza.getMesesVigencia()));

        poliza.setEstado(EstadoPoliza.RENOVADA);

        polizaRepository.saveAndFlush(poliza);
        coreAdapter.notificarActualizacion(id);

        return PolizaResponse.desde(poliza);
    }

    public PolizaResponse cancelar(Long id) {
        Poliza poliza = buscarPoliza(id);

        if (poliza.getEstado() == EstadoPoliza.CANCELADA) {
            return PolizaResponse.desde(poliza);
        }

        poliza.setEstado(EstadoPoliza.CANCELADA);

        var riesgos = riesgoRepository.findByPolizaId(id);

        riesgos.forEach(riesgo ->
                riesgo.setEstado(EstadoRiesgo.CANCELADO));

        riesgoRepository.saveAll(riesgos);
        polizaRepository.saveAndFlush(poliza);

        coreAdapter.notificarActualizacion(id);

        return PolizaResponse.desde(poliza);
    }

    private Poliza buscarPoliza(Long id) {
        return polizaRepository.findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Póliza no encontrada: " + id));
    }
}