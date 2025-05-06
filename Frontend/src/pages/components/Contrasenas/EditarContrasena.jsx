// editar contrasena

export const EditarContrasena = ({contrasena, handleEditarContrasena, setVerEmergente}) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Editar Contraseña</h2>
                <form onSubmit={handleEditarContrasena}> 
                    <div className="mb-4">
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" id="nombre" name="nombre" defaultValue={contrasena.site_name} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario</label>
                        <input type="text" id="usuario" name="usuario" defaultValue={contrasena.username} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input type="password" id="contrasena" name="contrasena" defaultValue={contrasena.password} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripcion</label>
                        <input type="text" id="descripcion" name="descripcion" defaultValue={contrasena.descripcion} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2">Guardar</button>
                    <button type="button" onClick={() => setVerEmergente('')} className="bg-red-500 text-gray-700 mt-2 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
                </form>
            </div>
        </div>
    )
}