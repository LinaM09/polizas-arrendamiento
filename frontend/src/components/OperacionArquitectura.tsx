export default function OperacionArquitectura() {
  return (
    <>
      <details className="doc-bloque">
        <summary>05. Renovación automática e integración</summary>

        <div className="doc-contenido">
          <span className="doc-etiqueta">Diseño propuesto</span>

          <h3>Proceso de renovación</h3>

          <ol>
            <li>
              Un proceso programado identifica las pólizas que
              alcanzan la fecha de renovación, según la zona
              horaria y las reglas acordadas con negocio.
            </li>
            <li>
              Valida que la póliza no esté cancelada, que cumpla
              las condiciones de renovación y que exista un IPC
              aprobado para el periodo. Si falta el IPC, deja
              la operación pendiente y genera una alerta.
            </li>
            <li>
              Registra una operación con una clave única por
              póliza y periodo para evitar renovaciones duplicadas
              entre ejecuciones o instancias.
            </li>
            <li>
              Calcula el nuevo canon aplicando el factor
              1 + IPC / 100, redondea a dos decimales y calcula
              la prima según los meses de vigencia inicial.
              El nuevo periodo comienza al terminar el anterior.
            </li>
            <li>
              Envía la modificación al servicio agnóstico
              de edición mediante el adaptador de WebLogic,
              utilizando la misma clave de idempotencia.
            </li>
            <li>
              Tras confirmar el resultado del CORE, guarda
              el nuevo estado, el historial y el evento de
              notificación en una transacción local.
            </li>
          </ol>

          <h3>Resultado incierto del CORE</h3>

          <p>
            Si ocurre un timeout, no se interpreta automáticamente
            como rechazo: el CORE podría haber aplicado el cambio.
            La operación queda pendiente de confirmación y se
            consulta su estado mediante la referencia o clave
            de idempotencia.
          </p>

          <p>
            Si el CORE no ofrece consulta de estado ni idempotencia,
            se requiere reconciliación y revisión operativa antes
            de repetir una modificación. La capacidad debe acordarse
            con el equipo responsable de la integración.
          </p>

          <aside className="doc-nota">
            <strong>Alcance actual</strong>

            <p>
              La API práctica renueva mediante una petición manual.
              Su transacción revierte los cambios locales cuando
              falla la llamada al mock, pero no puede revertir
              una operación que un sistema externo ya haya aplicado.
              El proceso programado y la reconciliación son parte
              de esta propuesta.
            </p>
          </aside>
        </div>
      </details>

      <details className="doc-bloque">
        <summary>06. Escalabilidad y disponibilidad</summary>

        <div className="doc-contenido">
          <span className="doc-etiqueta">Diseño propuesto</span>

          <h3>Escalabilidad</h3>

          <p>
            Desplegaría varias instancias sin estado de la API
            detrás de un balanceador. Ajustaría su número según
            latencia, tráfico y consumo de recursos.
          </p>

          <p>
            Las consultas usarían paginación e índices acordes
            con los filtros. El pool de conexiones y la concurrencia
            hacia el CORE tendrían límites para proteger ambos
            sistemas. Los consumidores de notificaciones podrían
            escalar independientemente.
          </p>

          <h3>Disponibilidad 24/7</h3>

          <p>
            Propondría instancias distribuidas en zonas de
            disponibilidad, base de datos con alta disponibilidad,
            comprobaciones de salud y despliegues graduales.
            Los respaldos y las pruebas de restauración completarían
            el plan de recuperación.
          </p>

          <p>
            Acordaría con negocio objetivos medibles de disponibilidad,
            tiempo de recuperación y pérdida de datos tolerable.
            La disponibilidad también depende de WebLogic y del CORE;
            las operaciones pendientes deben ser visibles y
            recuperables durante sus interrupciones.
          </p>

          <h3>Concurrencia</h3>

          <p>
            Utilizaría control de versión del agregado y restricciones
            únicas por póliza y periodo. Las modificaciones de pólizas
            y riesgos seguirían un criterio común de bloqueo o versión
            para evitar que una cancelación y un alta concurrentes
            dejen riesgos activos en una póliza cancelada.
          </p>

          <aside className="doc-nota">
            <strong>Persistencia del ejercicio</strong>

            <p>
              H2 en disco facilita ejecutar la demostración local.
              Para un despliegue con múltiples instancias utilizaría
              una base de datos de servidor compartida, migraciones
              versionadas y controles de concurrencia.
            </p>
          </aside>
        </div>
      </details>

      <details className="doc-bloque">
        <summary>07. Logs, observabilidad y tolerancia a fallos</summary>

        <div className="doc-contenido">
          <span className="doc-etiqueta">Diseño propuesto</span>

          <h3>Logs y observabilidad</h3>

          <p>
            Registraría logs estructurados con identificador
            de correlación, operación, póliza, duración y resultado.
            Evitaría contraseñas, API keys y datos personales
            innecesarios.
          </p>

          <p>
            Las trazas permitirían seguir la petición desde el
            Gateway hasta WebLogic. Mediría latencia p95, tasa
            de errores, disponibilidad, conexiones, renovaciones
            fallidas, operaciones pendientes y retraso de las colas.
          </p>

          <p>
            Configuraría alertas sobre el incumplimiento de los
            objetivos del servicio y mantendría una auditoría
            de cambios con actor, fecha y valores anteriores
            y nuevos.
          </p>

          <h3>Tolerancia a fallos</h3>

          <p>
            Aplicaría tiempos límite, circuit breaker y aislamiento
            de recursos en las integraciones. Los reintentos serían
            limitados, con espera exponencial y variación aleatoria,
            únicamente para errores transitorios y operaciones
            cuya repetición sea segura.
          </p>

          <p>
            Los errores de negocio no se reintentan automáticamente.
            Las notificaciones persistentes usarían outbox,
            control de duplicados y cola de mensajes fallidos.
            Las operaciones con resultado incierto se reconciliarían.
          </p>
        </div>
      </details>

      <details className="doc-bloque">
        <summary>08. Versionamiento de APIs</summary>

        <div className="doc-contenido">
          <span className="doc-etiqueta">Diseño propuesto</span>

          <p>
            Publicaría el contrato inicial bajo /api/v1 y mantendría
            documentación OpenAPI. Los cambios compatibles, como
            campos opcionales adicionales, conservarían la versión.
          </p>

          <p>
            Los cambios incompatibles tendrían una nueva versión,
            un periodo de coexistencia y una fecha de retiro
            comunicada a los consumidores. Las pruebas de contrato
            ayudarían a detectar incompatibilidades.
          </p>

          <aside className="doc-nota">
            <strong>Rutas de la implementación</strong>

            <p>
              El backend del ejercicio conserva las rutas solicitadas,
              como /polizas. El prefijo /api del frontend corresponde
              al proxy de desarrollo de Vite; no representa
              un versionamiento implementado en Java.
            </p>
          </aside>
        </div>
      </details>
    </>
  )
}