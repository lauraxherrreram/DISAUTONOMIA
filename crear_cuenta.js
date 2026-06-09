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
        // 🚨 CORREGIDO: Cambiado '/sintoma' por '/usuario' para que conecte con tu tabla correcta
        const respuesta = await fetch(
            'http://localhost:3000/usuario',
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

        window.location.href = "sintoma.html";

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor. Revisa que 'node servidor.js' esté corriendo.");
    }
}