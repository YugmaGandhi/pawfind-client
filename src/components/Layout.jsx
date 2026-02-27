import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import { MdPets } from 'react-icons/md';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    <p className="flex items-center justify-center gap-1.5">
                        <MdPets className="text-primary-500 text-lg" />
                        PawFind — Pet Adoption Management System &copy; {new Date().getFullYear()}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Connecting pets with loving families</p>
                </div>
            </footer>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        borderRadius: '10px',
                        background: '#1e293b',
                        color: '#f8fafc',
                        fontSize: '14px',
                    },
                    success: {
                        iconTheme: { primary: '#22c55e', secondary: '#fff' },
                    },
                    error: {
                        iconTheme: { primary: '#ef4444', secondary: '#fff' },
                    },
                }}
            />
        </div>
    );
}
