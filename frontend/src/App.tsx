import { useEffect, useState } from 'react'
import CancelarPoliza from './components/CancelarPoliza'
import Documentacion from './components/Documentacion'
import FiltrosPolizas from './components/FiltrosPolizas'
import RenovarPoliza from './components/RenovarPoliza'
import RiesgosPoliza from './components/RiesgosPoliza'
import { listarPolizas } from './services/polizas.service'
import type {
  EstadoPoliza,
  Poliza,
  TipoPoliza,
} from './types/poliza'
import './App.css'

const formatoMoneda = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

type TipoPanel = 'riesgos' | 'renovar' | 'cancelar'

type Panel = {
  tipo: TipoPanel
  polizaId: number
} | null

export default function App() {
  const [vista, setVista] =
    useState<'gestion' | 'documentacion'>('gestion')
  const [polizas, setPolizas] = useState<Poliza[]>([])
  const [tipo, setTipo] = useState<TipoPoliza | ''>('')
  const [estado, setEstado] = useState<EstadoPoliza | ''>('')
  const [panel, setPanel] = useState<Panel>(null)
  const [version, setVersion] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const polizaSeleccionada = polizas.find(
    (poliza) => poliza.id === panel?.polizaId,
  )

  useEffect(() => {
    if (vista !== 'gestion') return

    let activo = true

    async function cargar() {
      setCargando(true)
      setError('')

      try {
        const datos = await listarPolizas(
          tipo || undefined,
          estado || undefined,
        )

        if (activo) setPolizas(datos)
      } catch (error: unknown) {
        if (activo) {
          setError(
            error instanceof Error
              ? error.message
              : 'No fue posible cargar las pólizas',
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
  }, [tipo, estado, version, vista])

  function abrirPanel(tipoPanel: TipoPanel, polizaId: number) {
    setMensaje('')
    setPanel({ tipo: tipoPanel, polizaId })
  }

  function actualizarListado(mensajeExito: string) {
    setPanel(null)
    setMensaje(mensajeExito)
    setVersion((actual) => actual + 1)
  }

  return (
    <main>
      <header>
        <p>Plataforma de seguros de arrendamiento</p>
        <h1>Gestión de pólizas</h1>
        <p>Consulta pólizas, revisa riesgos y administra su vigencia.</p>
      </header>

      <nav
        aria-label="Secciones de la aplicación"
        style={{ marginBottom: '24px' }}
      >
        <button
          type="button"
          aria-pressed={vista === 'gestion'}
          disabled={panel !== null}
          onClick={() => setVista('gestion')}
        >
          Gestión de pólizas
        </button>

        <button
          type="button"
          aria-pressed={vista === 'documentacion'}
          disabled={panel !== null}
          onClick={() => setVista('documentacion')}
        >
          Documentación técnica
        </button>
      </nav>

      {vista === 'documentacion' ? (
        <Documentacion />
      ) : (
        <>
          <FiltrosPolizas
            tipo={tipo}
            estado={estado}
            onTipoChange={(valor) => {
              setTipo(valor)
              setPanel(null)
              setMensaje('')
            }}
            onEstadoChange={(valor) => {
              setEstado(valor)
              setPanel(null)
              setMensaje('')
            }}
          />

          {mensaje && <p role="status">{mensaje}</p>}
          {cargando && <p role="status">Cargando pólizas...</p>}
          {error && <p role="alert">{error}</p>}

          {!cargando && !error && polizas.length === 0 && (
            <p>No hay pólizas que coincidan con los filtros.</p>
          )}

          {!cargando && !error && polizas.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th scope="col">Póliza</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Canon mensual</th>
                  <th scope="col">Prima</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {polizas.map((poliza) => (
                  <tr key={poliza.id}>
                    <td>#{poliza.id}</td>
                    <td>{poliza.tipo}</td>
                    <td>{poliza.estado}</td>
                    <td>{formatoMoneda.format(poliza.canonMensual)}</td>
                    <td>{formatoMoneda.format(poliza.prima)}</td>
                    <td>
                      <button
                        type="button"
                        disabled={panel !== null}
                        onClick={() => abrirPanel('riesgos', poliza.id)}
                      >
                        Ver riesgos
                      </button>

                      <button
                        type="button"
                        disabled={
                          poliza.estado === 'CANCELADA' ||
                          panel !== null
                        }
                        onClick={() => abrirPanel('renovar', poliza.id)}
                      >
                        Renovar
                      </button>

                      <button
                        type="button"
                        disabled={
                          poliza.estado === 'CANCELADA' ||
                          panel !== null
                        }
                        onClick={() => abrirPanel('cancelar', poliza.id)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {panel?.tipo === 'riesgos' && polizaSeleccionada && (
            <RiesgosPoliza
              key={`riesgos-${panel.polizaId}`}
              polizaId={panel.polizaId}
              permiteAgregar={
                polizaSeleccionada.tipo === 'COLECTIVA' &&
                polizaSeleccionada.estado !== 'CANCELADA'
              }
              onCerrar={() => setPanel(null)}
            />
          )}

          {panel?.tipo === 'renovar' && (
            <RenovarPoliza
              key={`renovar-${panel.polizaId}`}
              polizaId={panel.polizaId}
              onRenovada={() =>
                actualizarListado('La póliza se renovó correctamente.')
              }
              onCerrar={() => setPanel(null)}
            />
          )}

          {panel?.tipo === 'cancelar' && (
            <CancelarPoliza
              key={`cancelar-${panel.polizaId}`}
              polizaId={panel.polizaId}
              onCancelada={() =>
                actualizarListado('La póliza y sus riesgos se cancelaron.')
              }
              onCerrar={() => setPanel(null)}
            />
          )}
        </>
      )}
    </main>
  )
}