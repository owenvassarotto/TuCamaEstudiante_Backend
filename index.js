import express from 'express';
import conectarDB from './config/db.js';
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import alojamientoRoutes from "./routes/alojamientoRoutes.js";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
app.use(express.json());

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

conectarDB();

const corsOptions = {
    origin: process.env.FRONTEND_URL, // Reemplaza con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/alojamientos', alojamientoRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
})