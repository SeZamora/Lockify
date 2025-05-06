

export const VerContrasenas = ({contrasena, setVerEmergente}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Detalles de la Contraseña</h2>
                <p><strong>Nombre:</strong> {contrasena.site_name}</p>
                <p><strong>Usuario:</strong> {contrasena.username}</p>
                <p><strong>Contraseña:</strong> {contrasena.password}</p>
                <p><strong>Descripción:</strong> {contrasena.descripcion}</p>
                <button type="button" onClick={() => setVerEmergente('')} className="bg-red-500 text-gray-700 mt-2 px-4 py-2 rounded hover:bg-gray-400">Cerrar</button>
            </div>
        </div>
    )
}