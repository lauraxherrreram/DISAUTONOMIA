window.onload = function() {

    const opcionesFecha = {
        day: 'numeric',
        month: 'long'
    };

    document.getElementById('fecha-actual').innerText =
        "Hoy, " + new Date().toLocaleDateString('es-ES', opcionesFecha);

};

function evaluarPresion() {

    const presion = document.getElementById("presion").value;

    const partes = presion.split("/");

    if (partes.length !== 2) {
        document.getElementById("estado-presion").innerHTML =
            "Ingresa una presión válida";
        return;
    }

    const sistolica = parseInt(partes[0]);
    const diastolica = parseInt(partes[1]);

    if (isNaN(sistolica) || isNaN(diastolica)) {
        document.getElementById("estado-presion").innerHTML =
            "Ingresa una presión válida";
        return;
    }

    if (sistolica > 130 || diastolica > 85) {

        document.getElementById("estado-presion").innerHTML =
            "⚠️ Presión Alta";

    } else if (sistolica < 90 || diastolica < 60) {

        document.getElementById("estado-presion").innerHTML =
            "🛏️ Presión Baja";

    } else {

        document.getElementById("estado-presion").innerHTML =
            "✅ Presión Normal";

    }
}

async function guardarPresion() {

    const presion = document.getElementById("presion").value;
    const notas = "";

    if (presion.trim() === "") {
        alert("Ingresa la presión arterial.");
        return;
    }

    try {

        const respuesta = await fetch(
           "http://192.168.161.107:3000/usuario",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario_id: 1,
                    presion: presion,
                    notas: notas
                })
            }
        );

        const resultado = await respuesta.json();

        alert(resultado.mensaje);

        document.getElementById("presion").value = "";
        document.getElementById("estado-presion").innerHTML =
            "Ingresa una presión arterial";

    } catch (error) {

        console.error(error);
        alert("Error al conectar con el servidor");

    }
}