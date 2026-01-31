// officialknz/frontend/logicacounter.js

const MAPAS = [
    { id: "dust2", nombre: "Dust II" },
    { id: "mirage", nombre: "Mirage" },
    { id: "inferno", nombre: "Inferno" },
    { id: "ancient", nombre: "Ancient" },
    { id: "anubis", nombre: "Anubis" },
    { id: "overpass", nombre: "Overpass" },
    { id: "vertigo", nombre: "Vertigo" },
    { id: "nuke", nombre: "Nuke" },
    { id: "office", nombre: "Office" },
    { id: "italy", nombre: "Italy" }
];

const FOTOS_UTILIDAD = {
    dust2: [
        { titulo: "Humo Cruce", archivo: "d2_humo_cruce.jpg", categoria: "humo" }
    ],
    mirage: [],
    inferno: [],
    ancient: [],
    anubis: [],
    overpass: [],
    vertigo: [],
    nuke: [],
    office: [],
    italy: []
};

let mapaActual = "";
let filtroActual = "todos";

function renderizarMapas() {
    const contenedor = document.getElementById("contenedor-mapas");
    contenedor.innerHTML = "";
    MAPAS.forEach(mapa => {
        contenedor.innerHTML += `
            <div class="col-6 col-md-4 col-lg-3">
                <div class="card h-100 text-center shadow-sm py-3 border-0" style="cursor: pointer;" onclick="verMapa('${mapa.id}')">
                    <div class="card-body p-1">
                        <h6 class="card-title m-0 fw-bold">${mapa.nombre}</h6>
                    </div>
                </div>
            </div>`;
    });
}

function verMapa(mapaId) {
    mapaActual = mapaId;
    filtroActual = "todos";
    const mapa = MAPAS.find(m => m.id === mapaId);
    document.getElementById("nombre-mapa-seleccionado").innerText = mapa.nombre;
    document.getElementById("contenedor-mapas").style.display = "none";
    document.getElementById("seccion-fotos").style.display = "block";
    renderizarFotos();
}

function filtrarUtilidad(tipo) {
    filtroActual = tipo;
    const botones = document.querySelectorAll(".btn-group .btn");
    botones.forEach(b => b.classList.remove("active"));
    event.target.classList.add("active");
    renderizarFotos();
}

function renderizarFotos() {
    const galeria = document.getElementById("galeria-fotos");
    galeria.innerHTML = "";
    const todas = FOTOS_UTILIDAD[mapaActual] || [];
    const filtradas = filtroActual === "todos" ? todas : todas.filter(f => f.categoria === filtroActual);

    if (filtradas.length === 0) {
        galeria.innerHTML = `<div class="col-12 text-center text-muted p-5">Subiendo utilidades pronto...</div>`;
        return;
    }

    filtradas.forEach(f => {
        galeria.innerHTML += `
            <div class="col-12 col-md-4">
                <div class="card shadow-sm border-0" style="cursor: pointer;" onclick="abrirZoom('fotoscounter/${f.archivo}', '${f.titulo}')">
                    <img src="fotoscounter/${f.archivo}" class="card-img-top">
                    <div class="card-footer bg-white border-0 text-center">
                        <span class="small fw-bold text-uppercase">${f.titulo}</span>
                    </div>
                </div>
            </div>`;
    });
}

function abrirZoom(src, titulo) {
    document.getElementById("imagenZoom").src = src;
    document.getElementById("tituloZoom").innerText = titulo;
    const myModal = new bootstrap.Modal(document.getElementById('modalImagen'));
    myModal.show();
}

function volverAMapas() {
    document.getElementById("contenedor-mapas").style.display = "flex";
    document.getElementById("seccion-fotos").style.display = "none";
}

renderizarMapas();