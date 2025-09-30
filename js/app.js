// ----------------------------
// ARRAY DE PRODUCTOS
// ----------------------------
const productos = [
  { id: 1, nombre: "Perfume Checkmate", precio: 15000, img: "https://via.placeholder.com/200" },
  { id: 2, nombre: "Labial Mate", precio: 5000, img: "https://via.placeholder.com/200" },
  { id: 3, nombre: "Remera Oversize", precio: 10000, img: "https://via.placeholder.com/200" },
  { id: 4, nombre: "Crema Facial", precio: 8000, img: "https://via.placeholder.com/200" }
];

// Recupero el carrito del storage si existe, si no arranco vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// ----------------------------
// FUNCIONES
// ----------------------------

// Renderizar productos en el DOM
function mostrarProductos() {
  const contenedor = document.getElementById("productos-container");
  contenedor.innerHTML = "";

  for (const producto of productos) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p>Precio: $${producto.precio}</p>
      <button id="btn${producto.id}">Agregar al carrito</button>
    `;

    contenedor.appendChild(card);

    // Asigno evento al botón
    const boton = document.getElementById(`btn${producto.id}`);
    boton.addEventListener("click", () => agregarAlCarrito(producto));
  }
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
  carrito.push(producto);
  guardarCarrito();
  mostrarCarrito();
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Mostrar carrito en el DOM
function mostrarCarrito() {
  const contenedor = document.getElementById("carrito-container");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }

  let total = 0;

  for (const producto of carrito) {
    const item = document.createElement("div");
    item.textContent = `${producto.nombre} - $${producto.precio}`;
    contenedor.appendChild(item);
    total += producto.precio;
  }

  const totalElemento = document.createElement("p");
  totalElemento.innerHTML = `<strong>Total: $${total}</strong>`;
  contenedor.appendChild(totalElemento);
}

// ----------------------------
// EJECUCIÓN INICIAL
// ----------------------------
mostrarProductos();
mostrarCarrito();