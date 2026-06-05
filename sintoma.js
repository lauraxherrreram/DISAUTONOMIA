let nivelSeleccionado = "";
let sintomasSeleccionados = [];

// Cambiar la fecha de forma dinámica al cargar la página
const opcionesFecha = { day: 'numeric', month: 'long' };
document.getElementById('fecha-actual').innerText = "Hoy, " + new Date().toLocaleDateString('es-ES', opcionesFecha);

function seleccionarNivel(nivel, elemento) {
    document.querySelectorAll('.mood-option').forEach(el => el.classList.remove('selected'));
    elemento.classList.add('selected');
    nivelSeleccionado = nivel;
}

function toggleSintoma(sintoma, elemento) {
    elemento.classList.toggle('selected');
    if (sintomasSeleccionados.includes(sintoma)) {
        sintomasSeleccionados = sintomasSeleccionados.filter(s => s !== sintoma);
    } else {
        sintomasSeleccionados.push(sintoma);
    }
}

async function enviarRegistro() {
    if (!nivelSeleccionado) {
        alert("Por favor, selecciona un nivel de síntomas antes de guardar.");
        return;
    }

    const notas = document.getElementById('notas').value;
    const listaSintomasTexto = sintomasSeleccionados.join(', ');

    // Enviamos 'notas_adicionales' con A
    const datosRegistro = {
        id_usuario: 1, 
        nivel_sintoma: nivelSeleccionado,
        sintomas_principales: listaSintomasTexto || "Ninguno",
        notas_adicionales: notas
    };

    try {
        const respuesta = await fetch('http://localhost:3000/sintoma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosRegistro)
        });

        const resultado = await respuesta.json();
        
        if (resultado.mensaje) {
            alert('¡Registro de síntomas guardados con éxito en la base de datos! 🎉');
            
            // Limpiar campos
            document.getElementById('notas').value = "";
            document.querySelectorAll('.mood-option, .symptom-chip').forEach(el => el.classList.remove('selected'));
            nivelSeleccionado = "";
            sintomasSeleccionados = [];

            // Redirección directa al éxito
            window.location.href = "presion.html";
        } else {
            alert('El servidor respondió pero hubo un problema interno.');
        }
    } catch (error) {
        console.error('Error al conectar con tu servidor de Node.js:', error);
        alert('❌ Error de conexión: Asegúrate de que tu servidor Node.js esté corriendo en la terminal (node servidos.js)');
    }
}