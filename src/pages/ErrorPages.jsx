import { Link } from 'react-router-dom';
import { MdPets } from 'react-icons/md';
import { FaBan, FaArrowLeft } from 'react-icons/fa';

export function NotFoundPage() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <MdPets className="text-8xl text-gray-200 mx-auto mb-4" />
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3">404</h1>
            <p className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</p>
            <p className="text-gray-500 mb-8 max-w-sm">
                Looks like this page ran away! Let&apos;s get you back on track.
            </p>
            <Link to="/" className="btn-primary btn-lg flex items-center gap-2">
                <FaArrowLeft className="text-sm" /> Back to Home
            </Link>
        </div>
    );
}

export function ForbiddenPage() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FaBan className="text-red-400 text-4xl" />
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-3">403</h1>
            <p className="text-xl font-semibold text-gray-700 mb-2">Access Denied</p>
            <p className="text-gray-500 mb-8 max-w-sm">
                You don&apos;t have permission to view this page. Admin access is required.
            </p>
            <Link to="/" className="btn-primary btn-lg flex items-center gap-2">
                <FaArrowLeft className="text-sm" /> Back to Home
            </Link>
        </div>
    );
}
