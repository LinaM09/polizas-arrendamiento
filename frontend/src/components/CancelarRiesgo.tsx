import { useState } from 'react'
import { cancelarRiesgo } from '../services/polizas.service'

interface Props {
  riesgoId: number
  onCancelado: () => void
  onCerrar: () => void
}

export default function CancelarRiesgo({
  riesgoId,
  onCancelado,
  onCerrar,
}: Props) {
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function confirmar() {
    if (guardando) return

    setGuardando(true)
    setError('')

    try {
      await cancelarRiesgo(riesgoId)
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'No fue posible cancelar el riesgo',
      )
      setGuardando(false)
      return
    }

    onCancelado()
  }

  return (
    <section aria-labelledby="titulo-cancelar-riesgo">
      <h3 id="titulo-cancelar-riesgo">
        Cancelar riesgo #{riesgoId}
      </h3>

      <p>
        Se cancelará este riesgo. La póliza conservará
        su estado actual.
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