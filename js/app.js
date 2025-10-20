// =====================
// VARIABLES Y ESTADO
// =====================

// Array donde se guardan los productos cargados desde el JSON
let productos = [];

// Carrito: si hay datos en localStorage se cargan, si no empieza vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función abreviada para seleccionar elementos del DOM
const $ = (s) => document.querySelector(s);

// Guarda el carrito actualizado en localStorage
const guardarCarrito = () => localStorage.setItem("carrito", JSON.stringify(carrito));


// =====================
// LIBRERÍA EXTERNA - SWEETALERT2
// =====================

// Función para mostrar notificaciones (reemplaza alert/prompt/confirm)
function toast(texto, tipo = "ok") {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: tipo === "error" ? "error" : "success",
    title: texto,
    showConfirmButton: false,
    timer: 1800
  });
}


// =====================
// CARGA ASÍNCRONA DE PRODUCTOS (desde JSON)
// =====================

// Se cargan los productos de forma asíncrona desde el archivo local "productos.json"
async function cargarProductos() {
  try {
    const resp = await fetch("./data/productos.json");
    if (!resp.ok) throw new Error("No se pudieron cargar los productos");
    productos = await resp.json();
  } catch (err) {
    toast("Error al cargar productos", "error");
    console.error(err);
  }
}


// =====================
// RENDERIZADO DE PRODUCTOS EN EL HTML
// =====================

// Crea dinámicamente las tarjetas de productos con sus datos y botones
function renderProductos() {
  const cont = $("#lista-productos");
  if (!cont) return;

  cont.innerHTML = productos
    .map(
      (p) => `
      <article class="card-prod">
        <figure class="imgwrap">
          <img src="${p.img}" alt="${p.nombre}" loading="lazy"
               onerror="this.onerror=null;this.src='./img/placeholder.jpg'">
        </figure>
        <h3>${p.nombre}</h3>
        <p class="precio">$ ${p.precio.toLocaleString("es-AR")}</p>
        <button class="btn btn-add" data-id="${p.id}">Agregar</button>
      </article>`
    )
    .join("");

  // Escucha los clics en los botones "Agregar"
  cont.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-add");
    if (!btn) return;
    addToCart(Number(btn.dataset.id));
  });
}


// =====================
// RENDERIZADO DEL CARRITO
// =====================

// Muestra los productos agregados al carrito y permite cambiar cantidad o eliminar
function renderCarrito() {
  const tbody = $("#carrito-body");
  const totalNode = $("#carrito-total");
  if (!tbody || !totalNode) return;

  // Si el carrito está vacío
  if (carrito.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">Tu carrito está vacío.</td></tr>`;
    totalNode.textContent = "$ 0";
    return;
  }

  // Si hay productos, los muestra en una tabla
  tbody.innerHTML = carrito
    .map(
      (it) => `
      <tr>
        <td><img src="${it.img}" alt="${it.nombre}" width="40" height="40"
                 onerror="this.onerror=null;this.src='./img/placeholder.jpg'"></td>
        <td>${it.nombre}</td>
        <td>$ ${it.precio.toLocaleString("es-AR")}</td>
        <td class="qty">
          <button class="qty-btn" data-accion="dec" data-id="${it.id}">–</button>
          <span>${it.cantidad}</span>
          <button class="qty-btn" data-accion="inc" data-id="${it.id}">+</button>
        </td>
        <td><button class="btn btn-remove" data-id="${it.id}">Quitar</button></td>
      </tr>`
    )
    .join("");

  // Calcula el total del carrito
  const total = carrito.reduce((a, it) => a + it.precio * it.cantidad, 0);
  totalNode.textContent = `$ ${total.toLocaleString("es-AR")}`;

  // Escucha clics en los botones de cantidad o eliminar
  tbody.onclick = (e) => {
    const btn = e.target.closest(".qty-btn");
    const rm = e.target.closest(".btn-remove");
    if (btn) changeQty(Number(btn.dataset.id), btn.dataset.accion === "inc" ? 1 : -1);
    if (rm) removeItem(Number(rm.dataset.id));
  };
}


// =====================
// FUNCIONES PRINCIPALES DEL CARRITO
// =====================

// Agrega un producto al carrito (o incrementa su cantidad si ya existe)
function addToCart(id) {
  const prod = productos.find((p) => p.id === id);
  if (!prod) return;

  const idx = carrito.findIndex((i) => i.id === id);
  if (idx > -1) carrito[idx].cantidad++;
  else carrito.push({ ...prod, cantidad: 1 });

  guardarCarrito();
  renderCarrito();
  toast("Producto agregado al carrito");
}

// Cambia la cantidad de un producto (+ o –)
function changeQty(id, delta) {
  const i = carrito.findIndex((p) => p.id === id);
  if (i === -1) return;

  carrito[i].cantidad += delta;
  if (carrito[i].cantidad <= 0) carrito.splice(i, 1);

  guardarCarrito();
  renderCarrito();
}

// Elimina un producto completamente del carrito
function removeItem(id) {
  carrito = carrito.filter((p) => p.id !== id);
  guardarCarrito();
  renderCarrito();
}

// Vacía todo el carrito
function clearCart() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
  toast("Carrito vaciado");
}


// =====================
// FUNCIONES DEL CHECKOUT
// =====================

// Abre el formulario de compra
function abrirCheckout() {
  $("#checkout").classList.remove("hidden");
  $("#checkout").setAttribute("aria-hidden", "false");
}

// Cierra el formulario de compra
function cerrarCheckout() {
  $("#checkout").classList.add("hidden");
  $("#checkout").setAttribute("aria-hidden", "true");
}

// Precarga los campos del formulario con datos simulados
function precargarCheckout() {
  const f = $("#checkout-form");
  if (!f) return;
  f.nombre.value = "María Mansilla";
  f.email.value = "memansilla96@gmail.com";
  f.direccion.value = "Av. Maipú 1234, Vicente López";
  f.pago.value = "Transferencia";
}

// Maneja el envío del formulario (confirmación de compra)
function onSubmitCheckout(e) {
  e.preventDefault();
  const f = e.target;

  // Validación de campos obligatorios
  if (!f.nombre.value || !f.email.value || !f.direccion.value || !f.pago.value)
    return toast("Completá todos los campos", "error");

  // Si el carrito está vacío
  if (carrito.length === 0)
    return toast("Tu carrito está vacío", "error");

  // Si todo está bien, vacía el carrito y muestra confirmación
  clearCart();
  cerrarCheckout();

  Swal.fire({
    icon: "success",
    title: "¡Compra confirmada!",
    text: "Gracias por tu pedido 🛍️",
    confirmButtonText: "Ok"
  });

  // Limpia el formulario y vuelve a precargar los valores simulados
  f.reset();
  precargarCheckout();
}


// =====================
// INICIALIZACIÓN DEL PROGRAMA
// =====================

// Se ejecuta automáticamente cuando se carga la página
(async function init() {
  await cargarProductos();        // Carga los productos desde el JSON
  renderProductos();              // Muestra el catálogo
  renderCarrito();                // Muestra el carrito guardado
  precargarCheckout();            // Rellena el formulario de prueba

  // Asigna eventos a los botones principales
  $("#btn-vaciar")?.addEventListener("click", clearCart);
  $("#btn-checkout")?.addEventListener("click", abrirCheckout);
  $("#cerrar-checkout")?.addEventListener("click", cerrarCheckout);
  $("#checkout-form")?.addEventListener("submit", onSubmitCheckout);
})();
