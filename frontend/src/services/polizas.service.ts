import type {
  CrearRiesgoRequest,
  EstadoPoliza,
  Poliza,
  Riesgo,
  TipoPoliza,
} from '../types/poliza'

const API_URL = '/api'

async function solicitar<T>(
  ruta: string,
  opciones: RequestInit = {},
): Promise<T> {
  const headers = new Headers(opciones.headers)
  headers.set('x-api-key', '123456')

  if (opciones.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers,
  })

  if (!respuesta.ok) {
    let mensaje = `Error en la solicitud (${respuesta.status})`

    try {
      const error: { mensaje?: string; detail?: string } =
        await respuesta.json()

      mensaje = error.mensaje || error.detail || mensaje
    } catch {
      // Conservamos el mensaje si la respuesta no contiene JSON.
    }

    throw new Error(mensaje)
  }

  return respuesta.json() as Promise<T>
}

export function listarPolizas(
  tipo?: TipoPoliza,
  estado?: EstadoPoliza,
): Promise<Poliza[]> {
  const parametros = new URLSearchParams()

  if (tipo) parametros.set('tipo', tipo)
  if (estado) parametros.set('estado', estado)

  const query = parametros.toString()

  return solicitar<Poliza[]>(`/polizas${query ? `?${query}` : ''}`)
}

export function listarRiesgos(polizaId: number): Promise<Riesgo[]> {
  return solicitar<Riesgo[]>(`/polizas/${polizaId}/riesgos`)
}

export function renovarPoliza(
  polizaId: number,
  ipc: number,
): Promise<Poliza> {
  return solicitar<Poliza>(`/polizas/${polizaId}/renovar`, {
    method: 'POST',
    body: JSON.stringify({ ipc }),
  })
}

export function cancelarPoliza(polizaId: number): Promise<Poliza> {
  return solicitar<Poliza>(`/polizas/${polizaId}/cancelar`, {
    method: 'POST',
  })
}

export function agregarRiesgo(
  polizaId: number,
  datos: CrearRiesgoRequest,
): Promise<Riesgo> {
  return solicitar<Riesgo>(`/polizas/${polizaId}/riesgos`, {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export function cancelarRiesgo(riesgoId: number): Promise<Riesgo> {
  return solicitar<Riesgo>(`/riesgos/${riesgoId}/cancelar`, {
    method: 'POST',
  })
}