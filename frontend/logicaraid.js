// officialknz/frontend/logicaraid.js

const DATOS_RAID = [
    // --- PAREDES ---
    { nombre: "Pared de madera", tipo: "pared", calidad: 2, hp: 250, explosiva: 56, satchel: 3, cohete: 2, c4: 1, molotov: 4, beancan: 13, f1: 29, ammo556: 209, imagen: "pareddemadera.avif" },
    { nombre: "Media pared de madera", tipo: "pared", calidad: 2, hp: 250, explosiva: 56, satchel: 3, cohete: 2, c4: 1, molotov: 4, beancan: 13, f1: 29, ammo556: 209, imagen: "mediapareddemadera.avif" },
    { nombre: "Pared baja de madera", tipo: "pared", calidad: 2, hp: 250, explosiva: 56, satchel: 3, cohete: 2, c4: 1, molotov: 4, beancan: 13, f1: 29, ammo556: 209, imagen: "paredbajademadera.avif" },
    { nombre: "Entrada de madera", tipo: "pared", calidad: 2, hp: 250, explosiva: 56, satchel: 3, cohete: 2, c4: 1, molotov: 4, beancan: 13, f1: 29, ammo556: 209, imagen: "entradademadera.avif" },

    { nombre: "Muro de piedra", tipo: "pared", calidad: 3, hp: 500, explosiva: 185, satchel: 10, cohete: 4, c4: 2, beancan: 46, f1: 182, imagen: "murodepiedra.avif" },
    { nombre: "Media pared de piedra", tipo: "pared", calidad: 3, hp: 500, explosiva: 185, satchel: 10, cohete: 4, c4: 2, beancan: 46, f1: 182, imagen: "mediapareddepiedra.avif" },
    { nombre: "Pared baja de piedra", tipo: "pared", calidad: 3, hp: 500, explosiva: 185, satchel: 10, cohete: 4, c4: 2, beancan: 46, f1: 182, imagen: "paredbajadepiedra.avif" },
    { nombre: "Marco para puerta de piedra", tipo: "pared", calidad: 3, hp: 500, explosiva: 185, satchel: 10, cohete: 4, c4: 2, beancan: 46, f1: 182, imagen: "marcoparapuertadepiedra.avif" },

    { nombre: "Pared de metal", tipo: "pared", calidad: 4, hp: 1000, explosiva: 400, satchel: 23, cohete: 8, c4: 4, beancan: 112, f1: 993, imagen: "pareddemetal.avif" },
    { nombre: "Media pared de metal", tipo: "pared", calidad: 4, hp: 1000, explosiva: 400, satchel: 23, cohete: 8, c4: 4, beancan: 112, f1: 993, imagen: "mediapareddemetal.avif" },
    { nombre: "Marco de puerta de metal", tipo: "pared", calidad: 4, hp: 1000, explosiva: 400, satchel: 23, cohete: 8, c4: 4, beancan: 112, f1: 993, imagen: "marcodepuertademetal.avif" },

    { nombre: "Pared de alta calidad", tipo: "pared", calidad: 5, hp: 2000, explosiva: 799, satchel: 46, cohete: 15, c4: 8, beancan: 223, f1: 1986, imagen: "pareddealtacalidad.avif" },
    { nombre: "Media pared de alta calidad", tipo: "pared", calidad: 5, hp: 2000, explosiva: 799, satchel: 46, cohete: 15, c4: 8, beancan: 223, f1: 1986, imagen: "mediapareddealtacalidad.avif" },
    { nombre: "Pared baja de alta calidad", tipo: "pared", calidad: 5, hp: 2000, explosiva: 799, satchel: 46, cohete: 15, c4: 8, beancan: 223, f1: 1986, imagen: "paredbajadealtacalidad.avif" },
    { nombre: "Marco de puerta de alta calidad", tipo: "pared", calidad: 5, hp: 2000, explosiva: 799, satchel: 46, cohete: 15, c4: 8, beancan: 223, f1: 1986, imagen: "marcodepuertadealtacalidad.avif" },

    // --- SUELOS / TRAMPILLAS ---
    { nombre: "Suelo de rejilla", tipo: "suelo", calidad: 3, hp: 250, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "sueloderejilla.avif" },
    { nombre: "Suelo de rejilla triangular", tipo: "suelo", calidad: 3, hp: 250, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "sueloderejillatriangular.avif" },
    { nombre: "Trampilla", tipo: "suelo", calidad: 3, hp: 250, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "trampilla.avif" },
    { nombre: "Trampilla triangular", tipo: "suelo", calidad: 3, hp: 250, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "trampillatriangular.avif" },

    // --- PUERTAS ---
    { nombre: "Puerta de madera", tipo: "puerta", calidad: 2, hp: 200, explosiva: 18, satchel: 2, cohete: 1, c4: 1, molotov: 2, beancan: 6, f1: 23, ammo556: 170, imagen: "puertademadera.avif" },
    { nombre: "Puerta doble de madera", tipo: "puerta", calidad: 2, hp: 200, explosiva: 18, satchel: 2, cohete: 1, c4: 1, molotov: 2, beancan: 6, f1: 23, ammo556: 170, imagen: "puertadobledemadera.avif" },
    { nombre: "Puerta de chapa", tipo: "puerta", calidad: 3, hp: 250, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "puertadechapa.avif" },
    { nombre: "Puerta doble de chapa", tipo: "puerta", calidad: 3, hp: 250, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "puertadobledechapa.avif" },
    { nombre: "Reja de cárcel", tipo: "puerta", calidad: 3, hp: 300, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "rejadecarcel.avif" },
    { nombre: "Portón de celda de prisión", tipo: "puerta", calidad: 3, hp: 300, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "portondeceldadeprision.avif" },
    { nombre: "Puerta de garaje", tipo: "puerta", calidad: 4, hp: 600, explosiva: 150, satchel: 9, cohete: 3, c4: 2, beancan: 44, f1: 120, imagen: "puertadegaraje.avif" },
    { nombre: "Puerta blindada", tipo: "puerta", calidad: 5, hp: 1000, explosiva: 200, satchel: 12, cohete: 4, c4: 2, beancan: 69, f1: 200, imagen: "puertablindada.avif" },
    { nombre: "Puerta doble blindada", tipo: "puerta", calidad: 5, hp: 1000, explosiva: 200, satchel: 12, cohete: 4, c4: 2, beancan: 69, f1: 200, imagen: "puertadobleblindada.avif" },

    // --- VENTANAS ---
    { nombre: "Contraventana", tipo: "ventana", calidad: 2, hp: 200, explosiva: 18, satchel: 2, cohete: 1, c4: 1, molotov: 2, beancan: 6, f1: 23, imagen: "contraventana.avif" },
    { nombre: "Rejas de madera", tipo: "ventana", calidad: 2, hp: 250, explosiva: 18, satchel: 2, cohete: 1, c4: 1, molotov: 4, beancan: 13, f1: 29, imagen: "rejasdemadera.avif" },
    { nombre: "Rejas de metal", tipo: "ventana", calidad: 3, hp: 500, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "rejasdemetal.avif" },
    { nombre: "Tronera de metal vertical", tipo: "ventana", calidad: 3, hp: 500, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "tronerademetalvertical.avif" },
    { nombre: "Tronera horizontal de metal", tipo: "ventana", calidad: 3, hp: 500, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 18, f1: 50, imagen: "tronerahorizontaldemetal.avif" },
    { nombre: "Ventana de cristal reforzado", tipo: "ventana", calidad: 4, hp: 350, explosiva: 200, satchel: 12, cohete: 4, c4: 2, beancan: 26, f1: 70, imagen: "ventanadecristalreforzado.avif" },
    { nombre: "Escaparate de tienda metálico", tipo: "ventana", calidad: 4, hp: 750, explosiva: 200, satchel: 12, cohete: 4, c4: 2, beancan: 54, f1: 150, imagen: "escaparatedetiendametalico.avif" },
    { nombre: "Ventana de rejas blindada", tipo: "ventana", calidad: 5, hp: 500, explosiva: 200, satchel: 12, cohete: 4, c4: 2, beancan: 35, f1: 100, imagen: "ventanaderejasblindada.avif" },

    // --- MURALLAS / PORTONES ---
    { nombre: "Pared Alta de Madera", tipo: "muralla", calidad: 2, hp: 500, explosiva: 56, satchel: 3, cohete: 2, c4: 1, molotov: 8, beancan: 26, imagen: "paredaltademadera.avif" },
    { nombre: "Portón exterior de madera", tipo: "muralla", calidad: 2, hp: 500, explosiva: 56, satchel: 3, cohete: 2, c4: 1, molotov: 8, beancan: 26, imagen: "portonexteriordemadera.avif" },
    { nombre: "Pared Alta de Piedra", tipo: "muralla", calidad: 3, hp: 500, explosiva: 185, satchel: 10, cohete: 4, c4: 2, beancan: 46, f1: 182, imagen: "paredaltadepiedra.avif" },
    { nombre: "Portón exterior de piedra", tipo: "muralla", calidad: 3, hp: 500, explosiva: 185, satchel: 10, cohete: 4, c4: 2, beancan: 46, f1: 182, imagen: "portonexteriordepiedra.avif" },

    // --- VALLAS ---
    { nombre: "Valla Alambrada", tipo: "valla", calidad: 4, hp: 100, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 7, f1: 20, imagen: "vallaalambrada.avif" },
    { nombre: "Portón de Valla Alambrada", tipo: "valla", calidad: 4, hp: 75, explosiva: 63, satchel: 4, cohete: 1, c4: 1, beancan: 6, f1: 15, imagen: "portondevallaalambrada.avif" },

    // --- BARRICADAS ---
    { nombre: "Barricada de pinchos", tipo: "barricada", calidad: 2, hp: 250, explosiva: 2, satchel: 1, cohete: 1, c4: 1, molotov: 4, imagen: "barricadadepinchos.avif" },
    { nombre: "Barricada de pinchos con espino", tipo: "barricada", calidad: 2, hp: 400, explosiva: 5, satchel: 1, cohete: 1, c4: 1, molotov: 6, imagen: "barricadadepinchosconespino.avif" },
    { nombre: "Barricada de madera", tipo: "barricada", calidad: 2, hp: 250, explosiva: 56, satchel: 3, cohete: 2, c4: 1, molotov: 4, imagen: "barricadademadera.avif" },
    { nombre: "Barricada de piedras", tipo: "barricada", calidad: 3, hp: 100, explosiva: 185, satchel: 10, cohete: 4, c4: 2, beancan: 9, f1: 36, imagen: "barricadadepiedras.avif" },
    { nombre: "Barricada de metal", tipo: "barricada", calidad: 4, hp: 600, explosiva: 400, satchel: 23, cohete: 8, c4: 4, beancan: 67, imagen: "barricadademetal.avif" },
    { nombre: "Barricada de hormigón", tipo: "barricada", calidad: 3, hp: 500, explosiva: 185, satchel: 10, cohete: 4, c4: 2, beancan: 46, f1: 182, imagen: "barricadadehormigon.avif" },

    // --- OBJETOS ---
    { nombre: "Escalera de mano", tipo: "objeto", calidad: 2, hp: 100, explosiva: 5, satchel: 1, cohete: 1, c4: 1, molotov: 2, imagen: "escalerademano.avif" },
    { nombre: "Armario de herramientas", tipo: "objeto", calidad: 2, hp: 100, explosiva: 5, satchel: 1, cohete: 1, c4: 1, molotov: 1, beancan: 4, ammo556: 100, imagen: "armariodeherramientas.avif" },
    { nombre: "Atalaya", tipo: "objeto", calidad: 2, hp: 200, explosiva: 56, satchel: 3, cohete: 2, c4: 1, molotov: 4, imagen: "atalaya.avif" },
    { nombre: "Refugio de madera arcaico", tipo: "objeto", calidad: 2, hp: 500, explosiva: 56, satchel: 3, cohete: 2, c4: 1, molotov: 8, imagen: "refugiodemaderaarcaico.avif" },
    { nombre: "Torreta Automática", tipo: "objeto", calidad: 4, hp: 1000, explosiva: 112, satchel: 6, cohete: 3, c4: 1, beancan: 40, f1: 150, imagen: "torretaautomatica.avif" },
    { nombre: "Maquina Expendedora", tipo: "objeto", calidad: 4, hp: 1250, explosiva: 150, satchel: 9, cohete: 3, c4: 2, beancan: 50, f1: 200, imagen: "maquinaexpendedora.avif" }
];

