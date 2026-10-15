import './css/Documentacion.css'
import OperacionArquitectura from './OperacionArquitectura'
import DiagramaArquitectura from './DiagramaArquitectura'
import DocumentacionSQL from './DocumentacionSQL'
import DocumentacionGit from './DocumentacionGit'
import ModalLiderazgo from './ModalLiderazgo'

export default function Documentacion() {
  return (
    <section
      className="documentacion"
      aria-labelledby="titulo-documentacion"
    >
      <div className="documentacion-intro">
        <span className="doc-etiqueta">Módulo 01 · Diseño de sistema</span>

        <h2 id="titulo-documentacion">
          Arquitectura y decisiones técnicas
        </h2>

        <p>
          Una plataforma para gestionar pólizas de arrendamiento,
          integrar el CORE de seguros y mantener trazabilidad
          de las operaciones.
        </p>
      </div>

      <div className="doc-resumen">
        <article>
          <span>Negocio</span>
          <strong>Pólizas y riesgos</strong>
          <p>Reglas diferentes para individuales y colectivas.</p>
        </article>

        <article>
          <span>Integración</span>
          <strong>CORE mediante WebLogic</strong>
          <p>Adaptador para centralizar la comunicación externa.</p>
        </article>

        <article>
          <span>Implementación</span>
          <strong>Spring Boot + React</strong>
          <p>API por capas y frontend conectado con datos reales.</p>
        </article>
      </div>

      <details className="doc-bloque" open>
        <summary>01. Arquitectura de alto nivel</summary>

        <div className="doc-contenido">
          <span className="doc-etiqueta">Diseño propuesto</span>

          <p>
            El frontend accede mediante un API Gateway, que centraliza
            autenticación, límites de solicitudes y enrutamiento.
            La autorización y las reglas del negocio también se
            validan dentro de la aplicación.
          </p>

          <p>
            El módulo de pólizas administra vigencia, valores,
            estados y renovación. El módulo de riesgos gestiona
            los arrendamientos asegurados y las restricciones
            de cada tipo de póliza.
          </p>

          <p>
            Inicialmente, ambos módulos pueden desplegarse en una
            misma aplicación con una base de datos relacional.
            Esto permite modificar una póliza y sus riesgos dentro
            de una transacción local, sin introducir transacciones
            distribuidas entre ellos.
          </p>

          <p>
            Todas las operaciones que modifican estados pasan por
            un adaptador que consume el servicio agnóstico de
            edición expuesto por la capa media en WebLogic.
            Las notificaciones se procesan de forma asíncrona.
          </p>
        </div>
      </details>

      <details className="doc-bloque">
        <summary>02. Tres patrones y su justificación</summary>

        <div className="doc-contenido">
          <article className="doc-patron">
            <h3>Arquitectura hexagonal</h3>

            <p>
              El dominio define puertos mediante interfaces.
              Los adaptadores implementan la persistencia y la
              comunicación con WebLogic, manteniendo las reglas
              del negocio independientes de esas tecnologías.
            </p>

            <p>
              <strong>Justificación:</strong> permite cambiar una
              integración y probar las reglas sin depender
              del CORE real.
            </p>
          </article>

          <article className="doc-patron">
            <h3>Arquitectura orientada a eventos</h3>

            <p>
              Una creación o renovación confirmada genera un evento.
              El componente de notificaciones lo consume para enviar
              correo o SMS sin retrasar la operación principal.
            </p>

            <p>
              Mediante transactional outbox, el cambio de negocio
              y el evento pendiente se guardan en la misma
              transacción local. Un publicador entrega los eventos
              al intermediario de mensajes con reintentos.
            </p>

            <p>
              El consumidor controla los identificadores procesados
              para evitar duplicados ante reentregas. Los errores
              persistentes pasan a una cola de mensajes fallidos.
              Cuando el proveedor lo permita, se utiliza también
              una clave de idempotencia en el envío.
            </p>

            <p>
              <strong>Justificación:</strong> una falla del proveedor
              de correo o SMS no impide gestionar una póliza.
            </p>
          </article>

          <article className="doc-patron">
            <h3>API Gateway</h3>

            <p>
              Proporciona un punto de entrada para autenticación,
              límites de solicitudes y enrutamiento hacia
              los componentes de la plataforma.
            </p>

            <p>
              <strong>Justificación:</strong> concentra controles
              comunes y permite cambiar la ubicación de los
              servicios sin modificar el frontend.
            </p>
          </article>
        </div>
      </details>

      <details className="doc-bloque">
        <summary>03. Modelo de datos principal</summary>

        <div className="doc-contenido">
          <span className="doc-etiqueta">Diseño propuesto</span>

          <div
            className="doc-tabla"
            role="region"
            aria-label="Modelo de datos"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Entidad</th>
                  <th scope="col">Datos principales</th>
                  <th scope="col">Relación o propósito</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>Póliza</td>
                  <td>
                    ID, tipo, estado, tomador, fechas de vigencia,
                    duración inicial y versión del registro.
                  </td>
                  <td>
                    Agrupa los riesgos y conserva la duración
                    utilizada en las renovaciones.
                  </td>
                </tr>

                <tr>
                  <td>Riesgo</td>
                  <td>
                    ID, póliza, inmueble, asegurado, beneficiario,
                    estado, canon mensual y prima.
                  </td>
                  <td>
                    Representa un arrendamiento asegurado.
                    Pertenece a una póliza.
                  </td>
                </tr>

                <tr>
                  <td>Persona o empresa</td>
                  <td>
                    ID, tipo y número de identificación,
                    nombre y datos de contacto.
                  </td>
                  <td>
                    Puede participar como tomador,
                    asegurado o beneficiario.
                  </td>
                </tr>

                <tr>
                  <td>Renovación</td>
                  <td>
                    ID, póliza, periodos anterior y nuevo,
                    IPC aplicado, fuente del IPC,
                    valores anteriores y nuevos.
                  </td>
                  <td>
                    Conserva el historial y permite identificar
                    una renovación por póliza y periodo.
                  </td>
                </tr>

                <tr>
                  <td>Operación de integración</td>
                  <td>
                    ID, póliza, acción, clave de idempotencia,
                    estado, intentos y referencia del CORE.
                  </td>
                  <td>
                    Permite rastrear y reconciliar
                    cambios entre la plataforma y el CORE.
                  </td>
                </tr>

                <tr>
                  <td>Evento pendiente</td>
                  <td>
                    ID, tipo de evento, entidad relacionada,
                    contenido, fecha, estado e intentos.
                  </td>
                  <td>
                    Implementa el outbox para publicar
                    eventos de forma recuperable.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Relaciones y restricciones</h3>

          <ul>
            <li>
              Una póliza individual tiene exactamente un riesgo.
              Una colectiva tiene uno o varios riesgos al emitirse.
            </li>
            <li>
              El arrendatario es el asegurado y el arrendador
              es el beneficiario del riesgo.
            </li>
            <li>
              En una póliza individual, el tomador es el arrendatario.
              En una colectiva, el tomador corresponde a la
              inmobiliaria o administración.
            </li>
            <li>
              Los riesgos cancelados se conservan como historial.
              Cancelar una póliza cancela todos sus riesgos.
            </li>
            <li>
              La prima de cada riesgo corresponde a su canon
              mensual multiplicado por los meses de vigencia,
              siguiendo la fórmula del enunciado.
            </li>
          </ul>

          <aside className="doc-nota">
            <strong>Supuesto sobre pólizas colectivas</strong>

            <p>
              El enunciado no detalla cómo consolidar cánones de
              varios riesgos. Para el diseño completo propongo
              registrar canon y prima por riesgo y calcular los
              totales de la póliza sumando sus riesgos activos.
              Esta interpretación debe validarse con negocio.
            </p>
          </aside>

          <aside className="doc-nota">
            <strong>Alcance del modelo implementado</strong>

            <p>
              La API simplificada guarda canon y prima directamente
              en la póliza. Los participantes del riesgo se
              representan mediante nombres, sin entidades separadas.
              El tomador, el historial de renovaciones y las tablas
              de integración y outbox pertenecen al diseño propuesto.
            </p>
          </aside>
        </div>
      </details>

      <details className="doc-bloque">
        <summary>04. Alcance de la implementación práctica</summary>

        <div className="doc-contenido">
          <span className="doc-etiqueta">Implementado</span>

          <ul>
            <li>API Spring Boot con controllers, services y repositories.</li>
            <li>Entidades Póliza y Riesgo con persistencia H2 en disco.</li>
            <li>Seis endpoints de consulta y gestión.</li>
            <li>Validaciones de entrada y reglas del negocio.</li>
            <li>Protección mediante la API key exigida por la prueba.</li>
            <li>Frontend React y TypeScript conectado con la API.</li>
            <li>Llamada HTTP al mock del CORE con tiempo límite.</li>
          </ul>

          <p>
            POST /core-mock/evento registra el intento de
            actualización en los logs. No modifica un CORE real.
          </p>

          <p>
            La implementación utiliza arquitectura por capas y
            un adaptador HTTP. No implementa todavía una arquitectura
            hexagonal completa con puertos independientes
            del framework.
          </p>

          <aside className="doc-nota">
            <strong>Componentes del diseño completo</strong>

            <p>
              El API Gateway, la integración real con WebLogic,
              la mensajería, transactional outbox y las
              notificaciones no están desplegados en el ejercicio.
              La renovación implementada se ejecuta mediante
              una petición; todavía no existe un proceso automático.
            </p>
          </aside>
        </div>
      </details>
      <OperacionArquitectura />
      <DiagramaArquitectura />
      <DocumentacionSQL />
      <DocumentacionGit />
      <ModalLiderazgo />
    </section>
  )
}