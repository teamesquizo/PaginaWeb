// officialknz/frontend/logicayt.js

let duracionTotal = 0;
let slider = document.getElementById('slider-tiempo');

// --- INICIALIZACIÓN DEL SLIDER ---
if (slider) {
    noUiSlider.create(slider, {
        start: [0, 100], // Empiezan en los extremos
        connect: true,
        range: { 'min': 0, 'max': 100 }
    });

    slider.noUiSlider.on('update', function (values) {
        // Si no hay canción cargada, forzamos que siempre diga 00:00
        if (duracionTotal === 0) {
            document.getElementById("display-inicio").innerText = "00:00";
            document.getElementById("display-fin").innerText = "00:00";
        } else {
            document.getElementById("display-inicio").innerText = formatearTiempo(values[0]);
            document.getElementById("display-fin").innerText = formatearTiempo(values[1]);
        }
    });
}

// --- UTILIDADES ---
function formatearTiempo(segundos) {
    segundos = Math.round(segundos);
    const m = Math.floor(segundos / 60);
    const s = segundos % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// --- FASE 1: ANÁLISIS DEL VIDEO ---
async function verificarVideoReal() {
    const url = document.getElementById("entrada-url").value;
    const mensaje = document.getElementById("mensaje-estado");
    if (!url) return;

    mensaje.innerHTML = '<div class="spinner-border spinner-border-sm text-info"></div> <span class="text-neon-blue">SCANNING_DATA_STREAM...</span>';

    try {
        const res = await fetch('/api/info', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({url: url})
        });
        const datos = await res.json();
        
        duracionTotal = datos.duracion; // Ahora ya no es 0
        
        document.getElementById("info-video").classList.remove("d-none");
        document.getElementById("img-miniatura").src = datos.thumbnail;
        document.getElementById("titulo-video").innerText = datos.titulo;
        document.getElementById("texto-duracion").innerText = formatearTiempo(duracionTotal);
        
        document.getElementById("controles-tiempo").disabled = false;
        
        // Ajustamos el slider al tiempo real y lo estiramos
        slider.noUiSlider.updateOptions({
            range: { 'min': 0, 'max': duracionTotal }
        });
        slider.noUiSlider.set([0, duracionTotal]);

        mensaje.innerHTML = '<span class="text-success small">LINK_CONNECTED // READY_TO_EXTRACT</span>';

        // --- CENTRAR PANTALLA EN EL PROGRAMA AL APARECER LA INFO ---
        document.getElementById('main-app-card').scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (e) {
        mensaje.innerHTML = '<span class="text-danger">SYSTEM_ERROR: CONNECTION_FAILED</span>';
    }
}

// --- FASE 2: DESCARGA ---
function startDownload(blobUrl, filename) {
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

async function descargarReal() {
    const url = document.getElementById("entrada-url").value;
    const valores = slider.noUiSlider.get();
    const inicio = Math.round(valores[0]);
    const fin = Math.round(valores[1]);
    
    const boton = document.querySelector("button[onclick='descargarReal()']");
    const mensaje = document.getElementById("mensaje-estado");

    boton.disabled = true;
    boton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> CORE_PROCESSING...';

    // --- CENTRAR PANTALLA EN EL PROGRAMA AL INICIAR EXTRACCIÓN ---
    document.getElementById('main-app-card').scrollIntoView({ behavior: 'smooth', block: 'center' });

    const downloadUrl = `/api/descargar?url=${encodeURIComponent(url)}&inicio=${inicio}&fin=${fin}`;

    try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error(`CORE_FAILURE: ${response.status}`);

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'audio_knz.mp3';
        if (contentDisposition && contentDisposition.includes('filename')) {
            filename = contentDisposition.split('filename=')[1].replace(/['"]/g, '');
        }

        startDownload(blobUrl, filename);
        setTimeout(() => { window.URL.revokeObjectURL(blobUrl); }, 1000);

        boton.innerHTML = '<i class="bi bi-check-circle"></i> EXTRACTION_COMPLETE';
        boton.className = "btn btn-outline-info py-3"; 
        document.getElementById("zona-reiniciar").classList.remove("d-none");
        mensaje.innerHTML = '<span class="text-success fw-bold">FILE_DECRYPTED: extraction successful.</span>';

    } catch (error) {
        mensaje.innerHTML = `<span class="text-danger">CRITICAL_ERROR: ${error.message}</span>`;
        boton.disabled = false;
        boton.className = "btn btn-rgb py-3";
        boton.innerHTML = '<i class="bi bi-download"></i> RETRY_EXTRACTION';
    }
}

// --- FASE 3: REINICIO (SLIDER ESTIRADO PERO EN 00:00) ---
function reiniciarApp() {
    // 1. Reset de variables y UI
    duracionTotal = 0; // Volvemos a cero para que el validador del slider bloquee los números
    document.getElementById("entrada-url").value = "";
    document.getElementById("info-video").classList.add("d-none");
    document.getElementById("controles-tiempo").disabled = true;
    document.getElementById("zona-reiniciar").classList.add("d-none");
    document.getElementById("mensaje-estado").innerHTML = "";
    
    // 2. Resetear botón
    const boton = document.querySelector("button[onclick='descargarReal()']");
    boton.disabled = false;
    boton.className = "btn btn-rgb py-3";
    boton.innerHTML = '<i class="bi bi-download me-2"></i> INICIAR EXTRACCIÓN SÓNICA';

    // 3. Resetear Slider: Estirado a los bordes
    slider.noUiSlider.updateOptions({
        range: { 'min': 0, 'max': 100 }
    });
    slider.noUiSlider.set([0, 100]); // Puntos en cada extremo

    // 4. Forzar visual a 00:00
    document.getElementById("display-inicio").innerText = "00:00";
    document.getElementById("display-fin").innerText = "00:00";

    // --- SUBIR ARRIBA DEL TODO AL REINICIAR ---
    window.scrollTo({ top: 0, behavior: 'smooth' });
}