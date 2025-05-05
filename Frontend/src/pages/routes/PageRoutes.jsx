import { PrivateRoute } from '../../router/PrivateRoute';
import { Outlet } from "react-router-dom";
import { Home } from '../Home';
import { Documentos } from '../Documentos';
import Navbar from '../../ui/components/Navbar';

const PageRoutesComponent = () => {
    return (
      <PrivateRoute>
        <Navbar />
        <div className="p-4">
          <Outlet /> 
        </div>
      </PrivateRoute>
    );
  };
  
  export const PageRoutes = {
    element: <PageRoutesComponent />,
    children: [
      {
        path: "/home",
        element: (
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        ),
      },
      {
        path: "/documentos",
        element: (
          <PrivateRoute>
            <Documentos />
          </PrivateRoute>
        ),
      }
    ],
  };