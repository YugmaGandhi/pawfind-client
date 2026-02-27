import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdPets } from 'react-icons/md';
import {
    FaHome, FaClipboardList, FaPaw, FaSignOutAlt,
    FaShieldAlt, FaBars, FaTimes, FaChevronDown,
} from 'react-icons/fa';

const navLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
    }`;

export default function Navbar() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
    };

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 font-extrabold text-xl text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        <MdPets className="text-3xl" />
                        <span>PawFind</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <NavLink to="/" end className={navLinkClass}>
                            <FaHome className="text-base" />
                            Home
                        </NavLink>

                        {isAuthenticated && !isAdmin && (
                            <NavLink to="/my-applications" className={navLinkClass}>
                                <FaClipboardList className="text-base" />
                                My Applications
                            </NavLink>
                        )}

                        {isAdmin && (
                            <>
                                <NavLink to="/admin/pets" className={navLinkClass}>
                                    <FaPaw className="text-base" />
                                    Manage Pets
                                </NavLink>
                                <NavLink to="/admin/applications" className={navLinkClass}>
                                    <FaClipboardList className="text-base" />
                                    Applications
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-semibold text-gray-800 leading-none">{user?.name}</p>
                                        <p className="text-xs text-gray-500 leading-none mt-0.5 flex items-center gap-1">
                                            {isAdmin
                                                ? <><FaShieldAlt className="text-primary-500" /> Admin</>
                                                : 'User'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="btn-secondary btn-sm flex items-center gap-1.5">
                                    <FaSignOutAlt />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <NavLink to="/login" className="btn-secondary">
                                    Sign In
                                </NavLink>
                                <NavLink to="/register" className="btn-primary">
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen
                            ? <FaTimes className="w-5 h-5" />
                            : <FaBars className="w-5 h-5" />
                        }
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white pb-4 px-4 slide-in">
                    <div className="space-y-1 pt-2">
                        <NavLink
                            to="/"
                            end
                            className="flex items-center gap-2 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600"
                            onClick={() => setMobileOpen(false)}
                        >
                            <FaHome /> Home
                        </NavLink>

                        {isAuthenticated && !isAdmin && (
                            <NavLink
                                to="/my-applications"
                                className="flex items-center gap-2 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600"
                                onClick={() => setMobileOpen(false)}
                            >
                                <FaClipboardList /> My Applications
                            </NavLink>
                        )}

                        {isAdmin && (
                            <>
                                <NavLink
                                    to="/admin/pets"
                                    className="flex items-center gap-2 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <FaPaw /> Manage Pets
                                </NavLink>
                                <NavLink
                                    to="/admin/applications"
                                    className="flex items-center gap-2 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    <FaClipboardList /> Applications
                                </NavLink>
                            </>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 py-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            {isAdmin ? <><FaShieldAlt className="text-primary-500" /> Admin</> : 'User'}
                                        </p>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="w-full btn-secondary flex items-center justify-center gap-2">
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <NavLink to="/login" className="block w-full btn-secondary text-center" onClick={() => setMobileOpen(false)}>
                                    Sign In
                                </NavLink>
                                <NavLink to="/register" className="block w-full btn-primary text-center" onClick={() => setMobileOpen(false)}>
                                    Register
                                </NavLink>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
