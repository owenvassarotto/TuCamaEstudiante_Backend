import nodemailer from "nodemailer";

// Envia mail para confirmar cuenta
const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    // Enviar email
    const {email, nombre, token} = datos;

    const info = await transporter.sendMail({
        // Contenido del email
        from: 'TuCamaEstudiante.com - Portal de Alquiler de Alojamientos para Estudiantes',
        to: email,
        subject: 'Confirma tu cuenta en TuCamaEstudiante.com',
        text: 'Confirma tu cuenta en TuCamaEstudiante.com',
        html: `
            <div style="font-family: 'Montserrat', sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto;">
                <h2 style="color: #1481f7;">¡Bienvenido a TuCamaEstudiante.com!</h2>
                <p>Hola ${nombre},</p>
                <p>Tu cuenta está lista para ser utilizada. Solo debes confirmarla haciendo clic en el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/confirmar/${token}" style="color: white; text-decoration: none; font-weight: bold; text-align: center; padding: 15px; background-color: #1481f7; border-radius: 5px; display: block; with: 100%">Comprobar Cuenta</a>
                <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
                <p>¡Gracias por unirte a TuCamaEstudiante.com!</p>
            </div>
        `
    });
}

export default emailRegistro;