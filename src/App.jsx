import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute } from './routes/ProtectedRoutes';
import Layout from './components/Layout';
import { PageLoader } from './components/LoadingSpinner';

// Public pages
import HomePage from './pages/HomePage';
import PetDetailPage from './pages/PetDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User pages
import MyApplicationsPage from './pages/MyApplicationsPage';

// Admin pages
import AdminPetsPage from './pages/admin/AdminPetsPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';

// Error pages
import { NotFoundPage, ForbiddenPage } from './pages/ErrorPages';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route element={<Layout />}>
                            {/* Public Routes */}
                            <Route index element={<HomePage />} />
                            <Route path="/pets/:id" element={<PetDetailPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/403" element={<ForbiddenPage />} />

                            {/* User Protected Routes */}
                            <Route element={<PrivateRoute />}>
                                <Route path="/my-applications" element={<MyApplicationsPage />} />
                            </Route>

                            {/* Admin Protected Routes */}
                            <Route path="/admin" element={<AdminRoute />}>
                                <Route index element={<Navigate to="/admin/pets" replace />} />
                                <Route path="pets" element={<AdminPetsPage />} />
                                <Route path="applications" element={<AdminApplicationsPage />} />
                            </Route>

                            {/* 404 Catch-all */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </Suspense>
            </AuthProvider>
        </BrowserRouter>
    );
}
