import Usuario from "../models/Usuarios.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import emailPropietario from "../helpers/emailPropietario.js";

// Función para registrar un nuevo usuario
const registrar = async (req, res) => {
    // Obtenemos el email y el nombre que enviamos desde el frontend del req.body 
    const { email, nombre } = req.body;

    //Verificar si el usuario ya existe por el email
    const existeUsuario = await Usuario.findOne({ email });
    if(existeUsuario){
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({msg: error.message});
    }

    try {
        //Guardar un nuevo usuario
        const usuario = new Usuario(req.body);
        const usuarioGuardado = await usuario.save();

        // Enviar email confirmación
        emailRegistro({
            email,
            nombre, 
            token: usuarioGuardado.token,
        });

        res.json(usuarioGuardado);
    } catch (error) {
        console.log(error);
    }
};

// Función para obtener perfil
const perfil = (req, res) => {
    const {usuario} = req;
    res.json(usuario);
}

//Función para confirmar la cuenta mediante token enviado a email
const confirmar = async (req, res) => {
    const {token} = req.params;

    const usuarioConfirmar = await Usuario.findOne({ token });//object literal = token: token

    if(!usuarioConfirmar){
        const error = new Error('Token no válido')
        return res.status(404).json({msg: error.message});
    }

    // asignamos null a token y true a confirmado 
    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        // guardamos los cambios en la db
        await usuarioConfirmar.save();

        res.json({msg: "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error);
    }
}

const autenticar = async (req, res) => {

    const {email, password} = req.body;

    //Verificar si el usuario ya existe por el email
    const usuario = await Usuario.findOne({ email });
    if(!usuario){
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message});
    }

    //Verificar si el usuario ha confirmado su cuenta
    if(!usuario.confirmado){
        const error = new Error('Debes confirmar tu cuenta')
        return res.status(403).json({msg: error.message});
    }

    // Autenticar usuario
    if(await usuario.comprobarPassword(password)){
        // Si está autenticado, enviamos token con el _id del usuario
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            alojamientosGuardados: usuario.alojamientosGuardados,
            token: generarJWT(usuario._id),
        });
    }else{
        const error = new Error('Contraseña incorrecta')
        return res.status(403).json({msg: error.message});
    }
}

// Función para verificar si el usuario existe mediante su mail y enviarle un token al email para modificar contraseña
const olvidePassword = async (req, res) => {
    const { email } = req.body;
    
    const usuario = await Usuario.findOne({email});
    // Si no existe el usuario:
    if(!usuario){
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message});
    }

    try {
        usuario.token = generarId();
        await usuario.save();
        // Enviar email con instrucciones para reestrablecer contraseña
        emailOlvidePassword({
            email,
            nombre: usuario.nombre,
            token: usuario.token,
        });
        res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        console.log(error);
    }
}

// Función para comprobar si el token de la URL es válido y permitir al usuario modificar su contraseña
const comprobarToken = async (req, res) => {
    const {token} = req.params;
    
    // Buscamos el usuario en la db que tenga el token de la URL
    const tokenValido = await Usuario.findOne({token});
    if(!tokenValido){
        const error = new Error('Token no válido')
        return res.status(404).json({msg: error.message});
    }

    res.json({msg: "Ingresa tu nueva contraseña"});
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Buscamos el usuario en la db que tenga el token de la URL
    const usuario = await Usuario.findOne({token});
    if(!usuario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message});
    }

    try {
        usuario.token = null;
        usuario.password = password;
        await usuario.save();
        res.json({msg: "Contraseña reestablecida correctamente"});
    } catch (error) {
        const err = new Error('Hubo un error al reestablecer tu contraseña')
        return res.status(400).json({msg: err.message});
    }
}   

const actualizarPerfil = async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);

    if(!usuario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }

    // Verificamos que el email a actualizar no existe en la base de datos
    const {email} = req.body.email;
    if(usuario.email !== req.body.email){
        const existeEmail = await Usuario.findOne({email});
        if(existeEmail){
            const error = new Error("Ese email ya está en uso");
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        usuario.nombre = req.body.nombre;
        usuario.telefono = req.body.telefono;
        usuario.email = req.body.email;

        const usuarioActualizado = await usuario.save();
        const datosActualizados = {
            _id: usuarioActualizado._id,
            nombre: usuarioActualizado.nombre,
            telefono: usuarioActualizado.telefono,
            email: usuarioActualizado.email,
            alojamientosGuardados: usuarioActualizado.alojamientosGuardados,
        }
        res.json(datosActualizados);
    } catch (error) {
        console.log(error);
    }
}

// Función para guardar alojamiento como favorito 
const guardarAlojamientoFavorito = async (req, res) => {

    const idAlojamiento = req.params.id;
    
    // Obtenemos todos los datos del usuario para así utilizar el atributo "alojamientosGuardados"
    const usuario = await Usuario.findOne({_id: req.usuario._id});

    try {
        // hacemos push del idAlojamiento al atributo alojamientoGuardados del usuario
        usuario.alojamientosGuardados.push(idAlojamiento);
        await usuario.save();
        res.json(usuario.alojamientosGuardados);
    } catch (error) {
        console.log(error);
    }
}

// Función para eliminar alojamiento de guardados como favoritos
const eliminarAlojamientoFavorito = async (req, res) => {
    
    const idAlojamiento = req.params.id;
    
    // Obtenemos todos los datos del usuario para así utilizar el atributo "alojamientosGuardados"
    const usuario = await Usuario.findOne({_id: req.usuario._id});
    
    try {
        // hacemos push del idAlojamiento al atributo alojamientoGuardados del usuario
        usuario.alojamientosGuardados = usuario.alojamientosGuardados.filter(guardado => guardado !== idAlojamiento);
        await usuario.save();
        res.json(usuario.alojamientosGuardados);
    } catch (error) {
        console.log(error);
    }
}

const modificarContrasena = async (req, res) => {
    // Leer los datos
    const {_id} = req.usuario;
    const {contrasena_actual, contrasena_nueva} = req.body;
    // Comprobar que el usuario exista
    const usuario = await Usuario.findById(_id);
    if(!usuario) {
        const error = new Error("Hubo un error");
        return res.status(400).json({ msg: error.message });
    }
    // Comprobar su contraseña
    if(await usuario.comprobarPassword(contrasena_actual)){
        // Almacenar contraseña
        usuario.password = contrasena_nueva;
        await usuario.save();
        res.json({msg: "Contraseña almacenada correctamente"})
    }else{
        const error = new Error("La contraseña actual es incorrecta");
        return res.status(400).json({ msg: error.message });
    }

}

// Función para enviar un mensaje de consulta al propietario de un alojamiento
const enviarMensajePropietario = async (req, res) => {
    try {
        const { nombre, telefono, emailUsuario, mensaje, email, tituloPublicacion } = req.body;

        await emailPropietario({
            nombre,
            telefono,
            emailUsuario,
            mensaje,
            email,
            tituloPublicacion,
        });

        res.status(200).json({ msg: "Mensaje enviado con éxito" });
    } catch (error) {
        res.status(500).json({ msg: "Error al enviar el mensaje" });
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    guardarAlojamientoFavorito,
    eliminarAlojamientoFavorito,
    modificarContrasena,
    enviarMensajePropietario,
}