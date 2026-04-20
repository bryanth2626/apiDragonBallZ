document.addEventListener("DOMContentLoaded", function() {

    const selectRaza       = document.querySelector("#select-raza")
    const btnMostrar       = document.querySelector("#btn-mostrar")
    const mensajeCargando  = document.querySelector("#mensaje-cargando")
    const seccionTabla     = document.querySelector("#seccion-tabla")
    const tituloTabla      = document.querySelector("#titulo-tabla")
    const cuerpoTabla      = document.querySelector("#cuerpo-tabla")
    const seccionDetalle   = document.querySelector("#seccion-detalle")
    const contenidoDetalle = document.querySelector("#contenido-detalle")
    const btnVolver        = document.querySelector("#btn-volver")
    const modalImagen      = document.querySelector("#modal-imagen")
    const modalImg         = document.querySelector("#modal-img")
    const modalNombre      = document.querySelector("#modal-nombre")
    const btnCerrar        = document.querySelector("#btn-cerrar")

    const razasEnEspanol = {
        "Human":    "Humano",
        "Saiyan":   "Saiyajin",
        "Namekian": "Namekiano"
    }

    // ── BOTÓN MOSTRAR ──
    btnMostrar.addEventListener("click", function() {
        const razaSeleccionada = selectRaza.value

        if (razaSeleccionada === "") {
            alert("Por favor selecciona una raza primero.")
            return
        }

        mensajeCargando.style.display = "block"
        seccionTabla.style.display    = "none"
        seccionDetalle.style.display  = "none"

        fetch("https://dragonball-api.com/api/characters?race=" + razaSeleccionada + "&limit=50")
        .then(function(response) {
            if (response.ok) {
                return response.json()
            }
        })
        .then(function(data) {
            mensajeCargando.style.display = "none"

            const personajes = data.items || data

            tituloTabla.innerHTML = "Personajes - " + razasEnEspanol[razaSeleccionada]

            cuerpoTabla.innerHTML = ""

            personajes.forEach(function(personaje) {
                const fila = document.createElement("tr")
                fila.innerHTML = `
                    <td>${personaje.name}</td>
                    <td>${personaje.ki || "—"}</td>
                    <td>${personaje.gender || "—"}</td>
                    <td>
                        <button class="btn-lupa"
                            data-img="${personaje.image}"
                            data-nombre="${personaje.name}">
                            🔍
                        </button>
                    </td>
                    <td>
                        <button class="btn-ver" data-id="${personaje.id}">Ver</button>
                    </td>
                `
                cuerpoTabla.appendChild(fila)
            })

            seccionTabla.style.display = "block"
        })
        .catch(function(error) {
            mensajeCargando.style.display = "none"
            console.error(error)
            alert("Hubo un error al obtener los personajes.")
        })
    })

    // ── CLIC EN LA TABLA (lupita y botón Ver) ──
    cuerpoTabla.addEventListener("click", function(e) {

        // Si hicieron clic en la lupita
        if (e.target.classList.contains("btn-lupa")) {
            const urlImagen = e.target.getAttribute("data-img")
            const nombre    = e.target.getAttribute("data-nombre")
            modalImg.setAttribute("src", urlImagen)
            modalNombre.innerHTML = nombre
            modalImagen.classList.add("activo")
        }

        // Si hicieron clic en "Ver"
        if (e.target.classList.contains("btn-ver")) {
            const idPersonaje = e.target.getAttribute("data-id")
            cargarDetalle(idPersonaje)
        }
    })

    // ── CARGAR DETALLE ──
    function cargarDetalle(id) {
        contenidoDetalle.innerHTML = "<p>Cargando...</p>"
        seccionTabla.style.display   = "none"
        seccionDetalle.style.display = "block"

        fetch("https://dragonball-api.com/api/characters/" + id)
        .then(function(response) {
            if (response.ok) {
                return response.json()
            }
        })
        .then(function(p) {
            console.log(p)

            contenidoDetalle.innerHTML = `
                <div class="detalle-superior">
                    <img src="${p.image}" alt="${p.name}"
                        onerror="this.src='https://placehold.co/180x220?text=Sin+imagen'">
                    <div class="detalle-info">
                        <h2>${p.name}</h2>
                        <p><span>Raza:</span> ${razasEnEspanol[p.race] || p.race || "—"}</p>
                        <p><span>Género:</span> ${p.gender || "—"}</p>
                        <p><span>Ki:</span> ${p.ki || "—"}</p>
                        <p><span>Ki máximo:</span> ${p.maxKi || "—"}</p>
                        <p><span>Afiliación:</span> ${p.affiliation || "—"}</p>
                        <p><span>Descripción:</span> ${p.description || "Sin descripción."}</p>
                    </div>
                </div>

                <div class="transformaciones">
                    <h3>Transformaciones</h3>
                    <p style="color:#888; font-style:italic;">⚙️ Sección en construcción...</p>
                </div>
            `
        })
        .catch(function(error) {
            console.error(error)
            contenidoDetalle.innerHTML = "<p>Error al cargar el personaje.</p>"
        })
    }

    // ── VOLVER ──
    btnVolver.addEventListener("click", function() {
        seccionDetalle.style.display = "none"
        seccionTabla.style.display   = "block"
    })

    // ── CERRAR MODAL ──
    btnCerrar.addEventListener("click", function() {
        modalImagen.classList.remove("activo")
    })

    // Cerrar modal si hacen clic fuera de la caja
    modalImagen.addEventListener("click", function(e) {
        if (e.target === modalImagen) {
            modalImagen.classList.remove("activo")
        }
    })

})