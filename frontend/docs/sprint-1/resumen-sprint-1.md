# Resumen del Sprint 1 - Sweet Bytes

## Logros y Objetivos Alcanzados
Durante este sprint, el equipo logró establecer las bases sólidas del frontend estático para "Freddy Bakes", cumpliendo con todos los requerimientos visuales y técnicos:
1. **Maquetado Responsivo (Mobile First):** Se desarrollaron las 7 vistas estáticas obligatorias (Landing, Catálogo, Detalle, Carrito, Checkout, Panel Admin y Error 404).
2. **Sistema de Diseño Consistente:** Se configuró Tailwind CSS estandarizando colores corporativos y tipografías. Durante el proceso, auditamos la UI y ajustamos el layout general porque el contenido estaba recostado muy a la izquierda, logrando un centrado perfecto para resoluciones de escritorio.
3. **Flujo de Trabajo Colaborativo:** Configuramos el repositorio bloqueando commits directos a `main`, trabajando estrictamente mediante ramas y Pull Requests con revisión de pares.

## Riesgos, Lecciones Aprendidas y Preparación para el Sprint 2

De cara al próximo ciclo, donde comenzaremos a desarrollar el Backend Core (API REST con Node.js, Express y MongoDB), identificamos los siguientes puntos:

1. **Gestión Estricta de Repositorios (Git Flow):**
   * **Lección Aprendida:** Durante la integración de ramas tuvimos un incidente operativo donde un Pull Request se realizó por error hacia el repositorio de otro grupo de la cursada, lo que nos obligó a revertir la acción.
   * **Acción para Sprint 2:** Acordamos incorporar un chequeo riguroso (`git remote -v` y validación visual del destino) antes de abrir los PRs correspondientes a los endpoints, asegurando que impacten únicamente en nuestro `main`.

2. **Modelado de Datos (Refactorización de Etiquetas):**
   * **Riesgo:** Detectamos redundancia en el diseño estático actual al tener etiquetas comerciales muy similares (Premium, Estrella, Imperdible, Favorito).
   * **Acción para Sprint 2:** Simplificaremos el esquema a 4 estados únicos (`Clásico`, `Premium`, `Imperdible` y `Fresco`). Esta limpieza es un paso previo fundamental para cuando tengamos que definir los Schemas de Mongoose en la carpeta `/models` de nuestra base de datos NoSQL.

3. **Transición hacia la Arquitectura MVC y Contratos de API:**
   * **Riesgo:** Descoordinación entre los datos estáticos que armamos en este sprint y la estructura real que devolverá el servidor.
   * **Acción para Sprint 2:** Redactaremos el `api-contract.md` para estandarizar las respuestas JSON de las rutas de Usuarios y Productos (CRUD). Nos apoyaremos en herramientas como Postman o Thunder Client para testear exhaustivamente los códigos de estado HTTP (200, 201, 400, 401, 404) aislando el backend temporalmente.