const COSTES_BASE = {
    explosiva: { sulfur: 25, gp: 50 },
    satchel: { sulfur: 480, gp: 720 },
    cohete: { sulfur: 1400, gp: 1950 },
    c4: { sulfur: 2200, gp: 3000 },
    molotov: { sulfur: 0, gp: 0, lowgrade: 50, cloth: 10 }, // Datos extra para molotov
    beancan: { sulfur: 120, gp: 60 },
    f1: { sulfur: 60, gp: 30 },
    ammo556: { sulfur: 10, gp: 5 }
};

let categoriaSeleccionada = 'todo';

function filtrar(categoria) {
    categoriaSeleccionada = categoria;
    ejecutarFiltrado();
}

function buscarObjeto() {
    ejecutarFiltrado();
}

function ejecutarFiltrado() {
    const textoBuscado = document.getElementById("buscador").value.toLowerCase();
    const lista = document.getElementById("lista-objetivos");
    
    // CORRECCIÓN: Forzamos una altura mínima para que el footer no suba.
    // '80vh' significa el 80% de la altura de la pantalla del usuario.
    lista.style.minHeight = "80vh"; 
    
    lista.innerHTML = "";
    
    let filtrados = categoriaSeleccionada === 'todo' 
        ? DATOS_RAID 
        : DATOS_RAID.filter(i => i.tipo === categoriaSeleccionada);

    if (textoBuscado !== "") {
        filtrados = filtrados.filter(obj => 
            obj.nombre.toLowerCase().includes(textoBuscado)
        );
    }

    filtrados.sort((a, b) => a.calidad - b.calidad || a.hp - b.hp);

    if (filtrados.length === 0) {
        lista.innerHTML = "<div class='p-3 text-muted text-center'>No se encontró nada</div>";
        return;
    }

    let ultimaCalidad = null;
    const nombresCalidad = {
        2: { nombre: "MADERA", clase: "bg-success text-white" },
        3: { nombre: "PIEDRA", clase: "bg-secondary text-white" },
        4: { nombre: "METAL", clase: "bg-primary text-white" },
        5: { nombre: "ALTA CALIDAD (HQM)", clase: "bg-danger text-white" }
    };

    filtrados.forEach(obj => {
        if (obj.calidad !== ultimaCalidad) {
            const divisor = document.createElement("div");
            divisor.className = `p-2 fw-bold small text-center ${nombresCalidad[obj.calidad].clase}`;
            divisor.style.letterSpacing = "2px";
            divisor.innerText = `--- ${nombresCalidad[obj.calidad].nombre} ---`;
            lista.appendChild(divisor);
            ultimaCalidad = obj.calidad;
        }

        const btn = document.createElement("button");
        btn.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 border-bottom";
        
        const coloresPuntos = { 2: "#198754", 3: "#6c757d", 4: "#0d6efd", 5: "#dc3545" };
        const dotColor = coloresPuntos[obj.calidad];
        
        btn.innerHTML = `
            <span>
                <span style="color: ${dotColor}; margin-right: 8px;">●</span>
                ${obj.nombre}
            </span> 
            <span class="badge bg-light text-dark border rounded-pill">${obj.hp} HP</span>
        `;
        btn.onclick = () => mostrarCalculo(obj);
        lista.appendChild(btn);
    });
}

