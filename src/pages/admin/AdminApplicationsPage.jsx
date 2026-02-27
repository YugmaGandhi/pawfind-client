import { useState, useEffect } from 'react';
import { PageLoader } from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import PetSpeciesIcon from '../../components/PetSpeciesIcon';
import { useAllApplications } from '../../hooks/useQueries';
import { useUpdateApplicationStatus } from '../../hooks/useMutations';
import toast from 'react-hot-toast';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const STATUS_FILTERS = ['', 'PENDING', 'APPROVED', 'REJECTED'];

export default function AdminApplicationsPage() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => { setPage(1); }, [statusFilter]);

    // ── Cached query ─────────────────────────────────────────────────────────────
    const params = { page, limit: 10, ...(statusFilter ? { status: statusFilter } : {}) };
    const { data, isLoading } = useAllApplications(params);
    const applications = data?.data ?? [];
    const pagination = data?.pagination ?? null;
    // ── Mutation (auto-invalidates applications + pets cache) ───────────────────
    const statusMutation = useUpdateApplicationStatus();
    // ─────────────────────────────────────────────────────────────────────────────

    const handleStatusUpdate = (appId, newStatus, petName, applicantName) => {
        statusMutation.mutate({ id: appId, status: newStatus }, {
            onSuccess: () => toast.success(`Application for ${petName} ${newStatus.toLowerCase()} for ${applicantName}.`),
            onError: (err) => toast.error(err.response?.data?.message || `Failed to ${newStatus.toLowerCase()} application.`),
        });
    };

    const isUpdating = (id) => statusMutation.isPending && statusMutation.variables?.id === id;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="page-title">Review Applications</h1>
                <p className="text-gray-500 mt-1">Approve or reject adoption applications</p>
            </div>

            {/* Status filter tabs */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                <div className="flex gap-2 flex-wrap">
                    {STATUS_FILTERS.map((s) => (
                        <button key={s || 'all'} onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${statusFilter === s ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            {s || 'All'}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? <PageLoader /> : (
                <>
                    {/* Desktop Table */}
                    <div className="table-wrapper hidden md:block">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Applicant</th><th>Pet</th><th>Applied On</th><th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center py-12 text-gray-400">
                                        No applications found{statusFilter ? ` with status "${statusFilter}"` : ''}.
                                    </td></tr>
                                ) : applications.map((app) => {
                                    const isPending = app.status === 'PENDING';
                                    const updating = isUpdating(app.id);
                                    return (
                                        <tr key={app.id}>
                                            <td>
                                                <p className="font-semibold text-gray-900">{app.user?.name}</p>
                                                <p className="text-xs text-gray-400">{app.user?.email}</p>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary-50 flex-shrink-0 flex items-center justify-center">
                                                        {app.pet?.photoUrl
                                                            ? <img src={app.pet.photoUrl} alt={app.pet?.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                                            : <PetSpeciesIcon species={app.pet?.species} className="text-primary-400" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{app.pet?.name}</p>
                                                        <p className="text-xs text-gray-400 flex items-center gap-1">
                                                            <PetSpeciesIcon species={app.pet?.species} className="text-primary-300 text-xs" />
                                                            {app.pet?.breed}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p>{new Date(app.applicationDate).toLocaleDateString()}</p>
                                                <p className="text-xs text-gray-400">{new Date(app.applicationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>
                                            <td><StatusBadge status={app.status} /></td>
                                            <td>
                                                <div className="flex items-center justify-end gap-2">
                                                    {isPending ? (
                                                        <>
                                                            <button id={`approve-${app.id}`}
                                                                onClick={() => handleStatusUpdate(app.id, 'APPROVED', app.pet?.name, app.user?.name)}
                                                                disabled={updating}
                                                                className="btn-success btn-sm flex items-center gap-1.5">
                                                                {updating ? <FaSpinner className="animate-spin" /> : <FaCheck />} Approve
                                                            </button>
                                                            <button id={`reject-${app.id}`}
                                                                onClick={() => handleStatusUpdate(app.id, 'REJECTED', app.pet?.name, app.user?.name)}
                                                                disabled={updating}
                                                                className="btn-danger btn-sm flex items-center gap-1.5">
                                                                {updating ? <FaSpinner className="animate-spin" /> : <FaTimes />} Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Processed</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {applications.length === 0 ? (
                            <div className="card p-10 text-center text-gray-400">No applications found.</div>
                        ) : applications.map((app) => {
                            const isPending = app.status === 'PENDING';
                            const updating = isUpdating(app.id);
                            return (
                                <div key={app.id} className="card p-4 fade-in">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-bold text-gray-900">{app.user?.name}</p>
                                            <p className="text-xs text-gray-500">{app.user?.email}</p>
                                        </div>
                                        <StatusBadge status={app.status} />
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                                            <PetSpeciesIcon species={app.pet?.species} className="text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{app.pet?.name}</p>
                                            <p className="text-xs text-gray-500">{app.pet?.breed}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3">Applied: {new Date(app.applicationDate).toLocaleDateString()}</p>
                                    {isPending && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleStatusUpdate(app.id, 'APPROVED', app.pet?.name, app.user?.name)} disabled={updating}
                                                className="flex-1 btn-success btn-sm flex items-center justify-center gap-1.5">
                                                {updating ? <FaSpinner className="animate-spin" /> : <FaCheck />} Approve
                                            </button>
                                            <button onClick={() => handleStatusUpdate(app.id, 'REJECTED', app.pet?.name, app.user?.name)} disabled={updating}
                                                className="flex-1 btn-danger btn-sm flex items-center justify-center gap-1.5">
                                                {updating ? <FaSpinner className="animate-spin" /> : <FaTimes />} Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <Pagination pagination={pagination} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}
