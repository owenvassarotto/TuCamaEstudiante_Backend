import express from "express";
const router = express.Router();
import { autenticar, comprobarToken, confirmar, nuevoPassword, olvidePassword, perfil, registrar, actualizarPerfil, guardarAlojamientoFavorito, eliminarAlojamientoFavorito, modificarContrasena, enviarMensajePropietario } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/authMiddleware.js";

// Área pública
router.post("/", registrar);
// Route para enviar mensaje de consulta al propiertario
router.post("/enviar-mensaje-propietario", enviarMensajePropietario);

router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.route("/olvide-password/:token")
    .get(comprobarToken)
    .post(nuevoPassword)

// Área privada
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put("/modificar-contrasena", checkAuth, modificarContrasena);

router.put("/perfil/guardar-alojamiento-favorito/:id", checkAuth, guardarAlojamientoFavorito);
router.put("/perfil/eliminar-alojamiento-favorito/:id", checkAuth, eliminarAlojamientoFavorito);

export default router;