const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const appServer = express();
appServer.use(cors()); 
appServer.use(express.json());

// Conexión directa a tu base de datos 'app'
const conexion = mysql.createConnection({
    host: 'localhost',
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

// RUTA PARA GUARDAR SÍNTOMAS
appServer.post('/sintoma', (req, res) => {
    const { id_usuario, nivel_sintoma, sintomas_principales, notas_adicionales } = req.body;
    
    // SQL corregido: usando 'notas_adicionales' con A para que coincida con tu phpMyAdmin
    const query = `
        INSERT INTO sintoma 
        (id_registro, id_usuario, fecha, nivel_sintoma, sintomas_principales, notas_adicionales) 
        VALUES (NULL, ?, NOW(), ?, ?, ?)
    `;
    
    conexion.query(query, [id_usuario, nivel_sintoma, sintomas_principales, notas_adicionales], (err, result) => {
        if (err) {
            console.log("\n❌ ERROR EN BASE DE DATOS APP:");
            console.log(err.message);
            console.log("-------------------------\n");
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Síntomas guardados con éxito' });
    });
});
appServer.post('/usuario', (req, res) => {
    const { nombre, correo, contrasena, numero_chip } = req.body;

    const query = `
        INSERT INTO usuarios (id_usuario, nombre, correo, contrasena, numero_chip) 
        VALUES (NULL, ?, ?, ?, ?)
    `;

    conexion.query(query, [nombre, correo, contrasena, numero_chip], (err, result) => {
        if (err) {
            console.log("\n❌ ERROR EN BASE DE DATOS APP (USUARIOS):", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: "Usuario guardado con éxito" });
    });
});

appServer.listen(3000, () => {
    console.log('*** SERVIDOR CORRIENDO EN EL PUERTO 3000 ***');
});

appServer.listen(3000, () => {
    console.log('*** SERVIDOR CORRIENDO EN EL PUERTO 3000 ***');
});