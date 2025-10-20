Proyecto Final – Simulador de Compras

Autora: Maria Eugenia Mansilla
Carrera: JS Flex – Coderhouse

Objetivo general

Crear un simulador interactivo en JavaScript que simula el flujo completo de compra de un Ecommerce.

El proyecto permite:

Ver productos cargados dinámicamente desde un archivo JSON.

Agregar y quitar productos al carrito.

Modificar cantidades sin duplicar ítems.

Vaciar el carrito.

Finalizar la compra con un formulario precargado.

Mostrar confirmaciones y avisos usando SweetAlert2 (en reemplazo de alert/prompt/confirm).

Tecnologías utilizadas

HTML5 (estructura y etiquetas semánticas)

CSS3 (diseño responsive, grid y estilos modernos)

JavaScript (ES6+)

JSON local (simulación de datos remotos)

Librería externa: SweetAlert2

Funcionalidad principal

Carga de productos desde data/productos.json de forma asíncrona con fetch.

Render dinámico de tarjetas de productos en el HTML.

Carrito de compras con:

Manejo de cantidades (+ / –)

Eliminar producto individual

Vaciar carrito completo

Persistencia en LocalStorage

Formulario de Checkout con:

Campos precargados (nombre, email, dirección, medio de pago)

Validación básica de campos obligatorios

Mensajes con SweetAlert2

Limpieza del carrito tras la compra

Estructura del proyecto

ProyectoFinal-Mansilla/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── data/
│   └── productos.json
│
└── img/
    ├── labial-rouge.jpg
    ├── perfume-amber.jpg
    └── crema-hydrat.jpg