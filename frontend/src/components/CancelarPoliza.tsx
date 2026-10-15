import { useState } from 'react'
import { cancelarPoliza } from '../services/polizas.service'

interface Props {
  polizaId: number
  onCancelada: () => void
  onCerrar: () => void
}

export default function CancelarPoliza({
  polizaId,
  onCancelada,
  onCerrar,
}: Props) {
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function confirmar() {
    if (guardando) return

    setGuardando(true)
    setError('')

    try {
      await cancelarPoliza(polizaId)
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'No fue posible cancelar la póliza',
      )
      setGuardando(false)
      return
    }

    onCancelada()
  }

  return (
    <section aria-labelledby="titulo-cancelacion">
      <h2 id="titulo-cancelacion">
        Cancelar póliza #{polizaId}
      </h2>

      <p>
        Esta acción cancelará la póliza y todos sus riesgos.
        Una póliza cancelada no podrá renovarse.
      </p>

      {error && <p role="alert">{error}</p>}

      <button
        type="button"
        disabled={guardando}
        onClick={() => void confirmar()}
      >
        {guardando ? 'Cancelando...' : 'Confirmar cancelación'}
      </button>

      <button
        type="button"
        disabled={guardando}
        onClick={onCerrar}
      >
        Volver
      </button>
    </section>
  )
}