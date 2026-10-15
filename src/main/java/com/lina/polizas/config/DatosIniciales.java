package com.lina.polizas.config;

import com.lina.polizas.model.Poliza;
import com.lina.polizas.model.Riesgo;
import com.lina.polizas.model.TipoPoliza;
import com.lina.polizas.repository.PolizaRepository;
import com.lina.polizas.repository.RiesgoRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Profile("demo")
public class DatosIniciales implements CommandLineRunner {

    private final PolizaRepository polizaRepository;
    private final RiesgoRepository riesgoRepository;

    public DatosIniciales(
            PolizaRepository polizaRepository,
            RiesgoRepository riesgoRepository) {
        this.polizaRepository = polizaRepository;
        this.riesgoRepository = riesgoRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (polizaRepository.count() > 0) {
            return;
        }

        Poliza individual = polizaRepository.save(
                new Poliza(
                        TipoPoliza.INDIVIDUAL,
                        LocalDate.of(2026, 10, 15),
                        12,
                        new BigDecimal("1000000.00")
                )
        );

        Poliza colectiva = polizaRepository.save(
                new Poliza(
                        TipoPoliza.COLECTIVA,
                        LocalDate.of(2026, 10, 15),
                        12,
                        new BigDecimal("2000000.00")
                )
        );

        riesgoRepository.save(new Riesgo(
                individual,
                "Calle 100 # 15-20",
                "Ana Ejemplo",
                "Luis Ejemplo"
        ));

        riesgoRepository.save(new Riesgo(
                colectiva,
                "Carrera 30 # 45-10",
                "Carlos Ejemplo",
                "Laura Ejemplo"
        ));
    }
}