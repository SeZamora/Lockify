import * as authModel from '../models/auth.js';
import axios from 'axios';

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

        // Ensure the image string is properly formatted
        let formattedImage = faceImage;
        // Add padding if necessary
        while (formattedImage.length % 4) {
            formattedImage += '=';
        }

        // Upload face image first
        try {
            const uploadResponse = await axios.post('https://wu65aqdn9e.execute-api.us-east-1.amazonaws.com/cargarImagen', {
                fileName: `face_${Date.now()}.jpg`,
                fileType: 'image/jpeg',
                fileContent: formattedImage
            });

            if (!uploadResponse.data.fileUrl) {
                throw new Error('Error al subir la imagen de registro');
            }

            // Register user with the image URL
            const user = await authModel.register({ 
                name, 
                email, 
                password, 
                faceImage: uploadResponse.data.fileUrl 
            });
            
            res.status(201).json({ message: 'Usuario registrado exitosamente', user });
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            return res.status(500).json({ message: 'Error al subir la imagen', details: error.message });
        }
    } catch (error) {
        console.error('Error en registro:', error);
        if (error.response?.data?.error) {
            return res.status(400).json({ message: error.response.data.error });
        }
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

export async function verifyFace(req, res) {
    try {
        const { faceImage, id } = req.body;

        if (!faceImage || !id) {
            return res.status(400).json({ message: 'Se requiere imagen facial y ID de usuario' });
        }

        // Ensure the image string is properly formatted
        let formattedImage = faceImage;
        // Add padding if necessary
        while (formattedImage.length % 4) {
            formattedImage += '=';
        }

        // 1. Primero, subir la imagen nueva usando el primer gateway
        try {
            const uploadResponse = await axios.post('https://wu65aqdn9e.execute-api.us-east-1.amazonaws.com/cargarImagen', {
                fileName: `face_verify_${Date.now()}.jpg`,
                fileType: 'image/jpeg',
                fileContent: formattedImage
            });

            if (!uploadResponse.data.fileUrl) {
                throw new Error('Error al subir la imagen de verificación');
            }

            // 2. Obtener la URL de la imagen almacenada del usuario desde la base de datos
            const storedImageUrl = await authModel.getUserFaceImage(id);

            // 3. Comparar las imágenes usando el segundo gateway
            const compareResponse = await axios.post('https://wu65aqdn9e.execute-api.us-east-1.amazonaws.com/compararImagen', {
                url1: uploadResponse.data.fileUrl,
                url2: storedImageUrl
            });

            const similarity = compareResponse.data.similitud || 0;
            const threshold = 90; // Umbral de similitud (90%)

            return res.json({
                similitud: similarity >= threshold,
                similarity: similarity
            });
        } catch (error) {
            console.error('Error al procesar la imagen:', error);
            return res.status(500).json({ 
                message: 'Error al procesar la imagen',
                error: error.message 
            });
        }
    } catch (error) {
        console.error('Error en verificación facial:', error);
        res.status(500).json({ 
            message: 'Error en verificación facial',
            error: error.message 
        });
    }
}