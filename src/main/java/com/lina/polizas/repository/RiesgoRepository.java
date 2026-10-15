package com.lina.polizas.repository;

import com.lina.polizas.model.Riesgo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RiesgoRepository extends JpaRepository<Riesgo, Long> {

    List<Riesgo> findByPolizaId(Long polizaId);

    long countByPolizaId(Long polizaId);
}