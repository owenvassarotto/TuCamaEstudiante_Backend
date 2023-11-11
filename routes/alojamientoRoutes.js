import express from "express";
const router = express.Router();
import checkAuth from "../middleware/authMiddleware.js";
import { actualizarAlojamiento, actualizarContactoAlojamiento, agregarAlojamiento, eliminarAlojamiento, filtrarAlojamientos, fotosMiddleware, obtenerAlojamiento, obtenerAlojamientosGuardados, obtenerMisAlojamientos, obtenerTodosAlojamientos, subirFotoDispositivo, subirFotoLink } from "../controllers/alojamientoController.js";

// Para el CREATE y READ de los alojamientos
router.route('/')
    .post(checkAuth, agregarAlojamiento)//protegemos el endpoint agregarAlojamiento con checkAuth para que solo un usuario autenticado pueda agregar un alojamiento
    .get(checkAuth, obtenerMisAlojamientos)//obtener alojamientos para sección "Mis publicaciones"

router.get('/obtener-todos-alojamientos', obtenerTodosAlojamientos);

// Route para obtener los alojamiento guardados como favoritos por el usuario
router.get('/obtener-alojamientos-guardados', checkAuth, obtenerAlojamientosGuardados);
    
// Para el UPDATE y DELETE de los alojamientos
router.route('/:id')
    .get(obtenerAlojamiento)
    .put(checkAuth, actualizarAlojamiento)
    .delete(checkAuth, eliminarAlojamiento)

// Para las subidas de fotos 
router.post('/subir-foto-link', subirFotoLink);
router.post('/subir-foto-dispositivo', fotosMiddleware.array('fotos', 100), subirFotoDispositivo);

router.put('/actualizar-contacto/:id', checkAuth, actualizarContactoAlojamiento);

// Para filtrar los alojamientos
router.post('/filtrar-alojamientos', filtrarAlojamientos);

export default router;