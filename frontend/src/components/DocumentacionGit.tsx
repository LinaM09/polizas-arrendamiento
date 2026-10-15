export default function DocumentacionGit() {
  return (
    <details className="doc-bloque">
      <summary>Módulo 04 · Git y manejo de versiones</summary>

      <div className="doc-contenido">
        <span className="doc-etiqueta">Estrategia propuesta</span>

        <h3>Incorporar únicamente el cambio de seguridad</h3>

        <p>
          Utilizaría git cherry-pick para aplicar el commit que
          contiene la corrección sobre feature/new-login,
          sin fusionar el resto de las actualizaciones de main.
        </p>

        <pre style={{ overflowX: 'auto', padding: '16px' }}>
          <code>{`git status
git fetch origin
git log --oneline origin/main
git show <hash-del-fix>

git switch feature/new-login
git cherry-pick -x <hash-del-fix>`}</code>
        </pre>

        <p>
          Primero comprobaría que el directorio de trabajo esté
          limpio, guardando los cambios pendientes mediante
          un commit o stash si fuera necesario.
        </p>

        <p>
          git fetch actualiza las referencias remotas sin fusionarlas.
          Con git show revisaría el contenido del commit y si
          depende de otros cambios.
        </p>

        <p>
          cherry-pick crea un nuevo commit en la rama actual con
          los cambios seleccionados. La opción -x incorpora
          la referencia al commit original para facilitar
          la trazabilidad.
        </p>

        <h3>Resolución de conflictos</h3>

        <p>
          Si aparecen conflictos, revisaría los archivos y resolvería
          cada diferencia preservando la corrección de seguridad.
          Después marcaría los archivos resueltos y continuaría:
        </p>

        <pre style={{ overflowX: 'auto', padding: '16px' }}>
          <code>{`git add <archivos-resueltos>
git cherry-pick --continue`}</code>
        </pre>

        <p>
          Si necesito cancelar el intento y volver al estado
          anterior al cherry-pick:
        </p>

        <pre style={{ overflowX: 'auto', padding: '16px' }}>
          <code>git cherry-pick --abort</code>
        </pre>

        <h3>Verificación</h3>

        <p>
          Ejecutaría las pruebas relacionadas con el login y
          la vulnerabilidad corregida. Revisaría el diff antes
          de publicar la rama para comprobar que el cambio
          seleccionado es el esperado.
        </p>

        <aside className="doc-nota">
          <strong>Supuesto sobre el commit</strong>

          <p>
            Esta estrategia supone que la corrección está en
            un commit independiente. Si depende de otros commits,
            evaluaría cuáles son necesarios. Si está mezclada
            con cambios ajenos, coordinaría su separación.
            Para un commit de merge es necesario identificar
            correctamente el padre principal antes de aplicarlo.
          </p>
        </aside>
      </div>
    </details>
  )
}