# Gestión de pólizas de arrendamiento

Aplicación desarrollada como ejercicio técnico para gestionar pólizas individuales y colectivas, consultar sus riesgos, renovar su vigencia y realizar cancelaciones.

**Autora:** Lina María Martínez Hernández. 🚀



## Tecnologías

- Java 21.
- Spring Boot y Maven Wrapper.
- Spring Web MVC, Spring Data JPA y Bean Validation.
- H2 con persistencia en disco.
- React, TypeScript y Vite.
- CSS y ESLint.

## Requisitos

- JDK 21.
- Node.js compatible con la versión de Vite incluida en el proyecto.
- npm.
- Git.

No es necesario instalar Maven: el repositorio incluye Maven Wrapper.

Los comandos siguientes están preparados para Git Bash en Windows.

## Descargar el proyecto

```bash
git clone https://github.com/LinaM09/polizas-arrendamiento.git
cd polizas-arrendamiento
```

## Ejecutar el backend

Desde la carpeta principal:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=demo
```

El backend estará disponible en:

```text
http://localhost:8080
```

El perfil `demo` carga una póliza individual y una colectiva con sus riesgos cuando no existen pólizas en la base de datos.

Los cambios se conservan entre ejecuciones porque H2 almacena la información en `./data/polizas`. Esta carpeta está excluida del repositorio.

Para comenzar nuevamente con los datos iniciales, detener el backend y eliminar la carpeta `data`. Este procedimiento elimina los datos locales.

## Ejecutar el frontend

Abrir otra terminal desde la carpeta principal:

```bash
cd frontend
npm ci
npm run dev
```

Abrir:

```text
http://localhost:5173
```

Mantener ambas terminales en ejecución.

Durante el desarrollo, Vite redirige las solicitudes de `/api` al backend en el puerto `8080` y elimina ese prefijo.

Este proxy corresponde al servidor de desarrollo. Un despliegue de producción necesita configurar el acceso a la API por separado.

## Funcionalidades

- Consultar pólizas.
- Filtrar por tipo y estado.
- Consultar los riesgos de una póliza.
- Renovar una póliza aplicando un porcentaje de IPC.
- Cancelar una póliza y sus riesgos.
- Agregar riesgos a pólizas colectivas.
- Cancelar riesgos individualmente.
- Consultar la propuesta de arquitectura, optimización SQL y estrategia Git.
- Consultar la propuesta de liderazgo desde el botón del cohete.

## Reglas de negocio

- Las pólizas individuales no permiten agregar riesgos adicionales.
- Solo se pueden agregar riesgos a pólizas colectivas que no estén canceladas.
- Una póliza cancelada no se puede renovar.
- Cancelar una póliza cancela también sus riesgos.
- La renovación conserva la duración original en meses.
- El nuevo período comienza en la fecha de finalización del período anterior.
- El IPC se recibe como porcentaje: `5` representa un incremento del 5 %.
- Para este ejercicio, el IPC permitido está entre 0 y 100.
- El canon actualizado se redondea a dos decimales.
- La prima se calcula como canon mensual por meses de vigencia.

## API

Las solicitudes requieren el encabezado:

```http
x-api-key: 123456
```

La clave corresponde exclusivamente a la demostración. Está incluida en el frontend y no representa un mecanismo de autenticación adecuado para producción.

### Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/polizas` | Consulta pólizas con filtros opcionales `tipo` y `estado`. |
| GET | `/polizas/{id}/riesgos` | Consulta los riesgos de una póliza. |
| POST | `/polizas/{id}/renovar` | Renueva una póliza aplicando IPC. |
| POST | `/polizas/{id}/cancelar` | Cancela una póliza y sus riesgos. |
| POST | `/polizas/{id}/riesgos` | Agrega un riesgo a una póliza colectiva. |
| POST | `/riesgos/{id}/cancelar` | Cancela un riesgo. |
| POST | `/core-mock/evento` | Registra en los logs un evento de integración simulado. |

Tipos de póliza: `INDIVIDUAL` y `COLECTIVA`.

Estados de póliza: `ACTIVA`, `RENOVADA` y `CANCELADA`.

Estados de riesgo: `ACTIVO` y `CANCELADO`.

### Consultar pólizas

```bash
curl -i http://localhost:8080/polizas \
  -H "x-api-key: 123456"
```

### Filtrar pólizas

```bash
curl -i "http://localhost:8080/polizas?tipo=INDIVIDUAL&estado=ACTIVA" \
  -H "x-api-key: 123456"
```

