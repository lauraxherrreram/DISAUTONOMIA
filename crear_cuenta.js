async function registrar() {

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const numero_chip = document.getElementById("chip").value;
    const contrasena = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;
    const acepta = document.getElementById("terminos").checked;

    if (!nombre || !correo || !numero_chip || !contrasena || !confirmar) {
        alert("Completa todos los campos");
        return;
    }

    if (!acepta) {
        alert("Debes aceptar los términos y condiciones");
        return;
    }

    if (contrasena !== confirmar) {
        alert("Las contraseñas no coinciden");
        return;
    }

    try {
        // Corregido a localhost para que conecte de inmediato en tu computadora
        const respuesta = await fetch(
            "http://localhost:3000/usuario", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre,
                    correo,
                    contrasena,
                    numero_chip
                })
            }
        );

        const resultado = await respuesta.json();

        if (resultado.error) {
            alert("Error en el servidor: " + resultado.error);
            return;
        }

        alert("¡Usuario guardado con éxito en tu base de datos! 🎉");
        
        // Te redirige a la pantalla de síntomas que me acabas de pasar
        window.location.href = "sintoma.html";

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor local. Asegúrate de tener la terminal activa con node server.js");
    }
}