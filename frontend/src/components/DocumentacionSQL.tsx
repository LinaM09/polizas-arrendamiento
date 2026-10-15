export default function DocumentacionSQL() {
  return (
    <details className="doc-bloque">
      <summary>Módulo 03 · Optimización de bases de datos</summary>

      <div className="doc-contenido">
        <span className="doc-etiqueta">Análisis propuesto</span>

        <p>
          La consulta une orders, con 10 millones de registros,
          y customers, con 500.000, para obtener los pedidos
          de clientes cuyo país es México.
        </p>

        <h3>1. Diseñar índices para el filtro y la unión</h3>

        <p>
          Primero revisaría los índices existentes para evitar
          duplicarlos. Evaluaría los siguientes:
        </p>

        <pre style={{ overflowX: 'auto', padding: '16px' }}>
          <code>{`CREATE INDEX idx_customers_country_id
ON customers (country, customer_id);

CREATE INDEX idx_orders_customer
ON orders (customer_id);`}</code>
        </pre>

        <p>
          El primero permite localizar clientes por país y obtener
          su identificador. El segundo puede facilitar la búsqueda
          de los pedidos asociados a esos clientes.
        </p>

        <p>
          Su beneficio depende de la selectividad: si México
          representa una gran proporción de los datos, un recorrido
          completo con hash join podría resultar más eficiente.
          También mediría el costo adicional de almacenamiento
          y mantenimiento durante las escrituras.
        </p>

        <h3>2. Actualizar estadísticas y revisar el plan real</h3>

        <p>
          Compararía filas estimadas y reales, lecturas lógicas,
          tiempo, acceso a tablas, método de unión y uso de memoria
          o espacio temporal. Actualizaría estadísticas si están
          desactualizadas y evaluaría histogramas cuando exista
          una distribución desigual de países.
        </p>

        <p>
          En Oracle utilizaría DBMS_STATS para mantener estadísticas
          y DBMS_XPLAN.DISPLAY_CURSOR para inspeccionar el plan
          del cursor ejecutado, con estadísticas de ejecución
          recopiladas cuando corresponda.
        </p>

        <p>
          Esto ayuda al optimizador a elegir un plan adecuado.
          Evitaría forzar índices o métodos de unión mediante hints
          sin evidencia de que mejoran el comportamiento.
        </p>

        <h3>3. Evitar recalcular una consulta frecuente</h3>

        <p>
          Si el negocio admite cierto retraso en los datos,
          evaluaría una vista materializada que almacene el resultado
          de la unión y el filtro, con una estrategia de refresco
          acorde con la frecuencia de cambios.
        </p>

        <p>
          Esto reduce el trabajo de consultas repetidas, a cambio
          de espacio y costo de actualización. El refresco rápido
          requiere verificar las restricciones del motor y los
          registros necesarios; no asumiría que siempre es posible.
          La reescritura automática de la consulta también debe
          comprobarse y configurarse cuando corresponda.
        </p>

        <h3>Cómo validaría la mejora</h3>

        <p>
          Mediría antes y después con volúmenes y distribución
          representativos, manteniendo el mismo resultado funcional.
          Compararía tiempo, lecturas, consumo de recursos y efecto
          sobre inserciones y actualizaciones.
        </p>

        <aside className="doc-nota">
          <strong>Decisiones que requieren contexto</strong>

          <p>
            Particionar orders por fecha no garantiza mejorar
            esta consulta porque no existe un filtro temporal.
            Agregar paginación reduce lo transferido por página,
            pero cambia la forma de consumir el resultado.
            Ninguna de estas medidas reemplaza el análisis del plan.
          </p>
        </aside>
      </div>
    </details>
  )
}