import nodemailer from "nodemailer";

// Envia mail al propietario desde la publicación del alojamiento
const emailPropietario = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    // Enviar email
    const {nombre, emailUsuario, telefono, mensaje, email, tituloPublicacion} = datos;

    const info = await transporter.sendMail({
        // Contenido del email
        from: 'TuCamaEstudiante.com - Portal de Alquiler de Alojamientos para Estudiantes',
        to: email,
        subject: `Tienes un interesado en tu alojamiento publicado en TuCamaEstudiante.com`,
        text: `Tienes un interesado en tu alojamiento publicado en TuCamaEstudiante.com`,
        html: `
            <div style="font-family: 'Montserrat', sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto;">
                <h2 style="color: #1481f7;">¡Tienes un nuevo interesado en tu alojamiento!</h2>
                <p>Hola,</p>
                <p>
                    Tienes un nuevo interesado en tu alojamiento publicado en TuCamaEstudiante.com: 
                    <span style="font-weight: bold; text-transform: uppercase;">${tituloPublicacion}.</span>
                </p>
                <p>A continuación, encontrarás los detalles de la consulta:</p>
                <ul>
                    <li><strong>Nombre:</strong> ${nombre}</li>
                    <li><strong>Teléfono:</strong> ${telefono}</li>
                    <li><strong>Email:</strong> ${emailUsuario}</li>
                </ul>
                <p><strong>Mensaje:</strong></p>
                <p style="white-space: pre-wrap;">${mensaje}</p>
            </div>
        `
    });
}

export default emailPropietario;