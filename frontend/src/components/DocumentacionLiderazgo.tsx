export default function DocumentacionLiderazgo() {
  return (
    <details className="doc-bloque" open>
      <summary>Módulo 05 · Liderazgo técnico y gestión</summary>

      <div className="doc-contenido">
        <span className="doc-etiqueta">Propuesta de actuación</span>

        <p>
          El equipo tiene ocho desarrolladores, deuda técnica
          reportada del 40% en servicios clave, diez incidentes
          críticos en el último mes y una funcionalidad solicitada
          en tres semanas. Priorizaría estabilizar el servicio
          y acordar una entrega viable.
        </p>

        <h3>1. Cinco prioridades en las primeras dos semanas</h3>

        <ol>
          <li>
            <strong>Contener los incidentes críticos.</strong>{' '}
            Revisaría impacto, recurrencia y causas. Asignaría
            responsables y comprobaría monitoreo, respuesta
            y mecanismos de reversión.
          </li>

          <li>
            <strong>Acordar el alcance mínimo con negocio.</strong>{' '}
            Definiría el flujo de mayor valor para las tres semanas,
            criterios de aceptación, dependencias y elementos
            que pueden entregarse después.
          </li>

          <li>
            <strong>Priorizar la deuda por riesgo.</strong>{' '}
            Validaría cómo se calculó el 40% y atendería primero
            la deuda relacionada con incidentes, seguridad
            y bloqueos de la entrega.
          </li>

          <li>
            <strong>Establecer controles de calidad.</strong>{' '}
            Durante la primera semana acordaría revisión de código,
            pruebas de flujos críticos e integración continua
            que bloquee cambios con fallos.
          </li>

          <li>
            <strong>Acompañar y revisar el progreso.</strong>{' '}
            Asignaría referentes a los dos juniors, tareas acotadas
            y sesiones de trabajo conjunto. Revisaría resultados,
            capacidad y riesgos al finalizar cada semana.
          </li>
        </ol>

        <h3>2. Organización del equipo</h3>

        <p>
          Como distribución inicial, asignaría tres desarrolladores
          a estabilización y deuda prioritaria, y cinco a la
          funcionalidad. Ajustaría esta distribución según
          los incidentes y las habilidades disponibles.
        </p>

        <p>
          Cada frente tendría un referente con experiencia.
          Los juniors trabajarían acompañados y no asumirían
          solos cambios críticos de producción.
        </p>

        <p>
          Mantendría un único tablero, tareas pequeñas, límites
          de trabajo en curso y espacios diarios para revisión.
          Reservaría capacidad para incidentes según el historial,
          sin planificar al equipo al 100%.
        </p>

        <p>
          Utilizaría revisiones cruzadas y documentación breve
          para compartir conocimiento y evitar dependencias
          de una sola persona.
        </p>

        <h3>3. Métricas de desempeño del área</h3>

        <ul>
          <li>
            <strong>Confiabilidad:</strong> incidentes por severidad,
            recurrencia, disponibilidad y tiempo de recuperación.
          </li>
          <li>
            <strong>Entrega:</strong> tiempo del commit a producción,
            frecuencia de despliegues y porcentaje de despliegues
            que provocan fallos.
          </li>
          <li>
            <strong>Flujo:</strong> tiempo de ciclo, trabajo bloqueado
            y espera para revisión.
          </li>
          <li>
            <strong>Calidad:</strong> defectos en producción
            y cobertura de escenarios críticos.
          </li>
          <li>
            <strong>Valor y aprendizaje:</strong> cumplimiento
            de criterios de aceptación, resultado de negocio
            y progreso del acompañamiento técnico.
          </li>
        </ul>

        <p>
          Establecería una línea base y revisaría tendencias.
          Las métricas servirían para mejorar el trabajo del equipo,
          sin clasificar personas por commits, líneas de código
          o puntos de historia.
        </p>

        <h3>4. Prácticas técnicas obligatorias</h3>

        <ul>
          <li>
            Pull requests pequeños y revisados por otra persona.
          </li>
          <li>
            Pruebas automáticas de reglas y flujos críticos,
            incluyendo regresiones para los defectos corregidos.
          </li>
          <li>
            Integración continua con compilación, lint,
            pruebas y controles de seguridad.
          </li>
          <li>
            Protección de la rama principal y secretos
            fuera del código fuente.
          </li>
          <li>
            Monitoreo, logs útiles, instrucciones de operación
            y mecanismos de reversión.
          </li>
          <li>
            Análisis de incidentes sin culpabilizar personas,
            con acciones, responsables y seguimiento.
          </li>
        </ul>

        <h3>5. Gestión de la presión del negocio</h3>

        <p>
          Presentaría opciones concretas con alcance, fecha,
          dependencias y riesgos. Si todo el alcance no cabe
          en tres semanas, propondría una entrega funcional menor
          y una segunda entrega, manteniendo los controles
          de seguridad y las pruebas críticas.
        </p>

        <p>
          Mostraría avances mediante demostraciones semanales
          y comunicaría bloqueos temprano. Cuando corresponda,
          utilizaría entregas graduales y feature flags,
          con monitoreo y reversión.
        </p>

        <p>
          Ante un riesgo crítico, acordaría la decisión con
          los responsables de producto y del servicio, explicando
          su impacto. No basaría el compromiso en horas extra
          sostenidas ni en omitir controles esenciales.
        </p>
      </div>
    </details>
  )
}