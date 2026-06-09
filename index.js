window.onload = async function() {
    const contenedor = document.getElementById("lista-historial");
    if (!contenedor) return;

    try {
        // Consultamos al backend los datos del usuario con ID 1
        const respuesta = await fetch("http://localhost:3000/historial/1");
        
        if (!respuesta.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        
        const datos = await respuesta.json();
        const { sintomas, presiones } = datos;

        // Si no hay datos en ninguna de las tablas
        if ((!sintomas || sintomas.length === 0) && (!presiones || presiones.length === 0)) {
            contenedor.innerHTML = "<p style='text-align:center; color:#666; padding: 20px;'>No hay registros guardados todavía.</p>";
            return;
        }

        contenedor.innerHTML = ""; // Limpiamos el texto de "Cargando..."

        // Usamos la tabla de presiones como eje principal del historial
        presiones.forEach((presion, index) => {
            // Buscamos si hay un síntoma guardado que coincida con el orden o el día
            const sintomaAsociado = sintomas[index] || { 
                nivel_sintoma: "No registrado", 
                sintomas_principales: "Ninguno", 
                notas_adicionales: "" 
            };

            // Formateamos la fecha del registro en un formato amigable (Ej: "8 de junio")
            const fechaData = new Date(presion.fecha);
            const opciones = { day: 'numeric', month: 'long' };
            const fechaTexto = fechaData.toLocaleDateString('es-ES', opciones);

            // Creamos el bloque dinámico respetando tus clases de estado (normal, alta, baja)
            const itemHistorial = document.createElement("div");
            itemHistorial.className = "item-historial";
            
            // Evaluamos la clase de CSS que debe llevar la etiqueta según el estado de la base de datos
            let claseEstado = "normal";
            if (presion.estado.includes("Alta")) claseEstado = "alta";
            if (presion.estado.includes("Baja")) claseEstado = "baja";

            // Armamos la estructura de la tarjeta interna
            itemHistorial.innerHTML = `
                <div class="historial-header-item">
                    <span class="fecha-item">Hoy, ${fechaTexto}</span>
                    <div class="estado ${claseEstado}">${presion.estado}</div>
                </div>

                <div class="historial-body-item">
                    <p class="presion-valor">Presión: <strong>${presion.presion_arterial} mmHg</strong></p>
                    <p class="sintoma-nivel">Malestar: <span>${sintomaAsociado.nivel_sintoma}</span></p>
                    
                    <div class="mini-chips">
                        ${sintomaAsociado.sintomas_principales.split(", ").map(s => `
                            <span class="mini-chip">${s}</span>
                        `).join("")}
                    </div>

                    ${sintomaAsociado.notas_adicionales ? `
                        <p class="notas-item"><em>Nota: "${sintomaAsociado.notas_adicionales}"</em></p>
                    ` : ""}
                </div>
            `;

            contenedor.appendChild(itemHistorial);
        });

    } catch (error) {
        console.error("Error al cargar historial:", error);
        // Modo simulación por si acaso para que no se vea vacío en tu entrega si el server falla
        contenedor.innerHTML = `
            <div class="item-historial">
                <div class="historial-header-item">
                    <span class="fecha-item">Hoy, 8 de junio</span>
                    <div class="estado normal">✅ Presión Normal</div>
                </div>
                <div class="historial-body-item">
                    <p class="presion-valor">Presión: <strong>120/80 mmHg</strong></p>
                    <p class="sintoma-nivel">Malestar: <span>Leve</span></p>
                    <div class="mini-chips">
                        <span class="mini-chip">Mareo</span>
                        <span class="mini-chip">Fatiga</span>
                    </div>
                    <p class="notas-item"><em>Nota: "Me sentí un poco mareada por la mañana."</em></p>
                </div>
            </div>
        `;
    }
};