### Consultar riesgos

```bash
curl -i http://localhost:8080/polizas/2/riesgos \
  -H "x-api-key: 123456"
```

### Renovar una póliza

```bash
curl -i -X POST http://localhost:8080/polizas/1/renovar \
  -H "x-api-key: 123456" \
  -H "Content-Type: application/json" \
  -d '{"ipc":5}'
```

### Agregar un riesgo

```bash
curl -i -X POST http://localhost:8080/polizas/2/riesgos \
  -H "x-api-key: 123456" \
  -H "Content-Type: application/json" \
  -d '{"direccionInmueble":"Calle 80 # 10-20","arrendatario":"Pedro Ejemplo","arrendador":"Maria Ejemplo"}'
```

### Cancelar un riesgo

Reemplazar el identificador por el de un riesgo existente.

```bash
curl -i -X POST http://localhost:8080/riesgos/3/cancelar \
  -H "x-api-key: 123456"
```

### Cancelar una póliza

```bash
curl -i -X POST http://localhost:8080/polizas/2/cancelar \
  -H "x-api-key: 123456"
```

Los ejemplos modifican los datos persistidos. Los identificadores deben ajustarse a los registros existentes.

### Respuestas

- `200 OK`: consulta u operación realizada.
- `201 Created`: riesgo creado.
- `400 Bad Request`: datos de entrada inválidos.
- `401 Unauthorized`: clave de API ausente o incorrecta.
- `404 Not Found`: recurso inexistente.
- `409 Conflict`: incumplimiento de una regla de negocio.

Los errores de negocio y validación se devuelven con un mensaje descriptivo.

## Integración simulada con el CORE

Las operaciones implementadas que modifican pólizas o riesgos utilizan un adaptador HTTP para enviar un evento a:

```text
POST http://localhost:8080/core-mock/evento
```

Ejemplo del cuerpo:

```json
{
  "evento": "ACTUALIZACION",
  "polizaId": 1
}
```

El mock registra el intento de actualización en los logs. No modifica un CORE real.

La URL se configura mediante la propiedad `core.url`.

La integración incluye tiempos máximos de conexión y respuesta. Si la llamada falla, la operación propaga el error y la transacción local se revierte.

Esta estrategia no constituye una transacción distribuida: un sistema externo podría procesar una solicitud antes de que ocurra un fallo local o una pérdida de respuesta. La propuesta de arquitectura contempla idempotencia y reconciliación para resolver estos escenarios.

## Organización

El backend se organiza en las siguientes responsabilidades:

- `controller`: endpoints HTTP.
- `service`: reglas de negocio y transacciones.
- `repository`: acceso a datos.
- `model`: entidades y estados.
- `dto`: solicitudes y respuestas.
- `exception`: excepciones y manejo de errores.

El frontend concentra sus componentes en `frontend/src/components`, los servicios HTTP en `frontend/src/services` y los tipos en `frontend/src/types`.

## Verificaciones

Ejecutar las pruebas disponibles del backend:

```bash
./mvnw test
```

Compilar y revisar el frontend:

```bash
cd frontend
npm run build
npm run lint
```

La ejecución de Maven corresponde a las pruebas existentes en el repositorio; no implica cobertura completa de las reglas de negocio.

También se realizaron verificaciones manuales de consultas, filtros, renovación, creación y cancelación de riesgos, cancelación de pólizas y respuestas de error.

## Alcance y decisiones

La implementación práctica utiliza una arquitectura por capas, una base de datos H2 y un adaptador HTTP.

La documentación del frontend presenta una arquitectura objetivo y distingue los componentes implementados de los propuestos.

Pertenecen al diseño propuesto y no están implementados o desplegados:

- API Gateway.
- Integración real con WebLogic y el CORE.
- Renovación automática programada.
- Envío de correo y SMS.
- Intermediario de mensajes y transactional outbox.
- Arquitectura hexagonal completa.
- Infraestructura de alta disponibilidad y observabilidad de producción.

El ejercicio no incluye endpoints generales de creación de pólizas: utiliza datos iniciales para demostrar las operaciones solicitadas.

El modelo práctico almacena el canon en la póliza y los nombres de arrendador y arrendatario en cada riesgo. El modelo ampliado descrito en la documentación propone entidades y relaciones adicionales.

La base de datos H2 y la clave de demostración permiten ejecutar el ejercicio localmente. Para producción se requieren una base de datos apropiada, autenticación y autorización robustas, gestión de secretos y controles de concurrencia e idempotencia.
