const api = import.meta.env.VITE_API_URL;

// Subir archivo
export const subirArchivo = async (user_id, fileName, file) => {
  const fileType = file.type;
  const fileBase64 = await toBase64(file);

  try {
    const response = await fetch(`${api}/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id,
        fileName,
        fileType,
        file: fileBase64
      })
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message);

    return {
      exito: true,
      message: result.message,
      id: result.id,
      url: result.url
    };
  } catch (error) {
    return {
      exito: false,
      message: error.message
    };
  }
};

// Obtener documentos de un usuario
export const obtenerDocumentos = async (userId) => {
  try {
    const response = await fetch(`${api}/files/${userId}`);
    const result = await response.json();

    if (result.message) throw new Error(result.message);

    return result; // ya es un array de documentos
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    return [];
  }
};

// Eliminar documento
export const eliminarDocumento = async (id) => {
  try {
    const response = await fetch(`${api}/files/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.message);

    return {
      exito: true,
      message: result.message
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Helper: convertir a base64
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
