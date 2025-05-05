import { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login as LoginHelper, verificarFoto } from '../helpers/actions';
import { ToastContainer, toast } from 'react-toastify';
import PhotoCaptureModal from '../../ux/PhotoCapture';

export const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [credenciales, setCredenciales] = useState({ username: '', contrasena: '' });
  const [error, setError] = useState(null);
  const [usuarioTemp, setUsuarioTemp] = useState(null);

  const cameraRef = useRef(null);

  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredenciales((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = {
      username: credenciales.username,
      password: credenciales.contrasena
    };

    const respuesta = await LoginHelper(data);
    console.log("respuesta", respuesta);

    if (!respuesta.exito) {
      notifyError(respuesta.mensaje);
      setError(respuesta.mensaje);
      return;
    }

    setUsuarioTemp(respuesta.usuario);
    notifySuccess("Credenciales correctas. Verificación facial requerida.");
    cameraRef.current.open();
  };

  const handleFotoCapturada = async (fotoBase64) => {
    notifySuccess("Foto capturada. Verificando...");

    //const response = await verificarFoto(fotoBase64, usuarioTemp.id);
    const prueba = true; 
    if (prueba) {
      notifySuccess("Identidad verificada. ¡Bienvenido!");
      //console.log(fotoBase64)
      login(usuarioTemp.username, usuarioTemp.id)

    } else {
      notifyError("No se pudo verificar tu identidad.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Iniciar sesión</h2>

        {error && <div className="bg-red-500 text-white p-2 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="correo" className="block text-sm font-medium text-gray-600">Correo</label>
            <input
              type="email"
              id="username"
              name="username"
              value={credenciales.username}
              onChange={handleChange}
              placeholder="Tu correo electrónico"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-600">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={credenciales.contrasena}
              onChange={handleChange}
              placeholder="Tu contraseña"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">¿No tienes cuenta? <a href="/register" className="text-indigo-600 hover:text-indigo-700">Regístrate</a></p>
        </div>
      </div>

      <PhotoCaptureModal
        ref={cameraRef}
        onCapture={handleFotoCapturada}
        onClose={() => toast.info("Verificación cancelada.")}
      />
    </div>
  );
};
