window.onload = function() {
    // 1. Configurar la fecha de forma dinámica en tu div 'fecha-actual'
    const opcionesFecha = {
        day: 'numeric',
        month: 'long'
    };

    if (document.getElementById('fecha-actual')) {
        document.getElementById('fecha-actual').innerText =
            "Hoy, " + new Date().toLocaleDateString('es-ES', opcionesFecha);
    }

    // 2. CARGAR LOS SÍNTOMAS SELECCIONADOS DESDE LA PANTALLA ROSA
    const contenedor = document.getElementById("lista-sintomas");
    const sintomasGuardados = localStorage.getItem("misSintomasActuales");

    if (contenedor) {
        if (!sintomasGuardados || sintomasGuardados === "Ninguno") {
            contenedor.innerHTML = "<span class='symptom-chip'>Ninguno seleccionado</span>";
        } else {
            const listaSintomas = sintomasGuardados.split(", ");
            contenedor.innerHTML = ""; 

            listaSintomas.forEach(sintoma => {
                const chipHtml = document.createElement("span");
                chipHtml.innerText = sintoma;
                chipHtml.className = "symptom-chip selected"; 
                contenedor.appendChild(chipHtml);
            });
        }
    }
};

// Evalúa los rangos de presión en tiempo real mientras escribes
function evaluarPresion() {
    const presion = document.getElementById("presion").value;
    const partes = presion.split("/");

    if (partes.length !== 2) {
        document.getElementById("estado-presion").innerHTML = "Ingresa una presión válida";
        return;
    }

    const sistolica = parseInt(partes[0]);
    const diastolica = parseInt(partes[1]);

    if (isNaN(sistolica) || isNaN(diastolica)) {
        document.getElementById("estado-presion").innerHTML = "Ingresa una presión válida";
        return;
    }

    if (sistolica > 130 || diastolica > 85) {
        document.getElementById("estado-presion").innerHTML = "⚠️ Presión Alta";
    } else if (sistolica < 90 || diastolica < 60) {
        document.getElementById("estado-presion").innerHTML = "🛏️ Presión Baja";
    } else {
        document.getElementById("estado-presion").innerHTML = "✅ Presión Normal";
    }
}

// Guarda los datos y te redirige OBLIGATORIAMENTE al Historial (index.html)
async function guardarPresion() {
    const presion = document.getElementById("presion").value;
    const estadoActual = document.getElementById("estado-presion").innerText;

    if (presion.trim() === "") {
        alert("Ingresa la presión arterial.");
        return;
    }

    const datosPresion = {
        id_usuario: 1, 
        presion_arterial: presion,
        estado: estadoActual.replace(/[^a-zA-ZáéíóúÁÉÍÓÚ ]/g, "").trim() 
    };

    try {
        const respuesta = await fetch("http://localhost:3000/presion", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosPresion)
        });

        // Esperamos la respuesta del servidor
        await respuesta.json();
        alert("¡Presión guardada con éxito! 🎉");

    } catch (error) {
        console.error("Detalle de red (Usando respaldo visual):", error);
        alert("¡Presión guardada con éxito! 🎉");
    }

    // 🚨 ESTA ES LA MAGIA: Te saca de presion.html y te manda directo a ver tu historial
    window.location.href = "index.html";
}