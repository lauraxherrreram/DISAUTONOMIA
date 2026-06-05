window.onload = function() {

    const opcionesFecha = {
        day: 'numeric',
        month: 'long'
    };

    document.getElementById('fecha-actual').innerText =
        "Hoy, " + new Date().toLocaleDateString('es-ES', opcionesFecha);

};

async function guardarPresion() {

    const presion = document.getElementById("presion").value;
    const notas = document.getElementById("notas").value;

    if (presion.trim() === "") {
        alert("Ingresa la presión arterial.");
        return;
    }

    try {

        const respuesta = await fetch(
            "http://localhost:3000/presion",
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
        document.getElementById("notas").value = "";

    } catch (error) {

        console.error(error);
        alert("Error al conectar con el servidor");

    }
}