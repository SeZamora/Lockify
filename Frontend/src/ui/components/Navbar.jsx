import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';
import { useContext } from 'react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login', {
            replace: true
        });
    }

    return (
        <nav className="bg-gradient-to-r from-teal-600 to-indigo-600 fixed top-0 left-0 w-full z-50 shadow-lg">
            <div className="container mx-auto flex items-center justify-between py-1 px-1">
                
                <a className="text-2xl font-bold text-orange-400 cursor-pointer mr-auto" onClick={() => navigate('/home')}>
                    TaskFlow
                </a>
                
                <button className="lg:hidden text-white text-1xl">
                    <i className="fas fa-bars"></i>
                </button>

                <ul className="hidden lg:flex space-x-6 text-white text-lg">
                    <li className="flex flex-col items-center cursor-pointer hover:text-orange-300" onClick={() => navigate('/home')}>
                        <i className="fa fa-shopping-cart text-1xl"></i>
                        <span>Tareas</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-orange-300" onClick={() => navigate('/documentos')}>
                        <i className="fa fa-star text-1xl"></i>
                        <span>CloudDrive</span>
                    </li>
                </ul>
                
                <button className="text-white flex flex-col items-center hover:text-red-400 ml-auto" onClick={() => onLogout()}>
                    <i className="fa fa-sign-out text-1xl"></i>
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;