const buscador = document.getElementById("buscador");
const canciones = document.querySelectorAll(".song-card");
const botonesFiltro = document.querySelectorAll(".filter-btn");
const contadorCanciones = document.getElementById("contadorCanciones");
const noResults = document.getElementById("noResults");

let categoriaActiva = "todas";

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function actualizarContador(cantidad) {
  const busquedaActiva = buscador.value.trim() !== "";

  if (cantidad === 0) {
    contadorCanciones.textContent = "No hay canciones encontradas";
  } else if (cantidad === 1) {
    contadorCanciones.textContent = "1 canción encontrada";
  } else if (
    cantidad === canciones.length &&
    categoriaActiva === "todas" &&
    !busquedaActiva
  ) {
    contadorCanciones.textContent = `${cantidad} canciones disponibles`;
  } else {
    contadorCanciones.textContent = `${cantidad} canciones encontradas`;
  }
}

function mostrarCancion(cancion) {
  cancion.classList.remove("is-hidden");

  setTimeout(() => {
    cancion.classList.remove("is-hiding");
  }, 20);
}

function ocultarCancion(cancion) {
  cancion.classList.add("is-hiding");

  setTimeout(() => {
    cancion.classList.add("is-hidden");
  }, 260);
}

function filtrarCanciones() {
  const textoBusqueda = normalizarTexto(buscador.value.trim());
  let visibles = 0;

  canciones.forEach((cancion) => {
    const titulo = normalizarTexto(
      cancion.querySelector("h3").textContent
    );

    const descripcion = normalizarTexto(
      cancion.querySelector("p").textContent
    );

    const categoria = cancion.dataset.categoria;

    const coincideBusqueda =
      titulo.includes(textoBusqueda) ||
      descripcion.includes(textoBusqueda) ||
      categoria.includes(textoBusqueda);

    const coincideCategoria =
      categoriaActiva === "todas" || categoria === categoriaActiva;

    const debeMostrarse = coincideBusqueda && coincideCategoria;

    if (debeMostrarse) {
      mostrarCancion(cancion);
      visibles++;
    } else {
      ocultarCancion(cancion);
    }
  });

  actualizarContador(visibles);

  setTimeout(() => {
    if (visibles === 0) {
      noResults.style.display = "block";
    } else {
      noResults.style.display = "none";
    }
  }, 280);
}

botonesFiltro.forEach((boton) => {
  boton.addEventListener("click", () => {
    botonesFiltro.forEach((btn) => {
      btn.classList.remove("active");
    });

    boton.classList.add("active");
    categoriaActiva = boton.dataset.filtro;

    filtrarCanciones();
  });
});

buscador.addEventListener("input", filtrarCanciones);

actualizarContador(canciones.length);
noResults.style.display = "none";