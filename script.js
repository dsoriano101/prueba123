const canciones = [
  {
    numero: "01",
    titulo: "Padre, Maestro y Amigo",
    descripcion: "Clásico salesiano · El mejor hombre 🥹",
    categoria: "don-bosco",
    categoriaTexto: "Don Bosco",
    archivo: "cancion-padre-maestro-y-amigo.html"
  },
  {
    numero: "02",
    titulo: "Don Bosco Amigo",
    descripcion: "Tu pana full 🤜🏻🤛🏻",
    categoria: "don-bosco",
    categoriaTexto: "Don Bosco",
    archivo: "Don-Bosco-Amigo.html"
  },
  {
    numero: "03",
    titulo: "Un corazón tan grande",
    descripcion: "Pila de grande",
    categoria: "fiesta",
    categoriaTexto: "Fiesta",
    archivo: "cancion-Un-Corazón-Tan-Grande.html"
  },
  {
    numero: "04",
    titulo: "Candombe del Oratorio",
    descripcion: "La de Ysidro 🎉",
    categoria: "oratorio",
    categoriaTexto: "Oratorio",
    archivo: "cancion-candombe-del-oratorio.html"
  },
  {
    numero: "05",
    titulo: "Don Bosco Te Espera",
    descripcion: "Más allá de las estrellas ⭐",
    categoria: "don-bosco",
    categoriaTexto: "Don Bosco",
    archivo: "cancion-Don-Bosco-Te-Espera.html"
  },
  {
    numero: "06",
    titulo: "Salve Don Bosco Santo",
    descripcion: "Joven de corazón",
    categoria: "clasicas",
    categoriaTexto: "Clásicas",
    archivo: "cancion-Salve-Don-Bosco-Santo.html"
  }
];

const buscador = document.getElementById("buscador");
const listaCanciones = document.getElementById("listaCanciones");
const botonesFiltro = document.querySelectorAll(".filter-btn");
const contadorCanciones = document.getElementById("contadorCanciones");
const noResults = document.getElementById("noResults");
const continueCard = document.getElementById("continueCard");
const continueTitle = document.getElementById("continueTitle");
const continueLink = document.getElementById("continueLink");

let categoriaActiva = "todas";

const FAVORITES_KEY = "cdb_favoritas";
const LAST_SONG_KEY = "cdb_ultima_cancion";

function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obtenerFavoritas() {
  const favoritasGuardadas = localStorage.getItem(FAVORITES_KEY);

  if (!favoritasGuardadas) {
    return [];
  }

  try {
    return JSON.parse(favoritasGuardadas);
  } catch {
    return [];
  }
}

function guardarFavoritas(favoritas) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritas));
}

function esFavorita(archivo) {
  return obtenerFavoritas().includes(archivo);
}

function alternarFavorita(archivo) {
  let favoritas = obtenerFavoritas();

  if (favoritas.includes(archivo)) {
    favoritas = favoritas.filter((item) => item !== archivo);
  } else {
    favoritas.push(archivo);
  }

  guardarFavoritas(favoritas);
  renderizarCanciones();
  actualizarFiltros();
  filtrarCanciones();
}

function guardarUltimaCancion(cancion) {
  localStorage.setItem(
    LAST_SONG_KEY,
    JSON.stringify({
      titulo: cancion.titulo,
      archivo: cancion.archivo
    })
  );
}

function cargarUltimaCancion() {
  const ultimaCancion = localStorage.getItem(LAST_SONG_KEY);

  if (!ultimaCancion) {
    continueCard.style.display = "none";
    return;
  }

  try {
    const cancion = JSON.parse(ultimaCancion);

    if (!cancion.titulo || !cancion.archivo) {
      continueCard.style.display = "none";
      return;
    }

    continueTitle.textContent = cancion.titulo;
    continueLink.href = cancion.archivo;
    continueCard.style.display = "flex";
  } catch {
    continueCard.style.display = "none";
  }
}

function crearCancionHTML(cancion) {
  const favoritaActiva = esFavorita(cancion.archivo) ? "is-active" : "";
  const corazon = esFavorita(cancion.archivo) ? "♥" : "♡";

  return `
    <article 
      class="song-card" 
      data-categoria="${cancion.categoria}"
      data-titulo="${cancion.titulo}"
      data-descripcion="${cancion.descripcion}"
      data-archivo="${cancion.archivo}"
    >
      <div class="track-number">${cancion.numero}</div>

      <div class="track-main">
        <div class="song-info">
          <h3>${cancion.titulo}</h3>
          <p>${cancion.descripcion}</p>
        </div>

        <button 
          class="favorite-btn ${favoritaActiva}" 
          type="button" 
          aria-label="Marcar como favorita"
          data-fav="${cancion.archivo}"
        >
          ${corazon}
        </button>
      </div>

      <div class="track-category">${cancion.categoriaTexto}</div>

      <a href="${cancion.archivo}" class="song-link" data-open="${cancion.archivo}">
        Abrir
      </a>
    </article>
  `;
}

