// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

// Base de datos en memoria
let users = [
    { id: 1, nombre: "Rodri", email: "Rodri@gmail.com" },
    { id: 2, nombre: "pepe", email: "pepe@email.com" }
];

// Contador para IDs
let nextId = 3;

const server = http.createServer((req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Manejar solicitud OPTIONS para CORS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Servir archivo HTML
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error al cargar el archivo HTML');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        return;
    }

    // API endpoints
    if (req.url === '/api/users' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
        return;
    }

    if (req.url === '/api/users' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const userData = JSON.parse(body);
                const newUser = {
                    id: nextId++,
                    nombre: userData.nombre,
                    email: userData.email
                };
                users.push(newUser);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newUser));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Datos inválidos' }));
            }
        });
        return;
    }

    // Si no coincide con ninguna ruta
    res.writeHead(404);
    res.end('Ruta no encontrada');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
