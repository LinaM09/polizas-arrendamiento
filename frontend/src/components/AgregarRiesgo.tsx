import { useState } from 'react'
import type { FormEvent } from 'react'
import { agregarRiesgo } from '../services/polizas.service'

interface Props {
  polizaId: number
  onAgregado: () => void
  onCerrar: () => void
}

export default function AgregarRiesgo({
  polizaId,
  onAgregado,
  onCerrar,
}: Props) {
  const [direccion, setDireccion] = useState('')
  const [arrendatario, setArrendatario] = useState('')
  const [arrendador, setArrendador] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (guardando) return

    const datos = {
      direccionInmueble: direccion.trim(),
      arrendatario: arrendatario.trim(),
      arrendador: arrendador.trim(),
    }

    if (
      !datos.direccionInmueble ||
      !datos.arrendatario ||
      !datos.arrendador
    ) {
      setError('Completa todos los campos con datos válidos.')
      return
    }

    setGuardando(true)
    setError('')

    try {
      await agregarRiesgo(polizaId, datos)
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : 'No fue posible agregar el riesgo',
      )
      setGuardando(false)
      return
    }

    onAgregado()
  }

  return (
    <section aria-labelledby="titulo-agregar-riesgo">
      <h3 id="titulo-agregar-riesgo">Agregar riesgo</h3>

      <form onSubmit={enviar}>
        <fieldset disabled={guardando}>
          <legend>Datos del arrendamiento</legend>

          <label htmlFor="direccion">Dirección del inmueble</label>
          <input
            id="direccion"
            required
            maxLength={255}
            value={direccion}
            onChange={(event) => setDireccion(event.target.value)}
          />

          <label htmlFor="arrendatario">Arrendatario</label>
          <input
            id="arrendatario"
            required
            maxLength={255}
            value={arrendatario}
            onChange={(event) => setArrendatario(event.target.value)}
          />

          <label htmlFor="arrendador">Arrendador</label>
          <input
            id="arrendador"
            required
            maxLength={255}
            value={arrendador}
            onChange={(event) => setArrendador(event.target.value)}
          />

          {error && <p role="alert">{error}</p>}

          <button type="submit">
            {guardando ? 'Guardando...' : 'Guardar riesgo'}
          </button>

          <button type="button" onClick={onCerrar}>
            Volver
          </button>
        </fieldset>
      </form>
    </section>
  )
}