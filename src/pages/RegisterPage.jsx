import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../api/services';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdPets } from 'react-icons/md';
import { FaSpinner, FaEnvelope, FaLock, FaUser, FaCheck, FaCircle } from 'react-icons/fa';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) {
            setErrors((prev) => ({ ...prev, [e.target.name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        try {
            const res = await registerApi(form);
            const { user, token } = res.data.data;
            login(user, token);
            toast.success(`Welcome to PawFind, ${user.name}!`);
            navigate('/', { replace: true });
        } catch (err) {
            const status = err.response?.status;
            const data = err.response?.data;

            if (status === 400 && data?.errors) {
                const fieldErrors = {};
                data.errors.forEach(({ field, message }) => {
                    fieldErrors[field] = message;
                });
                setErrors(fieldErrors);
            } else if (status === 409) {
                setErrors({ email: 'This email is already registered.' });
            } else if (status === 429) {
                toast.error('Too many requests. Please try again after 15 minutes.');
            } else {
                toast.error(data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const passwordHints = [
        { text: 'At least 8 characters', met: form.password.length >= 8 },
        { text: 'One uppercase letter', met: /[A-Z]/.test(form.password) },
        { text: 'One number', met: /[0-9]/.test(form.password) },
    ];

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md fade-in">
                <div className="card p-8">
                    <div className="text-center mb-8">
                        <MdPets className="text-5xl text-primary-500 mx-auto mb-3" />
                        <h1 className="text-2xl font-extrabold text-gray-900">Create an account</h1>
                        <p className="text-gray-500 mt-1 text-sm">Join PawFind and find your furry companion</p>
                    </div>

                    <form id="register-form" onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="label">Full Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Jane Doe"
                                    className={`input pl-9 ${errors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                                    required
                                />
                            </div>
                            {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="label">Email address</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`input pl-9 ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                                    required
                                />
                            </div>
                            {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="label">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Create a strong password"
                                    className={`input pl-9 ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                                    required
                                />
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}

                            {/* Password strength hints */}
                            {form.password && (
                                <ul className="mt-2 space-y-1">
                                    {passwordHints.map((hint) => (
                                        <li
                                            key={hint.text}
                                            className={`flex items-center gap-1.5 text-xs transition-colors ${hint.met ? 'text-green-600' : 'text-gray-400'}`}
                                        >
                                            {hint.met
                                                ? <FaCheck className="text-green-500 text-xs" />
                                                : <FaCircle className="text-gray-300 text-xs" />
                                            }
                                            {hint.text}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            id="register-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary btn-lg"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
