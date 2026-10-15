package com.lina.polizas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "riesgos")
public class Riesgo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "poliza_id", nullable = false)
    private Poliza poliza;

    @Column(nullable = false)
    private String direccionInmueble;

    @Column(nullable = false)
    private String arrendatario;

    @Column(nullable = false)
    private String arrendador;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoRiesgo estado = EstadoRiesgo.ACTIVO;

    protected Riesgo() {
    }

    public Riesgo(
            Poliza poliza,
            String direccionInmueble,
            String arrendatario,
            String arrendador) {
        this.poliza = poliza;
        this.direccionInmueble = direccionInmueble;
        this.arrendatario = arrendatario;
        this.arrendador = arrendador;
    }

    public Long getId() {
        return id;
    }

    public Poliza getPoliza() {
        return poliza;
    }

    public String getDireccionInmueble() {
        return direccionInmueble;
    }

    public String getArrendatario() {
        return arrendatario;
    }

    public String getArrendador() {
        return arrendador;
    }

    public EstadoRiesgo getEstado() {
        return estado;
    }

    public void setEstado(EstadoRiesgo estado) {
        this.estado = estado;
    }
}