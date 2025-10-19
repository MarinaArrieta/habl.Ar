import { Route, Routes, Navigate } from "react-router-dom";
import Techniques from "../pages/Techniques";
import NotFound from "../pages/NotFound";
import Home from "../pages/Home";
import Faq from "../pages/Faq";
import Register from "../pages/Register";
import Login from "../pages/Login";
import AdminTechniques from "../pages/AdminTechniques";
import AdminRegister from "../pages/AdminRegister";
import PsicologoProfile from "../pages/PsicologoProfile";
import VolunterProfile from "../pages/VolunterProfile";
import VoluntarioCurso from "../pages/VoluntarioCurso";
import SobreNosotros from "../pages/SobreNosotros";
import TecnicasPorCategoria from "../pages/TecnicasPorCategoria"; 

// Componente para proteger rutas de admin
const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (!user || user.tipo !== "admin") {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("usuario"));
    // Si no hay usuario o si el tipo es 'comun', redirige a login.
    if (!user || user.tipo === "comun") {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/techniques" element={<Techniques />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/curso-voluntario" element={<VoluntarioCurso />} />
            <Route path="/sobre-nosotros" element={<SobreNosotros />} />
            
            {/* RUTA DINÁMICA: Carga la lista de técnicas filtradas por Categoría (:slug) */}
            <Route 
                path="/techniques/:slug" 
                element={<TecnicasPorCategoria />} 
            />

            {/* RUTA DE PERFIL PSICÓLOGO */}
            <Route
                path="/psicologo/:id"
                element={
                    <ProtectedRoute>
                        <PsicologoProfile />
                    </ProtectedRoute>
                }
            />

            {/* RUTA DE PERFIL VOLUNTARIO */}
            <Route
                path="/voluntario-perfil/:id"
                element={
                    <ProtectedRoute>
                        <VolunterProfile />
                    </ProtectedRoute>
                }
            />

            {/* Rutas protegidas solo para admins */}
            <Route
                path="/admin-techniques"
                element={
                    <AdminRoute>
                        <AdminTechniques />
                    </AdminRoute>
                }
            />

            {/* RUTA PROTEGIDA para registrar administradores */}
            <Route
                path="/admin-register"
                element={
                    <AdminRoute>
                        <AdminRegister />
                    </AdminRoute>
                }
            />

            {/* Opcional: Si quieres un detalle de técnica individual más adelante */}
            {/* <Route path="/techniques/:slug/:techniqueId" element={<TecnicaDetail />} /> */}

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}