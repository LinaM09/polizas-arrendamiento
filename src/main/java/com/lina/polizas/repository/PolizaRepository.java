package com.lina.polizas.repository;

import com.lina.polizas.model.Poliza;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PolizaRepository
        extends JpaRepository<Poliza, Long>,
                JpaSpecificationExecutor<Poliza> {
}