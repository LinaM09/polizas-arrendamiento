import { useState } from 'react'
import type { FormEvent } from 'react'
import { renovarPoliza } from '../services/polizas.service'

interface Props {
  polizaId: number
  onRenovada: () => void
  onCerrar: () => void
}

export default function RenovarPoliza({
  polizaId,
  onRenovada,
  onCerrar,
}: Props) {
  const [ipc, setIpc] = useState('5')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (guardando) return

    const porcentaje = Number(ipc)

    if (
      ipc.trim() === '' ||
      !Number.isFinite(porcentaje) ||
      porcentaje < 0 ||
      porcentaje > 100
    ) {
      setError('Ingresa un IPC entre 0 y 100.')
      return
    }

    setGuardando(true)
    setError('')

    try {
      await renovarPoliza(polizaId, porcentaje)
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'No fue posible renovar la póliza',
      )
      setGuardando(false)
      return
    }

    onRenovada()
  }

  return (
    <section aria-labelledby="titulo-renovacion">
      <h2 id="titulo-renovacion">
        Renovar póliza #{polizaId}
      </h2>

      <p>
        Se ajustará el canon con el IPC indicado y se extenderá
        la vigencia por el mismo número de meses.
      </p>

      <form onSubmit={enviar}>
        <label htmlFor="ipc">IPC (%)</label>
        <input
          id="ipc"
          type="number"
          min="0"
          max="100"
          step="any"
          required
          value={ipc}
          disabled={guardando}
          onChange={(event) => setIpc(event.target.value)}
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={guardando}>
          {guardando ? 'Renovando...' : 'Confirmar renovación'}
        </button>

        <button
          type="button"
          disabled={guardando}
          onClick={onCerrar}
        >
          Volver
        </button>
      </form>
    </section>
  )
}