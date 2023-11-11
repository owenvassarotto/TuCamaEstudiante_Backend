// Alojamiento.js
import mongoose from 'mongoose';

const alojamientoSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    provincia: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    fotos: {
        type: [String],
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    moneda: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    tipoAlojamiento: {
        type: String, // 'habitacion', 'departamento', 'casa', etc.
    },
    capacidadPersonas: {
        type: Number,
    },
    dormitorios: {
        type: Number,
    },
    banos: {
        type: Number,
    },
    ambientes :{
        type: Number,
    },
    metrosCuadrados: {
        type: Number,
    },
    comodidades: {
        type: [String],
    },
    contacto: {
        nombre: {
            type: String,
            required: true,
        },
        telefono: {
            type: String,
            required: true,
        },
        email: String,
    },
    propietario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
    },
    },
    {   
        // para agregar agregar atributos createdAt y updatedAt
        timestamps: true,
    }
);

const Alojamiento = mongoose.model('Alojamiento', alojamientoSchema);

export default Alojamiento;
