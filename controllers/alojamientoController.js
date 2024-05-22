import Alojamiento from "../models/Alojamiento.js";
import download from "image-downloader";
import generarId from "../helpers/generarId.js";
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const agregarAlojamiento = async (req, res) => {
    // Crear una nueva instancia de 'Alojamiento' utilizando los datos de la solicitud
    const alojamiento = new Alojamiento(req.body);

    // Asignar el ID del usuario de la solicitud como propietario del alojamiento
    alojamiento.propietario = req.usuario._id;
    
    try {
        // Intentar guardar el alojamiento en la base de datos
        const alojamientoRegistrado = await alojamiento.save();

        // Responder con los datos del alojamiento registrado en formato JSON
        res.json(alojamientoRegistrado);
    } catch (error) {
        // En caso de error, responder con los detalles del error en formato JSON
        res.json(error);
    }
}

const obtenerMisAlojamientos = async (req, res) => {

    //Obtener solo los alojamientos que están asociadas al usuario que obtenemos con el JWT mediante el middleware authMiddleware.js
    const alojamientos = await Alojamiento.find()
        .where('propietario')
        .equals(req.usuario);

    res.json(alojamientos);
}

const obtenerAlojamientosGuardados = async (req, res) => {
    try {
        const alojamientos = await Alojamiento.find({
          _id: { $in: req.usuario.alojamientosGuardados }
        });
        res.json(alojamientos);
    } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los alojamientos guardados' });
    }
} 

// Función para obtener un alojamiento en ESPECIFICO mediante su id
const obtenerAlojamiento = async (req, res) => {
    const { id } = req.params;

    const alojamiento = await Alojamiento.findById(id);

    if(!alojamiento){
        return res.status(404).json({msg: "Alojamiento no encontrado"});
    }

    res.json(alojamiento);
}

//función para obtener todos los alojamientos
const obtenerTodosAlojamientos = async (req, res) => {
    try {
        // Obtenemos todos los alojamientos
        const alojamientos = await Alojamiento.find();
        res.json(alojamientos);
    } catch (error) {
       // Manejo de errores
       res.status(404).json({ error: 'Error al obtener alojamientos' });
    }
} 

const actualizarAlojamiento = async (req, res) => {
    const { id } = req.params;

    const alojamiento = await Alojamiento.findById(id);

    if(!alojamiento){
        return res.status(404).json({msg: "Alojamiento no encontrado"});
    }

    // Evaluamos si el usuario autenticado es igual al usuario que registró el alojamiento
    if(alojamiento.propietario._id.toString() !== req.usuario._id.toString()){
        return res.json({ msg: "Acción no válida" });
    }

    const {titulo, provincia, ambientes, direccion, fotos, precio, moneda, descripcion, comodidades, dormitorios, contacto, tipoAlojamiento, banos, metrosCuadrados, capacidadPersonas } = req.body;

    // Actualizamos el alojamiento
    alojamiento.titulo = titulo || alojamiento.titulo;
    alojamiento.provincia = provincia || alojamiento.provincia;
    alojamiento.ambientes = ambientes || alojamiento.ambientes;
    alojamiento.direccion = direccion || alojamiento.direccion;
    alojamiento.fotos = fotos || alojamiento.fotos;
    alojamiento.precio = precio || alojamiento.precio;
    alojamiento.moneda = moneda || alojamiento.moneda;
    alojamiento.descripcion = descripcion || alojamiento.descripcion;
    alojamiento.comodidades = comodidades || alojamiento.comodidades;
    alojamiento.dormitorios = dormitorios || alojamiento.dormitorios;
    alojamiento.tipoAlojamiento = tipoAlojamiento || alojamiento.tipoAlojamiento;
    alojamiento.metrosCuadrados = metrosCuadrados || alojamiento.metrosCuadrados;
    alojamiento.banos = banos || alojamiento.banos;
    alojamiento.capacidadPersonas = capacidadPersonas || alojamiento.capacidadPersonas;
    alojamiento.contacto.nombre = contacto.nombre || alojamiento.contacto.nombre;
    alojamiento.contacto.email = contacto.email || alojamiento.contacto.email;
    alojamiento.contacto.telefono = contacto.telefono || alojamiento.contacto.telefono;

    try {
        const alojamientoActualizado = await alojamiento.save();
        res.json(alojamientoActualizado);
    } catch (error) {
        console.log(error);
    }
}

