export default function DiagramaArquitectura() {
  const nodos = [
    { x: 280, y: 20, titulo: 'Frontend', detalle: 'React + TypeScript' },
    { x: 280, y: 120, titulo: 'API Gateway', detalle: 'Acceso y enrutamiento' },
    { x: 100, y: 240, titulo: 'Servicio de Pólizas', detalle: 'Vigencia y renovación' },
    { x: 460, y: 240, titulo: 'Servicio de Riesgos', detalle: 'Arrendamientos asegurados' },
    { x: 100, y: 380, titulo: 'Base de datos', detalle: 'Negocio, operaciones y outbox' },
    { x: 460, y: 380, titulo: 'Adaptador CORE', detalle: 'Integración de modificaciones' },
    { x: 460, y: 500, titulo: 'Capa media WebLogic', detalle: 'Servicio agnóstico de edición' },
    { x: 460, y: 620, titulo: 'CORE de seguros', detalle: 'Sistema transaccional legado' },
    { x: 100, y: 500, titulo: 'Publicador y mensajería', detalle: 'Entrega de eventos del outbox' },
    { x: 100, y: 620, titulo: 'Notificaciones', detalle: 'Correo y SMS' },
  ]

  return (
    <details className="doc-bloque">
      <summary>09. Diagrama de componentes</summary>

      <div className="doc-contenido">
        <span className="doc-etiqueta">Diseño propuesto</span>

        <p>
          Pólizas y Riesgos son módulos de una misma aplicación
          inicialmente. Las flechas indican el flujo principal;
          las respuestas HTTP regresan por la misma conexión.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <svg
            viewBox="0 0 840 740"
            role="img"
            aria-labelledby="diagrama-titulo diagrama-descripcion"
            style={{
              display: 'block',
              width: '100%',
              minWidth: '600px',
              height: 'auto',
            }}
          >
            <title id="diagrama-titulo">
              Arquitectura propuesta de la plataforma de pólizas
            </title>

            <desc id="diagrama-descripcion">
              El frontend accede al Gateway, que dirige las peticiones
              a Pólizas y Riesgos. Ambos módulos usan la base de datos
              y el adaptador CORE. El adaptador consume WebLogic,
              que actualiza el CORE. El publicador lee el outbox
              y entrega eventos a Notificaciones mediante mensajería.
            </desc>

            <defs>
              <marker
                id="flecha-arquitectura"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 Z" fill="#50846a" />
              </marker>
            </defs>

            <rect
              x="60"
              y="215"
              width="720"
              height="115"
              rx="18"
              fill="#f0f6f2"
              stroke="#b7cfbf"
              strokeDasharray="6 4"
            />

            <g
              fill="none"
              stroke="#50846a"
              strokeWidth="2"
              markerEnd="url(#flecha-arquitectura)"
            >
              <path d="M 420 90 V 120" />
              <path d="M 420 190 V 210 H 240 V 240" />
              <path d="M 420 210 H 600 V 240" />

              <path d="M 190 310 V 380" />
              <path d="M 550 310 V 345 H 310 V 380" />

              <path d="M 290 310 V 355 H 550 V 380" />
              <path d="M 650 310 V 380" />

              <path d="M 600 450 V 500" />
              <path d="M 600 570 V 620" />

              <path d="M 240 450 V 500" />
              <path d="M 240 570 V 620" />
            </g>

            {nodos.map((nodo) => (
              <g key={nodo.titulo}>
                <rect
                  x={nodo.x}
                  y={nodo.y}
                  width="280"
                  height="70"
                  rx="12"
                  fill="#ffffff"
                  stroke="#b9d0c1"
                />

                <text
                  x={nodo.x + 140}
                  y={nodo.y + 28}
                  textAnchor="middle"
                  fill="#214b36"
                  fontSize="15"
                  fontWeight="700"
                >
                  {nodo.titulo}
                </text>

                <text
                  x={nodo.x + 140}
                  y={nodo.y + 50}
                  textAnchor="middle"
                  fill="#65796b"
                  fontSize="11"
                >
                  {nodo.detalle}
                </text>
              </g>
            ))}

            <text
              x="420"
              y="730"
              textAnchor="middle"
              fill="#65796b"
              fontSize="12"
            >
              El publicador lee eventos persistidos; las notificaciones
              se procesan de forma asíncrona.
            </text>
          </svg>
        </div>

        <aside className="doc-nota">
          <strong>Consistencia entre sistemas</strong>

          <p>
            La base de datos local y el CORE no comparten una
            transacción atómica. Las operaciones pendientes,
            la idempotencia y la reconciliación permiten recuperar
            fallos entre ambos sistemas.
          </p>
        </aside>
      </div>
    </details>
  )
}