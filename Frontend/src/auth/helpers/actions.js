const api = import.meta.env.VITE_API_URL;

export const login = async (data) => {
    try {
        console.log(data);
        const response = await fetch(`${api}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: data.username,
                password: data.password
            }),
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas');
        }

        const result = await response.json();

        return {
            exito: true,
            mensaje: "Inicio de sesión exitoso",
            usuario: {
                id: result.id,
                username: result.username,
                email: result.email
            }
        };

    } catch (error) {
        return {
            exito: false,
            mensaje: error.message
        };
    }
};

export const RegistroUser = async (data, photoBase64) => {  
    try {
        const response = await fetch(`${api}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: data.password,
                faceImage: "BASE64"
            }),
        });

        if (!response.ok) {
            throw new Error('Error al registrar el usuario');
        }

        return {
            exito: true,
            mensaje: "Registro exitoso",
        };

    } catch (error) {
        return {
            exito: false,
            mensaje: error.message
        };
    }
}


export const verificarFoto = async (fotoBase64, id) => {
    try {
        const response = await fetch(`${api}/auth/2fa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                faceImage: fotoBase64,
                id
            }),
        });

        if (!response.ok) {
            throw new Error('Error al verificar la foto');
        }


        return {
            exito: true,
            mensaje: "Verificación exitosa",
        };

    } catch (error) {
        return {
            exito: false,
            mensaje: error.message
        };
    }
}
    