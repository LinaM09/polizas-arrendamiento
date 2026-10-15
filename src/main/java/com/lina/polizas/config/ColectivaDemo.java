package com.lina.polizas.config;

import com.lina.polizas.model.Poliza;
import com.lina.polizas.model.TipoPoliza;
import com.lina.polizas.repository.PolizaRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Component
@Profile("demo")
public class ColectivaDemo implements CommandLineRunner {

    private final PolizaRepository polizaRepository;

    public ColectivaDemo(PolizaRepository polizaRepository) {
        this.polizaRepository = polizaRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!Arrays.asList(args).contains("--demo.agregar-colectiva")) {
            return;
        }

        polizaRepository.save(new Poliza(
                TipoPoliza.COLECTIVA,
                LocalDate.of(2026, 10, 15),
                12,
                new BigDecimal("1500000.00")
        ));
    }
}