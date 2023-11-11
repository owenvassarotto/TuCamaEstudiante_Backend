import jwt from "jsonwebtoken";
import Usuario from "../models/Usuarios.js";

// Función para checkear autorización de usuario al iniciar sesión
const checkAuth = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // le asignamos el valor después del espacio " "
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // crea una sesión con los datos del usuario
            req.usuario = await Usuario.findById(decoded.id).select("-password -token -confirmado");

            return next();
        } catch (error) {
            const errorToken = new Error('Token no válido')
            return res.status(403).json({msg: errorToken.message});
        }
    }

    if(!token){
        const errorToken = new Error('Token no válido o inexistente')
        return res.status(403).json({msg: errorToken.message});
    }
    next();
}

export default checkAuth;