# Historia de Usuario

## Empresa
**eSports Arena**

## Contexto
eSports Arena es una empresa especializada en la organización y gestión de torneos de videojuegos a nivel nacional. Buscan mejorar la administración de sus eventos mediante una API que les permita gestionar torneos, jugadores y resultados de manera más eficiente.

## Tarea Asignada
Como desarrollador en la plataforma de torneos de eSports Arena, necesito implementar las funcionalidades que permitan gestionar torneos y jugadores. Esta API debe permitirme:
- Registrar nuevos jugadores.
- Crear, actualizar y eliminar torneos.
- Añadir jugadores a torneos.
- Consultar la información de los eventos y sus participantes.
- Generar aleatoriamente los emparejamientos de las competencias.
- Registrar los resultados, incluyendo el ganador, el perdedor y los puntajes obtenidos.
- Consultar los resultados por torneo, aplicando filtros por puntaje, ordenando por clasificación y utilizando paginación.

## Tiempo Estimado
**8 horas**

## Criterios de Aceptación

### Persistencia de Datos
- Implementar TypeORM con PostgreSQL o MySQL para el almacenamiento de datos.
- Modelar correctamente las tablas para torneos, jugadores y resultados.
- **Bonus**: Si se implementan scripts de poblamiento (seeds) o migraciones para facilitar el proceso.
- Usar "soft delete" para los registros que se eliminen.

### Gestión de Rutas (Routing)
- Crear rutas RESTful para las operaciones CRUD de torneos, jugadores y resultados.
- Asegurarse de que las rutas sean claras y sigan las buenas prácticas de APIs REST.

### Manejo de Datos y DTO
- Validar correctamente los datos usando DTOs para las operaciones de creación y actualización.
- Manejar adecuadamente los parámetros de URL, query params y los datos en el cuerpo de las solicitudes.

### Códigos de Respuesta
- Implementar códigos de respuesta HTTP adecuados para cada operación (201, 200, 400, 404, 500, etc.).

### Documentación del Proyecto
- Incluir un archivo README que explique cómo configurar y ejecutar el proyecto.
- Utilizar Swagger para documentar la API y su uso.

### Control de Versiones con GitFlow
- Utilizar la metodología GitFlow para gestionar las ramas y versiones del proyecto.
- Asegurarse de que los commits sean descriptivos y sigan las buenas prácticas.

### Paginación, Filtros y Ordenamiento
- Implementar paginación en las consultas de torneos, jugadores y resultados.
- Añadir filtros básicos como la consulta por puntaje en los resultados de los jugadores de un torneo. 
  - **Bonus**: Incluir filtros adicionales en otras consultas.
- Incluir opciones de ordenamiento para los resultados de los jugadores en un torneo. 
  - **Bonus**: Implementar ordenamientos adicionales en otras consultas.

### Validación de Solicitudes
- Implementar validación mediante `x-api-key` en los headers para asegurar que las solicitudes de creación de torneos sean confiables.

### Uso de Funcionalidades del Framework
- Usar "guards" para proteger las rutas que requieran seguridad o autenticación.

## Entregables

### Código del Proyecto
- Subir el proyecto a un repositorio en GitHub (asegúrate que el repo esté público).
- Cargar a Moodle un archivo TXT con el enlace al repositorio y un .ZIP del mismo.
- Solo se revisarán commits que cumplan con la fecha límite de la prueba.

### Instrucciones
- Incluir un archivo README con instrucciones claras sobre cómo instalar, configurar y ejecutar la aplicación (no pretendas que el TL tenga que hacer ingeniería inversa para levantar tu aplicativo; asegúrate de incluir apikeys, variables de entorno y cualquier recurso necesario).
- Explicar cómo ejecutar migraciones o scripts de poblamiento de datos (seeds) si fueron implementados.

### Documentación de la API
- Documentar todas las rutas y funcionalidades de la API utilizando Swagger para facilitar la interacción con la misma.

## Notas Adicionales
1. Se valorará la claridad y organización del código, así como la correcta implementación de las herramientas y prácticas solicitadas.
2. Se valora que todo el código, comentarios, commits e instrucciones sean en inglés.

## Actividades Extras (Opcionales)
Estas actividades adicionales no son obligatorias, pero sumarán puntos extra si se implementan de manera efectiva.

### Autenticación y Autorización
- Implementar autenticación mediante JWT (JSON Web Token) para proteger las rutas de creación, actualización y eliminación de torneos, jugadores y resultados.
- Agregar roles de usuario (ej. "admin" y "jugador") y permisos que limiten las acciones de acuerdo con el rol.

### Notificaciones en Tiempo Real
- Implementar WebSockets o cualquier solución de notificación en tiempo real para enviar actualizaciones sobre los resultados de los torneos o los emparejamientos a los jugadores inscritos.

### Pruebas Unitarias y de Integración
- Desarrollar pruebas unitarias para validar las funcionalidades de la API (crear, actualizar, eliminar y consultar torneos, jugadores y resultados).
- Implementar pruebas de integración para asegurar que el sistema funcione correctamente de principio a fin.

### Despliegue en la Nube
- Desplegar la API en una plataforma de servicios en la nube como Heroku, Railway, AWS o DigitalOcean.
- Proveer una URL pública para la API que permita interactuar con ella en tiempo real.

### Generación de Informes
- Implementar una funcionalidad que permita generar informes en formato PDF o CSV con los resultados y estadísticas de los torneos.
- Incluir un endpoint que descargue dichos informes.