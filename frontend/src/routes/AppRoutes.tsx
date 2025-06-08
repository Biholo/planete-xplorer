import { useAutoLogin } from '@/api/queries/authQueries';
import PrivateRoutes from '@/routes/PrivateRoutes';
import PublicRoutes from '@/routes/PublicRoutes';

import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import Sidebar from '@/components/layout/Sidebar';
import Loader from '@/components/ui/Loader/Loader';

import Error from '@/features/Error';
import Login from '@/features/auth/Login';
import Register from '@/features/auth/Register';
import Categories from '@/features/categories/Categories';
import CelestialObjects from '@/features/celestial-objects/CelestialObjects';
import Systemes from '@/features/systems/Systems';
import { useAuthStore } from '@/stores/authStore';

const AppRoutes = () => {
    const { isAuthenticated } = useAuthStore();

    const { refetch: autoLogin, isPending } = useAutoLogin();

    useEffect(() => {
        autoLogin();
    }, [autoLogin]);

    if (isPending) return <Loader />;

    return (
        <html lang="fr" className="dark">
      <body className="antialiased">
        <div className="min-h-screen flex">
            {isAuthenticated && <Sidebar />}
            <main className="flex-grow">
                <Routes>
                    {/* Routes publiques */}
                    <Route element={<PublicRoutes />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* Routes privées */}
                    <Route element={<PrivateRoutes />}>
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/celestial-objects" element={<CelestialObjects />} />
                        <Route path="/systems" element={<Systemes />} />
                        <Route path="/" element={<Categories />} />
                    </Route>

                    {/* Route par défaut */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    <Route path="/error" element={<Error />} />
                </Routes>
            </main>
        </div>
        </body>
        </html>
    );
};

export default AppRoutes;
