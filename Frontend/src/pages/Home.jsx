import { Card } from '../ui/components/Card';
import { useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from "../auth/context/AuthContext";
import { AgregarContrasenas } from './components/Contrasenas/AgregarContrasenas';
import { VerContrasenas } from './components/Contrasenas/VerContrasenas';
import { EditarContrasena } from './components/Contrasenas/EditarContrasena';
import { ToastContainer, toast } from 'react-toastify';
import PhotoCaptureModal from '../ux/PhotoCapture'; 

import {
    getUserPasswords,
    createUserPassword,
    updateUserPassword,
    deleteUserPassword,
    getPasswordDetails
  } from './components/Contrasenas/helper/actions';
  

const jsonContrasenas = [
    {
        id: 1,
        nombre: 'Banco',
        usuario: '1140922',
        contrasena: '123456'
    },
    {
        id: 2,
        nombre: 'Google',
        usuario: '1140922',
        contrasena: '123456'
    },
    {
        id: 3,
        nombre: 'Facebook',
        usuario: '1140922',
        contrasena: '123456'
    },
    {
        id: 4,
        nombre: 'Instagram',
        usuario: '1140922',
        contrasena: '123456'
    },
    {
        id: 5,
        nombre: 'Twitter',
        usuario: '1140922',
        contrasena: '123456'
    },
]

export const Home = () => {
    const { user } = useContext(AuthContext);
    const cameraRef = useRef(null);
  
    const notifySuccess = (msg) => toast.success(msg);
    const notifyError = (msg) => toast.error(msg);
  
    const [contrasenas, setContrasenas] = useState([]);
    const [contrasena, setContrasena] = useState(null);
    const [verEmergente, setVerEmergente] = useState('');
    const [rutaEmergente, setRutaEmergente] = useState('');
  
    useEffect(() => {
      if (user?.id) {
        cargarContrasenas();
      }
    }, [user]);
  
    const cargarContrasenas = async () => {
      const result = await getUserPasswords(user.id);
      if (result.exito) {
        setContrasenas(result.contrasenas);
      } else {
        notifyError(result.mensaje);
      }
    };
  
    const handleGuardarContrasena = async (e) => {
      e.preventDefault();
      const data = {
        user_id: user.id,
        site_name: e.target.nombre.value,
        user_name: e.target.usuario.value,
        password: e.target.contrasena.value,
        descripcion: e.target.descripcion.value || ''
      };
  
      const res = await createUserPassword(data);
      if (res.exito) {
        notifySuccess("Contraseña guardada correctamente.");
        setVerEmergente('');
        cargarContrasenas();
      } else {
        notifyError(res.mensaje);
      }
    };
  
    const handleEditarContrasena = async (e) => {
      e.preventDefault();
      const data = {
        site_name: e.target.nombre.value,
        user_name: e.target.usuario.value,
        password: e.target.contrasena.value,
        descripcion: e.target.descripcion.value || ''
      };
  
      const res = await updateUserPassword(contrasena.id, data);
      if (res.exito) {
        notifySuccess("Contraseña actualizada correctamente.");
        setVerEmergente('');
        cargarContrasenas();
      } else {
        notifyError(res.mensaje);
      }
    };
  
    const handleEliminarContrasena = async () => {
      const res = await deleteUserPassword(contrasena.id);
      if (res.exito) {
        notifySuccess("Contraseña eliminada correctamente.");
        setVerEmergente('');
        cargarContrasenas();
      } else {
        notifyError(res.mensaje);
      }
    };
  
    const handleVerContrasena = async (id) => {
      const res = await getPasswordDetails(id);
      if (res.exito) {
        setContrasena(res.contrasena);
      } else {
        notifyError(res.mensaje);
      }
    };
  
    const handleCapturaFoto = async (fotoBase64) => {
      // Aquí puedes integrar la lógica de verificación facial real si la tienes
      const response = { exito: true };
  
      if (response.exito) {
        notifySuccess("Identidad verificada");
        if (rutaEmergente === 'eliminarContrasena') {
          setTimeout(() => {
            handleEliminarContrasena();
          }, 500);
        } else {
          setTimeout(() => {
            setVerEmergente(rutaEmergente);
          }, 500);
        }
      } else {
        notifyError("No se pudo verificar tu identidad.");
      }
    };
  
    return (
      <>
        <div className="mt-12 flex mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setVerEmergente('agregarContrasena')}
          >
            Añadir Contraseña
          </button>
        </div>
  
        <div className="mt-2 grid grid-cols-3 p-4 gap-4">
          {contrasenas.map((con) => (
            <Card key={con.id} className="bg-bg-200 w-full p-10 rounded-md border-2 border-bg-300">
              <h1 className="text-3xl font-bold text-center">{con.site_name}</h1>
              <div className="flex items-center justify-center mt-4">
                <button
                  className="bg-green-400 px-4 py-1 rounded-md my-2 w-full text-white font-bold mr-2"
                  onClick={() => {
                    setRutaEmergente('verContrasena');
                    handleVerContrasena(con.id);
                    cameraRef.current.open();
                  }}
                >
                  Ver
                </button>
                <button
                  className="bg-blue-400 px-4 py-1 rounded-md my-2 w-full text-white font-bold mr-2"
                  onClick={() => {
                    setRutaEmergente('editarContrasena');
                    handleVerContrasena(con.id);
                    cameraRef.current.open();
                  }}
                >
                  Editar
                </button>
                <button
                  className="bg-red-400 px-4 py-1 rounded-md my-2 w-full text-white font-bold mr-2"
                  onClick={() => {
                    setRutaEmergente('eliminarContrasena');
                    handleVerContrasena(con.id);
                    cameraRef.current.open();
                  }}
                >
                  Eliminar
                </button>
              </div>
            </Card>
          ))}
        </div>
  
        {verEmergente === 'agregarContrasena' && (
          <AgregarContrasenas handleGuardarContrasena={handleGuardarContrasena} setVerEmergente={setVerEmergente} />
        )}
  
        {verEmergente === 'verContrasena' && (
          <VerContrasenas contrasena={contrasena} setVerEmergente={setVerEmergente} />
        )}
  
        {verEmergente === 'editarContrasena' && (
          <EditarContrasena contrasena={contrasena} handleEditarContrasena={handleEditarContrasena} setVerEmergente={setVerEmergente} />
        )}
  
        <PhotoCaptureModal
          ref={cameraRef}
          onCapture={handleCapturaFoto}
          onClose={() => toast.info("Verificación cancelada.")}
        />
  
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    );
  };
  
  export default Home;