# Documentación de Funcionalidad: Pantalla del Dashboard

## 1. Objetivo Principal

El Dashboard es la pantalla principal y el punto de partida para cualquier gerente de proyectos que utiliza la plataforma ProjectWise. Su objetivo es ofrecer una vista consolidada y de alto nivel de todos los proyectos que el usuario gestiona, permitiendo un acceso rápido a los detalles de cada uno y facilitando la creación de nuevos proyectos.

## 2. Estructura de la Pantalla

La pantalla del Dashboard está organizada en varias secciones clave para una experiencia de usuario clara y eficiente:

1.  **Encabezado Principal (`Header`)**: Ubicado en la parte superior de la página, contiene el logo de la aplicación, el nombre "ProjectWise" y el menú de navegación del usuario. Este encabezado es consistente en toda la sección del dashboard.

2.  **Sección de Título y Acción**:
    -   **Título (`h1`)**: Muestra el texto "Mis Proyectos" para identificar claramente el propósito de la página.
    -   **Descripción**: Un subtítulo que informa al usuario que está viendo un resumen de sus proyectos.
    -   **Botón de Acción Principal**: Un botón destacado con el texto "Crear Nuevo Proyecto", que permite a los usuarios iniciar el proceso de creación de un nuevo proyecto directamente desde el dashboard.

3.  **Lista de Proyectos**:
    -   **Disposición**: Los proyectos se muestran en un formato de cuadrícula (grid) que se adapta a diferentes tamaños de pantalla (diseño responsivo).
    -   **Componente**: Cada proyecto se representa mediante una "Tarjeta de Proyecto" (`ProjectCard`).

4.  **Estado Vacío (`Empty State`)**:
    -   **Condición**: Esta sección solo se muestra si el gerente de proyectos no tiene ningún proyecto asignado.
    -   **Contenido**: Muestra un mensaje informativo que dice "No se encontraron proyectos" y anima al usuario a crear uno para comenzar.

## 3. Componentes Clave y su Funcionalidad

### Tarjeta de Proyecto (`ProjectCard`)

Cada tarjeta es un componente interactivo que resume la información esencial de un proyecto y sirve como un enlace directo a su página de detalles.

#### Campos y Elementos:

-   **Imagen del Proyecto**: Una imagen visualmente atractiva que representa al proyecto.
-   **Nombre del Proyecto**: El título principal del proyecto.
-   **Descripción del Proyecto**: Un breve resumen del objetivo del proyecto.
-   **Barra de Progreso**:
    -   **Lógica**: El progreso se calcula automáticamente basándose en el número de fases del proyecto que han sido marcadas como "completadas". Con 4 fases en total, cada fase completada añade un 25% al progreso total.
    -   **Visualización**: Una barra de progreso visual junto con un porcentaje numérico.
-   **Fase Actual**:
    -   **Lógica**: Muestra la fase más avanzada del proyecto que esté "en progreso" o "completada". Las fases son: Inicio, Planificación, Ejecución y Cierre.
    -   **Visualización**: Una insignia (badge) con un color distintivo para cada fase, lo que permite una rápida identificación visual del estado del proyecto.

#### Comportamiento:

-   **Navegación**: Hacer clic en cualquier parte de la tarjeta redirige al usuario a la página de detalles de ese proyecto específico (ej: `/dashboard/projects/[id]`).
-   **Efecto Hover**: Al pasar el cursor sobre la tarjeta, se aplica una sutil sombra para indicar que es un elemento interactivo.

### Diálogo para Crear Nuevo Proyecto (`NewProjectDialog`)

Este componente se activa al hacer clic en el botón "Crear Nuevo Proyecto".

#### Funcionalidad:

-   **Activación**: Abre una ventana modal (diálogo) superpuesta sobre la página actual.
-   **Objetivo**: Permite al usuario introducir la información básica para crear un nuevo proyecto sin abandonar la página del dashboard.

#### Campos del Diálogo:

-   **Nombre**: Campo de texto para el nombre del nuevo proyecto.
-   **Descripción**: Área de texto para una descripción breve del proyecto.
-   **Botón de Creación**: Un botón dentro del diálogo para confirmar y enviar la información (actualmente, esta acción está simulada).

## 4. Lógica de Datos y Reglas de Negocio

-   **Fuente de Datos**: La lista de proyectos se obtiene llamando a la función `getProjectsByManagerId('pm-001')`. Actualmente, se utiliza un ID de gerente de proyecto estático (`pm-001`) para la demostración. En una implementación completa, este ID sería el del usuario autenticado.
-   **Regla de Acceso**: La lógica de negocio fundamental es que un gerente de proyectos solo puede ver los proyectos asociados a las empresas que gestiona. La función `getProjectsByManagerId` asegura que solo se muestren los proyectos pertinentes, manteniendo la privacidad y la organización de los datos.
-   **Permisos**: Solo el gerente de proyectos asignado puede ver y gestionar estos proyectos. No hay acceso a proyectos de otros gerentes.
