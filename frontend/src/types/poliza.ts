export type TipoPoliza = 'INDIVIDUAL' | 'COLECTIVA'

export type EstadoPoliza = 'ACTIVA' | 'RENOVADA' | 'CANCELADA'

export type EstadoRiesgo = 'ACTIVO' | 'CANCELADO'

export interface Poliza {
  id: number
  tipo: TipoPoliza
  estado: EstadoPoliza
  fechaInicio: string
  fechaFin: string
  mesesVigencia: number
  canonMensual: number
  prima: number
}

export interface Riesgo {
  id: number
  polizaId: number
  direccionInmueble: string
  arrendatario: string
  arrendador: string
  estado: EstadoRiesgo
}

export interface CrearRiesgoRequest {
  direccionInmueble: string
  arrendatario: string
  arrendador: string
}