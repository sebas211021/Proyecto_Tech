const normalizar = s =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const crearCards = p => `
  <div class="col">
    <div class="card h-100 shadow-sm">
      <img src="${p.imgURL}" class="card-img-top imagen_fija" alt="${p.nombre}">
      <div class="card-body text-center">
        <h5 class="card-title fw-bold text-dark">${p.nombre}</h5>
        <p class="card-text">${p.descripcion}</p>
        <h4 class="text-danger fw-bold">$${p.precio.toLocaleString("es-CO")}</h4>
        <button class="btn btn-dark" data-id="${p.id}" data-name="${p.nombre}" data-price="${p.precio}">
          <i class="bi bi-cart"></i> Agregar al carrito
        </button>
      </div>
    </div>
  </div>
`;

const estadoBusqueda = { productos: [], plano: [], listo: false };

const cargarProductos = async () => {
  const resp = await fetch("productos.json");
  if (!resp.ok) throw new Error("No se pudo cargar productos.json");
  const data = await resp.json();
  estadoBusqueda.plano = [
    ...data.hamburguesas.map(x => ({ ...x, categoria: "Hamburguesas" })),
    ...data.perrosCalientes.map(x => ({ ...x, categoria: "Perros Calientes" })),
    ...data.arepas.map(x => ({ ...x, categoria: "Arepas" }))
  ];
  estadoBusqueda.listo = true;
};

const initBuscador = async () => {
  const form = document.getElementById("form-busqueda");
  const input = document.getElementById("input-buscar");
  const bloque = document.getElementById("bloque-busqueda");
  const grid = document.getElementById("grid-busqueda");
  const resumen = document.getElementById("resumen-busqueda");
  if (!form || !input || !bloque || !grid || !resumen) return;

  try {
    if (!estadoBusqueda.listo) await cargarProductos();
  } catch (e) {
    console.error("Error cargando productos:", e);
    return;
  }

  const buscar = () => {
    const q = normalizar(input.value.trim());
    if (!q) {
      bloque.classList.add("d-none");
      grid.innerHTML = "";
      resumen.textContent = "";
      return;
    }

    const resultados = estadoBusqueda.plano.filter(p =>
      normalizar(p.nombre).includes(q) ||
      normalizar(p.descripcion || "").includes(q)
    );

    grid.innerHTML = resultados.map(crearCards).join("");
    resumen.textContent = `${resultados.length} resultado(s)`;
    bloque.classList.toggle("d-none", resultados.length === 0);
  };

  form.addEventListener("submit", e => {
    e.preventDefault();
    buscar();
  });

  let timer = null;
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(buscar, 250);
  });
};

document.addEventListener("DOMContentLoaded", initBuscador);
