const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

// Conexión corregida con la tilde exacta de tu phpMyAdmin
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'disautonomía'
});

conexion.connect(err => {
    if (err) {
        console.error('Error conectando a phpMyAdmin:', err.message);
        throw err;
    }
    console.log('¡Conectado exitosamente a phpMyAdmin!');
});

// ==========================================
// RUTA 1: Registro de Usuarios
// ==========================================
app.post('/registrar-usuario', (req, res) => {
    const { nombre, correo, contrasena, numero_chip } = req.body;
    const query = 'INSERT INTO usuarios (nombre, correo, contrasena, numero_chip) VALUES (?, ?, ?, ?)';
    
    conexion.query(query, [nombre, correo, contrasena, numero_chip], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ mensaje: 'Usuario guardado con éxito' });
    });
});

// ==========================================
// RUTA 2: Registro de Síntomas (Sincronizado al 100%)
// ==========================================
app.post('/sintoma', (req, res) => {
    const { usuario_id, nivel_sintomas, sintomas_principales, notes } = req.body;
    
    // AQUÍ ESTÁ EL CAMBIO DE NOMBRES EXACTO:
    // Tabla: registros_sintomas
    // Columnas: id_usuario, nivel_sintoma, sintomas_principales, notas_adicionales
    const query = 'INSERT INTO registros_sintomas (id_usuario, nivel_sintoma, sintomas_principales, notas_adicionales) VALUES (?, ?, ?, ?)';
    
    conexion.query(query, [usuario_id, nivel_sintomas, sintomas_principales, notes], (err, result) => {
        if (err) {
            console.error("Error dentro de la base de datos:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: 'Síntomas guardados con éxito' });
    });
});

// Levantar Servidor
app.listen(3000, () => {
    console.log('*** SERVIDOR CORRIENDO EN EL PUERTO 3000 ***');
});