import * as authModel from '../models/auth.js';

export async function register(req, res) {
    try {
        const { name, email, password, faceImage } = req.body;

        // Validate required fields
        if (!name || !email || !password || !faceImage) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Formato de correo inválido' });
        }

        const user = await authModel.register({ name, email, password, faceImage });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
        }

        const userWithToken = await authModel.login({ email, password });
        res.status(200).json({ message: 'Login exitoso', ...userWithToken });
    } catch (error) {
        console.error('Error en login:', error);
        if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña inválida') {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}