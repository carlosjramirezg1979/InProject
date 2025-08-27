# Documentación de Funcionalidad: Pantalla de Configuración de Perfil

## 1. Objetivo Principal

La pantalla de "Configuración de Perfil" permite a los gerentes de proyecto gestionar su información personal y de seguridad dentro de la plataforma ProjectWise. El objetivo es proporcionar una interfaz centralizada y segura para que los usuarios mantengan sus datos actualizados y protejan el acceso a su cuenta.

## 2. Estructura de la Pantalla

La página está organizada en dos secciones principales, presentadas como tarjetas (Cards) para una clara separación de funciones:

1.  **Perfil de Usuario**: Contiene los datos personales y de contacto del usuario.
2.  **Seguridad**: Contiene las opciones para gestionar la seguridad de la cuenta, como el cambio de contraseña.

## 3. Sección: Perfil de Usuario

Esta sección presenta un formulario que permite al usuario ver y modificar su información personal.

### Campos del Formulario:

-   **Nombres (`firstName`)**:
    -   **Descripción**: Nombre de pila del usuario.
    -   **Reglas**: Campo de texto.
    -   **Validaciones**: Es un campo obligatorio. Debe contener al menos 1 caracter.

-   **Apellidos (`lastName`)**:
    -   **Descripción**: Apellidos del usuario.
    -   **Reglas**: Campo de texto.
    -   **Validaciones**: Es un campo obligatorio. Debe contener al menos 1 caracter.

-   **Dirección de Correo Electrónico (`email`)**:
    -   **Descripción**: El correo electrónico asociado a la cuenta, que se utiliza para iniciar sesión y recibir notificaciones.
    -   **Reglas**: Campo de texto, editable.
    -   **Validaciones**: Se realiza una validación en tiempo real para asegurar que el valor introducido tenga un formato de correo electrónico válido (ej: `usuario@dominio.com`).

-   **Número de Celular (`phone`)**:
    -   **Descripción**: Número de contacto principal del usuario.
    -   **Reglas**: Campo de texto opcional.
    -   **Validaciones**: Se aplica una validación en tiempo real que solo permite la entrada de caracteres numéricos (0-9). Cualquier otro caracter (letras, símbolos, espacios) es automáticamente eliminado.

-   **País (`country`)**:
    -   **Descripción**: País de residencia del usuario.
    -   **Reglas**: Menú desplegable (selector).
    -   **Estado Actual**: Actualmente, la única opción disponible y seleccionada por defecto es "Colombia", pero el campo está diseñado para soportar más países en el futuro.

-   **Departamento (`department`)**:
    -   **Descripción**: Departamento/Estado de residencia del usuario.
    -   **Reglas**: Menú desplegable. La lista de departamentos se carga dinámicamente desde una fuente de datos (`src/lib/locations.ts`) que contiene todos los departamentos de Colombia según la codificación DIVIPOLA.
    -   **Dependencia**: La selección en este campo afecta directamente las opciones disponibles en el campo "Ciudad".

-   **Ciudad (`city`)**:
    -   **Descripción**: Ciudad de residencia del usuario.
    -   **Reglas**: Menú desplegable. Este campo permanece deshabilitado hasta que se seleccione un departamento. Una vez seleccionado un departamento, este menú se puebla dinámicamente con la lista de municipios correspondientes a ese departamento.
    -   **Dependencia**: Depende del campo "Departamento". Al cambiar de departamento, la selección de ciudad se reinicia.

### Comportamiento del Formulario:

-   **Guardado**: Al hacer clic en el botón "Actualizar Perfil", los datos del formulario son validados. Si son correctos, se envían para su procesamiento. (Actualmente, la acción se simula y los datos se muestran en la consola del navegador).
-   **Valores por defecto**: Los campos del formulario se inician vacíos, utilizando los `placeholders` como guías o ejemplos para el usuario.

## 4. Sección: Seguridad

Esta sección está dedicada a la gestión de las credenciales de la cuenta.

### Cambio de Contraseña:

-   **Acción**: Al hacer clic en el botón "Cambiar Contraseña", se abre un diálogo modal (ventana emergente).
-   **Objetivo del Diálogo**: Permitir al usuario cambiar su contraseña de forma segura.

### Campos del Diálogo Modal:

-   **Contraseña actual (`currentPassword`)**:
    -   **Reglas**: Campo de contraseña (texto oculto).
    -   **Validaciones**: Es obligatorio. Se utiliza para verificar la identidad del usuario antes de permitir el cambio.

-   **Nueva contraseña (`newPassword`)**:
    -   **Reglas**: Campo de contraseña.
    -   **Validaciones**: Es obligatorio. Debe tener una longitud mínima de 8 caracteres.

-   **Confirmar nueva contraseña (`confirmPassword`)**:
    -   **Reglas**: Campo de contraseña.
    -   **Validaciones**: Es obligatorio. Su valor debe coincidir exactamente con el de "Nueva contraseña". Si no coincide, se muestra un mensaje de error.

### Comportamiento del Diálogo:

-   **Guardado**: Al enviar el formulario dentro del diálogo, se realizan todas las validaciones. Si son exitosas, se simula el cambio de contraseña, se muestra una notificación de éxito (`toast`) y el diálogo se cierra. Los campos del formulario modal se reinician.
