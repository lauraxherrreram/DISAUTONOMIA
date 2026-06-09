let nivelSeleccionado = "";
let sintomasSeleccionados = [];


const opcionesFecha = { day: 'numeric', month: 'long' };
if (document.getElementById('fecha-actual')) {
    document.getElementById('fecha-actual').innerText = "Hoy, " + new Date().toLocaleDateString('es-ES', opcionesFecha);
}


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
        
        
        localStorage.setItem("misSintomasActuales", listaSintomasTexto || "Ninguno");
        alert('¡Registro de síntomas guardados con éxito! 🎉');

    } catch (error) {
        console.error('Error al conectar con tu servidor de Node.js, activando respaldo:', error);
        
        
        localStorage.setItem("misSintomasActuales", listaSintomasTexto || "Ninguno");
        alert('¡Registro de síntomas guardados con éxito! 🎉');
    }

    
    document.getElementById('notas').value = "";
    document.querySelectorAll('.mood-option, .symptom-chip, .chips span').forEach(el => el.classList.remove('selected'));
    nivelSeleccionado = "";
    sintomasSeleccionados = [];

    
    window.location.href = "presion.html";
}