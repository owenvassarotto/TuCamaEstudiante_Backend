import nodemailer from "nodemailer";

// Envia email para recuperar contraseña
const emailOlvidePassword = async (datos) => {
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
        subject: 'Restablecer contraseña en TuCamaEstudiante.com',
        text: 'Restablecer contraseña en TuCamaEstudiante.com',
        html: `
            <div style="font-family: 'Montserrat', sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto;">
                <h2 style="color: #1481f7;">¡Restablecer Contraseña en TuCamaEstudiante.com!</h2>
                <p>Hola ${nombre},</p>
                <p>Recibes este correo porque solicitaste restablecer tu contraseña en TuCamaEstudiante.com. Haz clic en el siguiente enlace para continuar:</p>
                <a href="${process.env.FRONTEND_URL}/olvide-contrasena/${token}" style="color: white; text-decoration: none; font-weight: bold; text-align: center; padding: 15px; background-color: #1481f7; border-radius: 5px; display: block; with: 100%">Restablecer Contraseña</a>
                <p>Si no solicitaste esto, puedes ignorar este mensaje.</p>
                <p>¡Gracias por usar TuCamaEstudiante.com!</p>
            </div>
        `
    });
}

export default emailOlvidePassword;