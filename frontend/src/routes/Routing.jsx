import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useUser } from "../context/UserContext";
import AdminUsersList from "../pages/AdminUsersList";
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
import PsicologosList from "../pages/PsicologosList";
import { Spinner, Center, Text } from '@chakra-ui/react';


// ----------------------------------------------------
// 1. Componente de Carga Global (Spinner)
// ----------------------------------------------------

const GlobalLoadingSpinner = () => (
    <Center minH="100vh" flexDirection="column" bg="gray.50">
        <Spinner size="xl" color="primary.500" thickness="4px" />
        <Text mt={4} fontSize="lg" color="gray.600">Cargando sesión...</Text>
    </Center>
);


// ----------------------------------------------------
// 2. Rutas Protegidas (Usando Contexto)
// ----------------------------------------------------

// Componente para proteger rutas de Admin
const AdminRoute = ({ children }) => {
    // 🔑 Usamos el contexto para acceder al usuario y al estado de carga
    const { usuarioActual, authReady } = useUser(); 

    if (!authReady) {
        // Muestra el spinner mientras el contexto revisa localStorage
        return <GlobalLoadingSpinner />; 
    }

    // Una vez listo el contexto, verifica el rol
    if (!usuarioActual || usuarioActual.tipo !== "admin") {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Componente para proteger rutas generales (psicólogo/voluntario)
const ProtectedRoute = ({ children }) => {
    // 🔑 Usamos el contexto para acceder al usuario y al estado de carga
    const { usuarioActual, authReady } = useUser(); 

    if (!authReady) {
        // Muestra el spinner mientras el contexto revisa localStorage
        return <GlobalLoadingSpinner />;
    }

    // Una vez listo el contexto, verifica si es un tipo de usuario permitido
    // Permitimos psicólogo o voluntario (asumiendo que "comun" es el no permitido)
    if (!usuarioActual || usuarioActual.tipo === "comun") { 
        return <Navigate to="/login" replace />;
    }
    return children;
};

// ----------------------------------------------------
// 3. Routing Principal
// ----------------------------------------------------

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
            <Route path="/psicologos" element={<PsicologosList />} />
            <Route path="/techniques/:slug" element={<TecnicasPorCategoria />} />

            {/* Rutas Protegidas (ahora esperan authReady) */}
            <Route path="/psicologo/:id" element={<ProtectedRoute><PsicologoProfile /></ProtectedRoute>} />
            <Route path="/voluntario-perfil/:id" element={<ProtectedRoute><VolunterProfile /></ProtectedRoute>} />

            {/* Rutas de Admin */}
            <Route
                path="/"
                element={
                    <AdminRoute> 
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route path="admin-techniques" element={<AdminTechniques />} />
                <Route path="admin-register" element={<AdminRegister />} />
                <Route path="admin/users" element={<AdminUsersList />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
