const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const appServer = express();
appServer.use(cors()); 
appServer.use(express.json());

// Conexión directa a tu base de datos 'app'
const conexion = mysql.createConnection({
    host: 'localhost', // Sigue siendo localhost porque la BD está en tu computadora
    user: 'root',
    password: '',
    database: 'app' 
});

conexion.connect(err => {
    if (err) {
        console.error('Error conectando a la base de datos app:', err.message);
        throw err;
    }
    console.log('¡Conectado exitosamente a la nueva base de datos APP! 🚀');
});

// =======================================================
// 1. RUTA PARA GUARDAR SÍNTOMAS (Tu parte)
// =======================================================
appServer.post('/sintoma', (req, res) => {
    const { id_usuario, nivel_sintoma, sintomas_principales, notas_adicionales } = req.body;
    
    const query = `
        INSERT INTO sintoma 
        (id_registro, id_usuario, fecha, nivel_sintoma, sintomas_principales, notas_adicionales) 
        VALUES (NULL, ?, NOW(), ?, ?, ?)
    `;
    
    conexion.query(query, [id_usuario, nivel_sintoma, sintomas_principales, notas_adicionales], (err, result) => {
        if (err) {
            console.log("\n❌ ERROR EN BASE DE DATOS APP (SÍNTOMAS):");
            console.log(err.message);
            console.log("-------------------------\n");
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Síntomas guardados con éxito' });
    });
});

// =======================================================
// 2. RUTA NUEVA PARA EL REGISTRO DE USUARIOS (Parte de tus amigas)
// =======================================================
appServer.post('/usuario', (req, res) => {
    // Recibimos los 4 datos idénticos a como los manda el crear_cuenta.js de ellas
    const { nombre, correo, contrasena, numero_chip } = req.body;

    // Insertamos en tu tabla 'usuarios'
    // El NULL inicial es porque 'id_usuario' se crea solo de forma automática (AUTO_INCREMENT)
    const query = `
        INSERT INTO usuarios (id_usuario, nombre, correo, contrasena, numero_chip) 
        VALUES (NULL, ?, ?, ?, ?)
    `;

    conexion.query(query, [nombre, correo, contrasena, numero_chip], (err, result) => {
        if (err) {
            console.log("\n❌ ERROR EN BASE DE DATOS APP (USUARIOS):");
            console.log(err.message);
            console.log("-------------------------\n");
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: "Usuario guardado con éxito" });
    });
});

appServer.listen(3000, () => {
    console.log('*** SERVIDOR CORRIENDO EN EL PUERTO 3000 ***');
});