import { useEffect, useRef, useState } from 'react'
import DocumentacionLiderazgo from './DocumentacionLiderazgo'
import './css/ModalLiderazgo.css'

export default function ModalLiderazgo() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const botonRef = useRef<HTMLButtonElement>(null)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    if (!abierto) return

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflowAnterior
    }
  }, [abierto])

  function abrir() {
    const dialog = dialogRef.current

    if (!dialog || dialog.open) return

    const contenido = dialog.querySelector('details')

    if (contenido) {
      contenido.open = true
    }

    dialog.showModal()
    setAbierto(true)
  }

  function cerrar() {
    dialogRef.current?.close()
  }

  return (
    <>
      <div className="cohete-contenedor">
        <button
          ref={botonRef}
          className="cohete-boton"
          type="button"
          onClick={abrir}
          aria-label="Lee aquí sobre liderazgo técnico"
          aria-haspopup="dialog"
        >
          <span className="cohete-icono" aria-hidden="true">
            🚀
          </span>
        </button>

        <span className="cohete-mensaje" aria-hidden="true">
          ¡Lee aquí!
        </span>
      </div>

      <dialog
        ref={dialogRef}
        className="modal-liderazgo"
        aria-labelledby="titulo-modal-liderazgo"
        onClose={() => {
          setAbierto(false)
          botonRef.current?.focus()
        }}
      >
        <div className="modal-liderazgo-cabecera">
          <div>
            <span>Módulo 05</span>

            <h2 id="titulo-modal-liderazgo">
              Liderazgo técnico y gestión
            </h2>
          </div>

          <button
            type="button"
            autoFocus
            onClick={cerrar}
            aria-label="Cerrar liderazgo técnico"
          >
            Cerrar ×
          </button>
        </div>

        <div className="documentacion modal-liderazgo-contenido">
          <DocumentacionLiderazgo />
        </div>
      </dialog>
    </>
  )
}