const eliminarAlojamiento = async (req, res) => {
    const { id } = req.params;

    const alojamiento = await Alojamiento.findById(id);

    if(!alojamiento){
        return res.status(404).json({msg: "Alojamiento no encontrado"});
    }

    // Evaluamos si el usuario autenticado es igual al usuario que registró el alojamiento
    if(alojamiento.propietario._id.toString() !== req.usuario._id.toString()){
        return res.json({ msg: "Acción no válida" });
    }

    // Eliminamos el alojamiento
    try {
        await alojamiento.deleteOne();
        res.json({msg: "Alojamiento eliminado correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const subirFotoLink = async (req, res) => {

    try {
        // Obtenemos el link desde el frontend
        const {link} = req.body;
        
        const nombreArchivo = generarId() + '.jpg';
        // Obtener la ruta absoluta del directorio uploads en la raíz del backend
        const rutaGuardado = path.join(__dirname, '..', 'uploads', nombreArchivo);
        
        await download.image({
            url: link,
            dest: rutaGuardado,
        });
    
        res.json(nombreArchivo);
    } catch (error) {
        // Manejo de errores
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const fotosMiddleware = multer({ dest: 'uploads/' });

const subirFotoDispositivo = async (req, res) => {
    console.log(req.files);
    const uploadedFiles = [];
    
    for (let i = 0; i < req.files.length; i++) {
        // Obtenemos atributos path y originalname de files
        const { path, originalname } = req.files[i];
        const partes = originalname.split('.');
        const ext = partes[partes.length - 1]; // Obtiene la extensión correcta
        
        // Generamos un nuevo nombre de archivo con UUID
        const nuevoNombre = generarId() + '.' + ext;
        const nuevoPath = `uploads/${nuevoNombre}`;
        
        // Renombramos el archivo
        fs.renameSync(path, nuevoPath);
        
        // Guardamos el nuevo nombre del archivo
        uploadedFiles.push(nuevoNombre);
    }
    
    res.json(uploadedFiles);
};

// Función para actualizar el contacto en los alojamientos al modificar el perfil
const actualizarContactoAlojamiento = async (req, res) => {

    try {
        const nuevoContacto = {
            nombre: req.body.nombre,
            telefono: req.body.telefono,
            email: req.body.email,
        }; // Supongamos que obtienes el nuevo contacto de la solicitud
    
        // Filtrar y actualizar los alojamientos que pertenecen al usuario actual (req.usuario)
        const resultado = await Alojamiento.updateMany(
          { propietario: req.usuario }, // Condición de filtrado
          { $set: { contacto: nuevoContacto } } // Actualizar el campo 'contacto'
        );
    
        if (resultado.nModified > 0) {
          return res.json({
            msg: `Se actualizaron ${resultado.nModified} alojamientos con el nuevo contacto.`,
            error: false,
          });
        } else {
          return res.json({
            msg: 'No se encontraron alojamientos para actualizar.',
            error: false,
          });
        }
      } catch (error) {
        console.error('Error al actualizar los alojamientos:', error);
        return res.status(500).json({ msg: 'Error en el servidor', error: true });
    }
}

// Función para filtrar los alojamientos 
const filtrarAlojamientos = async (req, res) => {
    const { tipoAlojamiento, provincia, precioDesde, precioHasta } = req.body;

    try {
        let filtro = {};

        if (tipoAlojamiento) {
            filtro.tipoAlojamiento = tipoAlojamiento;
        }

        if (provincia) {
            filtro.provincia = provincia;
        }

        if (precioDesde || precioHasta) {
            filtro.precio = {};
            if (precioDesde) {
                filtro.precio.$gte = precioDesde;
            }
            if (precioHasta) {
                filtro.precio.$lte = precioHasta;
            }
        }
        const alojamientos = await Alojamiento.find(filtro);

        res.json(alojamientos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener los alojamientos guardados' });
    }
}

export {
    agregarAlojamiento,
    obtenerMisAlojamientos,
    obtenerAlojamiento,
    actualizarAlojamiento,
    eliminarAlojamiento,
    subirFotoLink,
    subirFotoDispositivo,
    fotosMiddleware,
    obtenerTodosAlojamientos,
    obtenerAlojamientosGuardados,
    actualizarContactoAlojamiento,
    filtrarAlojamientos,
}