const api = import.meta.env.VITE_API_URL;

// Obtener todas las contraseñas de un usuario
export const getUserPasswords = async (userId) => {
    try {
        const response = await fetch(`${api}/credentials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userId }),
        });

        const result = await response.json();

        if (!result.bandera) throw new Error(result.mensaje);

        return {
            exito: true,
            contrasenas: result.contrasenas
        };
    } catch (error) {
        return {
            exito: false,
            mensaje: error.message
        };
    }
};

// Crear una nueva contraseña
export const createUserPassword = async ({ user_id, site_name, user_name, password, descripcion }) => {
    try {
        const response = await fetch(`${api}/credentials/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id, site_name, user_name, password, descripcion }),
        });

        const result = await response.json();

        if (!result.bandera) throw new Error(result.mensaje);

        return {
            exito: true,
            mensaje: result.mensaje
        };
    } catch (error) {
        return {
            exito: false,
            mensaje: error.message
        };
    }
};

// Obtener detalles de una contraseña específica
export const getPasswordDetails = async (id) => {
    try {
        const response = await fetch(`${api}/credentials/${id}`, {
            method: 'POST',
        });

        const result = await response.json();

        if (!result.bandera) throw new Error(result.mensaje);

        return {
            exito: true,
            contrasena: result.contrasena
        };
    } catch (error) {
        return {
            exito: false,
            mensaje: error.message
        };
    }
};

// Actualizar una contraseña
export const updateUserPassword = async (id, { site_name, user_name, password, descripcion }) => {
    try {
        const response = await fetch(`${api}/credentials/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ site_name, user_name, password, descripcion }),
        });

        const result = await response.json();

        if (!result.bandera) throw new Error(result.mensaje);

        return {
            exito: true,
            mensaje: result.mensaje
        };
    } catch (error) {
        return {
            exito: false,
            mensaje: error.message
        };
    }
};

// Eliminar una contraseña
export const deleteUserPassword = async (id) => {
    try {
        const response = await fetch(`${api}/credentials/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!result.bandera) throw new Error(result.mensaje);

        return {
            exito: true,
            mensaje: result.mensaje
        };
    } catch (error) {
        return {
            exito: false,
            mensaje: error.message
        };
    }
};
