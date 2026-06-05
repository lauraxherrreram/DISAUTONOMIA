window.onload = function() {

    const opcionesFecha = {
        day: 'numeric',
        month: 'long'
    };

    document.getElementById('fecha-actual').innerText =
        "Hoy, " + new Date().toLocaleDateString('es-ES', opcionesFecha);

};

function guardarPresion() {

    const presion = document.getElementById("presion").value;

    if (presion.trim() === "") {
        alert("Ingresa la presión arterial.");
        return;
    }

    alert("Presión guardada: " + presion);

    // Aquí después conectarás la base de datos
}