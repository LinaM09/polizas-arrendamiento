import { useEffect, useState } from 'react'
import { listarRiesgos } from '../services/polizas.service'
import type { Riesgo } from '../types/poliza'
import AgregarRiesgo from './AgregarRiesgo'
import CancelarRiesgo from './CancelarRiesgo'

interface Props {
  polizaId: number
  permiteAgregar?: boolean
  onCerrar: () => void
}

type Accion =
  | { tipo: 'agregar' }
  | { tipo: 'cancelar'; riesgoId: number }
  | null

export default function RiesgosPoliza({
  polizaId,
  permiteAgregar = false,
  onCerrar,
}: Props) {
  const [riesgos, setRiesgos] = useState<Riesgo[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [accion, setAccion] = useState<Accion>(null)
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let activo = true

    async function cargar() {
      setCargando(true)
      setError('')

      try {
        const datos = await listarRiesgos(polizaId)
        if (activo) setRiesgos(datos)
      } catch (error: unknown) {
        if (activo) {
          setError(
            error instanceof Error
              ? error.message
              : 'No fue posible cargar los riesgos',
          )
        }
      } finally {
        if (activo) setCargando(false)
      }
    }

    void cargar()

    return () => {
      activo = false
    }
  }, [polizaId, version])

  function actualizar(mensajeExito: string) {
    setAccion(null)
    setMensaje(mensajeExito)
    setVersion((actual) => actual + 1)
  }

  return (
    <section aria-labelledby="titulo-riesgos">
      <h2 id="titulo-riesgos">
        Riesgos de la póliza #{polizaId}
      </h2>

      {accion === null && (
        <div>
          <button type="button" onClick={onCerrar}>
            Cerrar riesgos
          </button>

          {permiteAgregar && (
            <button
              type="button"
              disabled={cargando}
              onClick={() => {
                setMensaje('')
                setAccion({ tipo: 'agregar' })
              }}
            >
              Agregar riesgo
            </button>
          )}
        </div>
      )}

      {mensaje && <p role="status">{mensaje}</p>}
      {cargando && <p role="status">Cargando riesgos...</p>}
      {error && <p role="alert">{error}</p>}

      {!cargando && !error && riesgos.length === 0 && (
        <p>Esta póliza no tiene riesgos registrados.</p>
      )}

      {!cargando && !error && riesgos.length > 0 && (
        <table>
          <thead>
            <tr>
              <th scope="col">Riesgo</th>
              <th scope="col">Inmueble</th>
              <th scope="col">Arrendatario</th>
              <th scope="col">Arrendador</th>
              <th scope="col">Estado</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {riesgos.map((riesgo) => (
              <tr key={riesgo.id}>
                <td>#{riesgo.id}</td>
                <td>{riesgo.direccionInmueble}</td>
                <td>{riesgo.arrendatario}</td>
                <td>{riesgo.arrendador}</td>
                <td>{riesgo.estado}</td>
                <td>
                  <button
                    type="button"
                    disabled={
                      riesgo.estado === 'CANCELADO' ||
                      accion !== null
                    }
                    onClick={() => {
                      setMensaje('')
                      setAccion({
                        tipo: 'cancelar',
                        riesgoId: riesgo.id,
                      })
                    }}
                  >
                    Cancelar riesgo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {accion?.tipo === 'agregar' && (
        <AgregarRiesgo
          polizaId={polizaId}
          onAgregado={() =>
            actualizar('El riesgo se agregó correctamente.')
          }
          onCerrar={() => setAccion(null)}
        />
      )}

      {accion?.tipo === 'cancelar' && (
        <CancelarRiesgo
          key={accion.riesgoId}
          riesgoId={accion.riesgoId}
          onCancelado={() =>
            actualizar('El riesgo se canceló correctamente.')
          }
          onCerrar={() => setAccion(null)}
        />
      )}
    </section>
  )
}