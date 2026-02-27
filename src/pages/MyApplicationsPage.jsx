import { Link } from 'react-router-dom';
import { PageLoader } from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import PetSpeciesIcon from '../components/PetSpeciesIcon';
import { useMyApplications } from '../hooks/useQueries';
import { FaClipboardList, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function MyApplicationsPage() {
    // ── Cached query ─────────────────────────────────────────────────────────────
    const { data: applications = [], isLoading, isError } = useMyApplications();
    // ─────────────────────────────────────────────────────────────────────────────

    useEffect(() => {
        if (isError) toast.error('Failed to load your applications.');
    }, [isError]);

    if (isLoading) return <PageLoader />;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="page-title">My Applications</h1>
                <p className="text-gray-500 mt-2">Track the status of your adoption applications</p>
            </div>

            {applications.length === 0 ? (
                <div className="card p-12 text-center fade-in">
                    <FaClipboardList className="text-5xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-6">You haven&apos;t applied to adopt any pets yet. Browse available pets and find your companion!</p>
                    <Link to="/" className="btn-primary">Browse Pets</Link>
                </div>
            ) : (
                <div className="space-y-4 fade-in">
                    {/* Desktop table */}
                    <div className="table-wrapper hidden md:block">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Pet</th>
                                    <th>Species &amp; Breed</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary-50 flex-shrink-0 flex items-center justify-center">
                                                    {app.pet?.photoUrl
                                                        ? <img src={app.pet.photoUrl} alt={app.pet?.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                                        : <PetSpeciesIcon species={app.pet?.species} className="text-primary-400 text-xl" />}
                                                </div>
                                                <span className="font-semibold text-gray-900">{app.pet?.name || '—'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="text-gray-700 flex items-center gap-1.5">
                                                <PetSpeciesIcon species={app.pet?.species} className="text-primary-400 text-sm" />
                                                {app.pet?.species}
                                            </p>
                                            <p className="text-xs text-gray-400">{app.pet?.breed}</p>
                                        </td>
                                        <td>
                                            <p>{new Date(app.applicationDate).toLocaleDateString()}</p>
                                            <p className="text-xs text-gray-400">{new Date(app.applicationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td><StatusBadge status={app.status} /></td>
                                        <td>
                                            <Link to={`/pets/${app.petId}`} className="btn-ghost btn-sm flex items-center gap-1.5">
                                                View Pet <FaArrowRight className="text-xs" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-3">
                        {applications.map((app) => (
                            <div key={app.id} className="card p-4 fade-in">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary-50 flex-shrink-0 flex items-center justify-center">
                                        {app.pet?.photoUrl
                                            ? <img src={app.pet.photoUrl} alt={app.pet?.name} className="w-full h-full object-cover" />
                                            : <PetSpeciesIcon species={app.pet?.species} className="text-primary-400 text-2xl" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{app.pet?.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <PetSpeciesIcon species={app.pet?.species} className="text-primary-400 text-xs" />
                                            {app.pet?.species} · {app.pet?.breed}
                                        </p>
                                    </div>
                                    <div className="ml-auto"><StatusBadge status={app.status} /></div>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>Applied: {new Date(app.applicationDate).toLocaleDateString()}</span>
                                    <Link to={`/pets/${app.petId}`} className="text-primary-600 font-medium flex items-center gap-1">
                                        View Pet <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 text-center">
                        {applications.length} application{applications.length !== 1 ? 's' : ''} total
                    </p>
                </div>
            )}
        </div>
    );
}
