import type { EstadoPoliza, TipoPoliza } from '../types/poliza'

interface Props {
  tipo: TipoPoliza | ''
  estado: EstadoPoliza | ''
  onTipoChange: (tipo: TipoPoliza | '') => void
  onEstadoChange: (estado: EstadoPoliza | '') => void
}

export default function FiltrosPolizas({
  tipo,
  estado,
  onTipoChange,
  onEstadoChange,
}: Props) {
  return (
    <section
      aria-label="Filtros de pólizas"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '24px',
      }}
    >
      <label>
        Tipo de póliza
        <select
          value={tipo}
          onChange={(event) =>
            onTipoChange(event.target.value as TipoPoliza | '')
          }
          style={{ display: 'block', marginTop: '8px', padding: '10px' }}
        >
          <option value="">Todos los tipos</option>
          <option value="INDIVIDUAL">Individual</option>
          <option value="COLECTIVA">Colectiva</option>
        </select>
      </label>

      <label>
        Estado
        <select
          value={estado}
          onChange={(event) =>
            onEstadoChange(event.target.value as EstadoPoliza | '')
          }
          style={{ display: 'block', marginTop: '8px', padding: '10px' }}
        >
          <option value="">Todos los estados</option>
          <option value="ACTIVA">Activa</option>
          <option value="RENOVADA">Renovada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
      </label>
    </section>
  )
}