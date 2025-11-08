const itemsPorPagina = 2;

const estado = {
  hamburguesas: 1,
  perrosCalientes: 1,
  arepas: 1
};

async function obtenerProductos() {
  try {
    const respuesta = await fetch("./productos.json");
    if (!respuesta.ok) throw new Error(`Error al cargar el JSON: ${respuesta.status}`);
    const productos = await respuesta.json();

    mostrarProductos(productos);
  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

function mostrarProductos(productos) {
  renderConPaginacion("hamburguesas", productos.hamburguesas);
  renderConPaginacion("perrosCalientes", productos.perrosCalientes);
  renderConPaginacion("arepas", productos.arepas);
}

function renderConPaginacion(tipo, lista) {
  const pagina = estado[tipo];
  const inicio = (pagina - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const productosPagina = lista.slice(inicio, fin);

  const contenedor = document.querySelector(
    `#pills-${tipo === "hamburguesas" ? "home" : tipo === "perrosCalientes" ? "profile" : "contact"} .row`
  );
  const contenedorPadre = contenedor.parentElement;

  contenedor.innerHTML = "";
  productosPagina.forEach(producto => {
    contenedor.innerHTML += crearCard(producto);
  });

  const paginacionAnterior = contenedorPadre.querySelector(".paginacion-wrapper");
  if (paginacionAnterior) {
    paginacionAnterior.remove();
  }

  renderPaginacion(tipo, lista.length, contenedorPadre);
}

function renderPaginacion(tipo, totalItems, contenedorPadre) {
  const totalPaginas = Math.ceil(totalItems / itemsPorPagina);
  if (totalPaginas <= 1) return; // Ocultar paginación si hay solo 1 página

  const paginacionWrapper = document.createElement("div");
  paginacionWrapper.className = "row w-100 paginacion-wrapper";

  const paginacion = document.createElement("ul");
  paginacion.className = "pagination justify-content-center mt-3";

  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === estado[tipo] ? "active" : ""}`;

    const a = document.createElement("a");
    a.className = "page-link custom-paginacion";
    a.href = "#";
    a.textContent = i;
    a.onclick = () => cambiarPagina(tipo, i);

    li.appendChild(a);
    paginacion.appendChild(li);
  }

  paginacionWrapper.appendChild(paginacion);
  contenedorPadre.appendChild(paginacionWrapper);
}

function cambiarPagina(tipo, pagina) {
  estado[tipo] = pagina;
  obtenerProductos();
}

function crearCard(producto) {
  return `
    <div class="col">
      <div class="card h-100">
        <img src="${producto.imgURL}" class="card-img-top imagen_fija" alt="${producto.nombre}">
        <div class="card-body text-center">
          <h5 class="card-title fw-bold text-dark">${producto.nombre}</h5>
          <p class="card-text">${producto.descripcion}</p>
          <h4 class="text-danger fw-bold">$${producto.precio.toLocaleString("es-CO")}</h4>
          <button class="btn btn-dark" data-id="${producto.id}" data-name="${producto.nombre}" data-price="${producto.precio}">
            <i class="bi bi-cart"></i> Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  `;
}

obtenerProductos();
