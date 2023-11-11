import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: generarId(),
    },
    confirmado: {
        type: Boolean,
        default: false
    },
    alojamientosGuardados: {
        type: [String],
    }
});
// función para hashear el password antes de almacenarlo
usuarioSchema.pre("save", async function(next){
    // si el password ya está hasheado NO lo volvemos a hashear, sino el usuario no se podrá autenticar
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// función para comprobar contraseña ingresada por form con la hasheada de la db
usuarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password);
}

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;