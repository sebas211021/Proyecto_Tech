document.addEventListener("DOMContentLoaded", async () => {
  try {
    const resp = await fetch("./productos.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    const todos = [
      ...data.hamburguesas,
      ...data.perrosCalientes,
      ...data.arepas
    ];

    // Elegir 4 recomendados (puedes cambiarlos a mano)
    const recomendados = [
      data.hamburguesas[0],
      data.hamburguesas[1],
      data.perrosCalientes[1],
      data.arepas[0]
    ];

    const cont = document.getElementById("grid-recomendados");
    cont.innerHTML = recomendados.map(p => `
      <div class="col">
        <div class="card h-100">
          <img src="${p.imgURL}" class="card-img-top imagen_fija" alt="${p.id}">
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
    `).join("");

  } catch (err) {
    console.error("Error cargando recomendados:", err);
  }
});