function mostrarCalculo(obj) {
    document.getElementById("instruccion").style.display = "none";
    document.getElementById("info-calculo").style.display = "block";
    document.getElementById("nombre-objetivo").innerText = `${obj.nombre} [${obj.hp} HP]`;

    const imgTag = document.getElementById("foto-objetivo");
    
    if (obj.imagen) {
        imgTag.src = `fotosrust/${obj.imagen}`;
        imgTag.style.display = "block";
    } else {
        imgTag.style.display = "none";
    }

    const tabla = document.getElementById("tabla-cuerpo");
    tabla.innerHTML = "";

    const metodos = [
        { id: "explosiva", nombre: "Munición Explosiva", icono: "💥" },
        { id: "satchel", nombre: "Satchels", icono: "🎒" },
        { id: "beancan", nombre: "Granada de Lata", icono: "🥫" },
        { id: "cohete", nombre: "Cohete", icono: "🚀" },
        { id: "c4", nombre: "C4 (Timed)", icono: "🧨" },
        { id: "f1", nombre: "Granada F1", icono: "💣" },
        { id: "molotov", nombre: "Cóctel Molotov", icono: "🔥" },
        { id: "ammo556", nombre: "Munición 5.56", icono: "🔫" }
    ];

    metodos.forEach(m => {
        if (obj[m.id] && obj[m.id] > 0) {
            const cant = obj[m.id];
            const s = cant * COSTES_BASE[m.id].sulfur;
            const g = cant * COSTES_BASE[m.id].gp;

            let sulfurText = s > 0 ? `${s.toLocaleString()} <small style="font-size: 0.8em;">🟡</small>` : "-";
            let gpText = g > 0 ? `${g.toLocaleString()} <small style="font-size: 0.8em;">⚫</small>` : "-";

            tabla.innerHTML += `
                <tr>
                    <td class="text-start fw-bold">
                        <span class="me-2">${m.icono}</span>${m.nombre}
                    </td>
                    <td class="text-center">
                        <span class="badge bg-dark px-3">${cant.toLocaleString()}</span>
                    </td>
                    <td class="text-end text-warning fw-bold">
                        ${sulfurText}
                    </td>
                    <td class="text-end text-info fw-bold">
                        ${gpText}
                    </td>
                </tr>
            `;

            // LÓGICA EXTRA PARA MOLOTOV: Combustible y Tela
            if (m.id === "molotov") {
                const totalLowGrade = cant * COSTES_BASE.molotov.lowgrade;
                const totalCloth = cant * COSTES_BASE.molotov.cloth;

                tabla.innerHTML += `
                    <tr class="table-light">
                        <td class="text-start ps-4 small text-muted">↳ Combustible Bajo Grado</td>
                        <td class="text-center small">x${totalLowGrade}</td>
                        <td colspan="2" class="text-end small text-muted">Recurso orgánico ⛽</td>
                    </tr>
                    <tr class="table-light">
                        <td class="text-start ps-4 small text-muted">↳ Tela</td>
                        <td class="text-center small">x${totalCloth}</td>
                        <td colspan="2" class="text-end small text-muted">Recurso orgánico 🧶</td>
                    </tr>
                `;
            }
        }
    });
}

// Carga Inicial
filtrar('todo');