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

// =======================================================
// 1. RUTA PARA GUARDAR SÍNTOMAS
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
// 2. RUTA PARA REGISTRAR USUARIOS
// =======================================================
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

// =======================================================
// 3. RUTA PARA REGISTRAR PRESIÓN (🚨 CORREGIDA)
// =======================================================
appServer.post('/presion', (req, res) => {
    // CORRECCIÓN CLAVE: Ahora recibe el id_usuario del frontend (o usa 1 por defecto para tus pruebas)
    const { id_usuario, presion_arterial, estado } = req.body;

    const query = `
        INSERT INTO presion 
        (id_presion, id_usuario, presion_arterial, estado, fecha) 
        VALUES (NULL, ?, ?, ?, NOW())
    `;

    conexion.query(query, [id_usuario || 1, presion_arterial, estado], (err, result) => {
        if (err) {
            console.log("\n❌ ERROR EN BASE DE DATOS (PRESIÓN):", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ mensaje: "Presión registrada con éxito" });
    });
});

// =======================================================
// 4. RUTA DEL HISTORIAL COMPLETO (🚨 REPARADA)
// =======================================================
appServer.get('/historial/:id_usuario', (req, res) => {
    const idUsuario = req.params.id_usuario;

    // Esta consulta unifica las tablas basándose en el id_usuario y la fecha exacta del día
    const query = `
        SELECT 
            p.id_presion,
            p.presion_arterial,
            p.estado AS estado_presion,
            p.fecha AS fecha_presion,
            s.nivel_sintoma,
            s.sintomas_principales,
            s.notas_adicionales
        FROM presion p
        LEFT JOIN sintoma s ON p.id_usuario = s.id_usuario AND DATE(p.fecha) = DATE(s.fecha)
        WHERE p.id_usuario = ?
        ORDER BY p.fecha DESC
    `;

    conexion.query(query, [idUsuario], (err, resultados) => {
        if (err) {
            console.log("❌ Error en consulta de historial:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(resultados);
    });
});

// =======================================================
// 5. ENCENDER EL SERVIDOR
// =======================================================
appServer.listen(3000, () => {
    console.log('*** SERVIDOR CORRIENDO EN EL PUERTO 3000 ***');
});