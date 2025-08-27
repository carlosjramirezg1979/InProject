# **App Name**: ProjectWise

## Core Features:

- Formularios Guiados del Proyecto: Formularios interactivos para las fases de inicio, planificación, ejecución y cierre del proyecto.
- Avisos de Tareas Integrales: Listas de verificación y avisos para asegurar que se consideren todos los aspectos críticos del proyecto.
- Creación de Nuevo Proyecto: Permitir que un usuario genere un nuevo proyecto.
- Tablero de Proyecto: Mostrar los proyectos actuales en una vista de resumen.
- Sugerencia de Riesgo con IA: Sugerir riesgos del proyecto basándose en los detalles del proyecto introducidos en los formularios utilizando una herramienta de IA. Esta herramienta de IA identificará qué información posible en el contexto del proyecto podría hacer que un riesgo específico sea relevante o no.
- Generación de Informes: Generar informes de proyecto para que el usuario los exporte o comparta. Actualmente genera formato JSON.
- Ayuda Contextual: Sección de ayuda para proporcionar orientación sobre metodologías de gestión de proyectos.

## Style Guidelines:

- Verde azulado (#4DB6AC) para la confiabilidad y la fiabilidad.
- Verde azulado claro (#E0F2F1), una versión desaturada del primario, para crear un ambiente calmante.
- Coral (#FF8A65) para llamar la atención sobre los llamados a la acción y las notificaciones importantes.
- 'Inter' (sans-serif) para una sensación moderna y mecanizada, para enfatizar la claridad.
- Usar iconos limpios y delineados para representar las etapas y tareas del proyecto.
- Mantener un diseño limpio basado en tarjetas para centrarse en los bloques de información.
- Usar transiciones sutiles y animaciones de carga para mantener la participación del usuario.
- Space Grotesk para títulos y encabezados (font-headline), para un toque moderno y técnico.
- Inter para el cuerpo del texto (font-body), asegurando una excelente legibilidad para la lectura de formularios y párrafos.
- Un naranja vibrante (hsl(24.6 95% 53.1%)), utilizado para los principales elementos interactivos como botones, enlaces activos y acentos visuales, atrayendo la atención del usuario a las acciones clave.
- Un blanco roto / gris muy claro (hsl(34 14% 96%)), que proporciona un fondo neutro y reduce la fatiga visual.
- Blanco puro (hsl(0 0% 100%) para las tarjetas, creando un contraste sutil con el fondo principal.
- El negro y una gama de grises dominan el texto, asegurando una alta legibilidad. Los textos secundarios o de ayuda (muted-foreground) usan un gris más suave.
- La plataforma utiliza una estructura de panel de control moderna. Al iniciar sesión, el usuario llega a un panel principal (/dashboard) que muestra una vista de tarjetas con el resumen de todos sus proyectos.
- Al entrar en un proyecto, la interfaz cambia a una vista de dos columnas: un menú de navegación lateral izquierdo y un área de contenido principal a la derecha.
- Se debe mantener la barra superior con el nombre de la aplicación en el lado izquierdo y el botón con los datos de configuración del usuario conectado en el lado derecho.
- El menú lateral está organizado de forma jerárquica y por fases del proyecto (Inicio, Planificación, etc.), lo que permite un acceso rápido y lógico a cada formulario. Las fases posteriores se bloquean hasta que se completan los documentos clave de la fase anterior, lo que guía al usuario de forma progresiva.