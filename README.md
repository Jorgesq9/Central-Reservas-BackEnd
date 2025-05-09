# API de Gestión de Reservas

Esta API está diseñada para gestionar reservas, permitiendo autenticación de usuarios, creación y modificación de reservas, historial de estados y consulta de estadísticas. Además, se proporciona documentación interactiva mediante Swagger.

## Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints Principales](#endpoints-principales)
- [Documentación](#documentación)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

- **Autenticación con JWT**: Registro e inicio de sesión de usuarios, protección de rutas.
- **Gestión de Reservas**: Crear, actualizar, eliminar y listar reservas.
- **Historial de Estados**: Registro de cambios en el estado de las reservas.
- **Estadísticas**: Consulta de estadísticas de las reservas.
- **Documentación Swagger**: Documentación interactiva para probar los endpoints.

## Requisitos

- **Node.js** v14 o superior.
- **MongoDB** v4.4 o superior.
- Dependencias listadas en `package.json`.

## Instalación

1. Clona este repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_REPOSITORIO>
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno (ver #configuración).
4. Inicia el servidor:
   ```bash
   npm start
   ```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
MONGO_URI=mongodb://localhost:27017/miBaseDeDatos
JWT_SECRET=mi_clave_secreta
PORT=5000
```

## Uso

La API se ejecuta en `http://localhost:5000` por defecto.

### Endpoints Principales
- **Autenticación**:
  - `POST /api/auth/register`: Registrar un nuevo usuario.
  - `POST /api/auth/login`: Iniciar sesión y obtener un token JWT.

- **Reservas**:
  - `GET /api/reservations`: Obtener una lista de reservas (con filtros opcionales).
  - `POST /api/reservations`: Crear una nueva reserva.
  - `PATCH /api/reservations/:id`: Actualizar una reserva existente.
  - `DELETE /api/reservations/:id`: Eliminar una reserva.
  - `GET /api/reservations/:reservationId/history`: Obtener el historial de cambios de una reserva.
  - `GET /api/reservations/statistics`: Obtener estadísticas de las reservas.

## Documentación

La documentación interactiva de la API está disponible mediante Swagger en:

```
https://api.jorgeesquivafullstack.es/api-docs/
```


## 🌍 Despliegue Actual

El juego está alojado en un servidor casero utilizando cloudflared (Cloudflare Tunnel), lo que permite exponerlo al público sin abrir puertos ni usar una IP pública.


## Contribución

1. Haz un fork del proyecto.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`).
4. Haz push de la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request