function renderizarCanciones() {
  listaCanciones.innerHTML = canciones.map(crearCancionHTML).join("");

  const botonesFavoritos = document.querySelectorAll(".favorite-btn");
  const enlacesCanciones = document.querySelectorAll(".song-link");
  const tarjetasCanciones = document.querySelectorAll(".song-card");

  botonesFavoritos.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const archivo = boton.dataset.fav;
      alternarFavorita(archivo);
    });
  });

  enlacesCanciones.forEach((enlace) => {
    enlace.addEventListener("click", () => {
      const archivo = enlace.dataset.open;
      const cancion = canciones.find((item) => item.archivo === archivo);

      if (cancion) {
        guardarUltimaCancion(cancion);
      }
    });
  });

  tarjetasCanciones.forEach((tarjeta) => {
    tarjeta.addEventListener("click", (event) => {
      const clicEnFavorito = event.target.closest(".favorite-btn");
      const clicEnLink = event.target.closest(".song-link");

      if (clicEnFavorito || clicEnLink) {
        return;
      }

      const archivo = tarjeta.dataset.archivo;
      const cancion = canciones.find((item) => item.archivo === archivo);

      if (cancion) {
        guardarUltimaCancion(cancion);
        window.location.href = cancion.archivo;
      }
    });
  });
}

function contarPorCategoria(categoria) {
  if (categoria === "todas") {
    return canciones.length;
  }

  if (categoria === "favoritas") {
    return obtenerFavoritas().length;
  }

  return canciones.filter((cancion) => cancion.categoria === categoria).length;
}

function obtenerNombreFiltro(filtro) {
  const nombres = {
    todas: "Todas",
    favoritas: "Favoritas",
    "don-bosco": "Don Bosco",
    oratorio: "Oratorio",
    fiesta: "Fiesta",
    clasicas: "Clásicas"
  };

  return nombres[filtro] || filtro;
}

function actualizarFiltros() {
  botonesFiltro.forEach((boton) => {
    const filtro = boton.dataset.filtro;
    const textoBase = obtenerNombreFiltro(filtro);
    const cantidad = contarPorCategoria(filtro);

    boton.textContent = `${textoBase} ${cantidad}`;
  });
}

function actualizarContador(cantidadVisible) {
  const textoBusqueda = buscador.value.trim();
  const nombreCategoria = obtenerNombreFiltro(categoriaActiva);

  if (cantidadVisible === 0) {
    contadorCanciones.textContent = "No hay canciones encontradas";
    return;
  }

  if (categoriaActiva === "todas" && textoBusqueda === "") {
    contadorCanciones.textContent = `${cantidadVisible} canciones disponibles`;
    return;
  }

  if (categoriaActiva === "favoritas") {
    contadorCanciones.textContent =
      cantidadVisible === 1
        ? "1 canción favorita"
        : `${cantidadVisible} canciones favoritas`;
    return;
  }

  contadorCanciones.textContent =
    cantidadVisible === 1
      ? `1 canción encontrada en ${nombreCategoria}`
      : `${cantidadVisible} canciones encontradas en ${nombreCategoria}`;
}

function filtrarCanciones() {
  const textoBusqueda = normalizarTexto(buscador.value.trim());
  const tarjetas = document.querySelectorAll(".song-card");
  const favoritas = obtenerFavoritas();

  let visibles = 0;

  tarjetas.forEach((tarjeta) => {
    const titulo = normalizarTexto(tarjeta.dataset.titulo || "");
    const descripcion = normalizarTexto(tarjeta.dataset.descripcion || "");
    const categoria = tarjeta.dataset.categoria || "";
    const archivo = tarjeta.dataset.archivo || "";

    const coincideBusqueda =
      titulo.includes(textoBusqueda) ||
      descripcion.includes(textoBusqueda) ||
      categoria.includes(textoBusqueda);

    const coincideCategoria =
      categoriaActiva === "todas" ||
      categoriaActiva === categoria ||
      (categoriaActiva === "favoritas" && favoritas.includes(archivo));

    const debeMostrarse = coincideBusqueda && coincideCategoria;

    if (debeMostrarse) {
      tarjeta.classList.remove("is-hidden");

      setTimeout(() => {
        tarjeta.classList.remove("is-hiding");
      }, 20);

      visibles++;
    } else {
      tarjeta.classList.add("is-hiding");

      setTimeout(() => {
        tarjeta.classList.add("is-hidden");
      }, 180);
    }
  });

  actualizarContador(visibles);

  setTimeout(() => {
    noResults.style.display = visibles === 0 ? "block" : "none";
  }, 200);
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

renderizarCanciones();
actualizarFiltros();
cargarUltimaCancion();
filtrarCanciones();
