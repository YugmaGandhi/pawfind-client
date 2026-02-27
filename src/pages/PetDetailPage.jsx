import { useParams, useNavigate } from 'react-router-dom';
import { PageLoader } from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import PetSpeciesIcon from '../components/PetSpeciesIcon';
import { useAuth } from '../context/AuthContext';
import { usePet } from '../hooks/useQueries';
import { useSubmitApplication } from '../hooks/useMutations';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaPaw, FaSpinner, FaLock } from 'react-icons/fa';
import { MdPets } from 'react-icons/md';

export default function PetDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // ── Cached query ────────────────────────────────────────────────────────────
    const { data: pet, isLoading, isError, error } = usePet(id);
    // ── Mutation (invalidates pet + listings cache on success) ──────────────────
    const submitMutation = useSubmitApplication();
    // ───────────────────────────────────────────────────────────────────────────

    const handleApply = async () => {
        if (!isAuthenticated) {
            toast('Please sign in to apply for adoption', { icon: '🔒' });
            navigate('/login', { state: { from: { pathname: `/pets/${id}` } } });
            return;
        }
        submitMutation.mutate(id, {
            onSuccess: () => toast.success('Application submitted successfully!'),
            onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit application.'),
        });
    };

    if (isLoading) return <PageLoader />;

    if (isError) {
        const msg = error?.response?.status === 404 ? 'Pet not found.' : 'Failed to load pet details.';
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <MdPets className="text-7xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-3">{msg}</h2>
                <button onClick={() => navigate('/')} className="btn-primary">Back to Pet Listings</button>
            </div>
        );
    }

    if (!pet) return null;

    const canApply = pet.status === 'AVAILABLE';
    const applying = submitMutation.isPending;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6">
                <FaArrowLeft className="text-xs" /> Back to listings
            </button>

            <div className="card fade-in overflow-visible">
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Photo */}
                    <div className="relative h-72 md:h-full min-h-[300px] bg-gradient-to-br from-primary-100 to-secondary-100 rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden">
                        {pet.photoUrl ? (
                            <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                        ) : null}
                        <div className="absolute inset-0 items-center justify-center text-primary-300" style={{ display: pet.photoUrl ? 'none' : 'flex' }}>
                            <PetSpeciesIcon species={pet.species} className="text-9xl" />
                        </div>
                        <div className="absolute top-4 left-4">
                            <StatusBadge status={pet.status} />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 md:p-8 flex flex-col">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-extrabold text-gray-900">{pet.name}</h1>
                                <span className="text-primary-400 text-2xl"><PetSpeciesIcon species={pet.species} /></span>
                            </div>
                            <p className="text-primary-600 font-medium text-lg mb-4">{pet.species} · {pet.breed}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Age</p>
                                    <p className="text-lg font-bold text-gray-800 mt-1">{pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Species</p>
                                    <p className="text-lg font-bold text-gray-800 mt-1 flex items-center gap-1.5">
                                        <PetSpeciesIcon species={pet.species} className="text-primary-500" />{pet.species}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Breed</p>
                                    <p className="text-base font-semibold text-gray-800 mt-1">{pet.breed}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</p>
                                    <div className="mt-1"><StatusBadge status={pet.status} /></div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">About {pet.name}</h2>
                                <p className="text-gray-600 leading-relaxed">{pet.description}</p>
                            </div>
                        </div>

                        {/* Apply */}
                        <div className="border-t border-gray-100 pt-6">
                            {canApply ? (
                                <button id="apply-adoption-btn" onClick={handleApply} disabled={applying} className="w-full btn-primary btn-lg">
                                    {applying ? <><FaSpinner className="animate-spin" /> Submitting...</> : <><FaPaw /> Apply to Adopt {pet.name}</>}
                                </button>
                            ) : (
                                <div className="w-full bg-gray-100 text-gray-500 text-center py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2">
                                    <MdPets className="text-lg" />
                                    {pet.status === 'ADOPTED' ? `${pet.name} has already been adopted` : `${pet.name} is currently pending adoption`}
                                </div>
                            )}
                            {!isAuthenticated && canApply && (
                                <p className="text-center text-sm text-gray-500 mt-3 flex items-center justify-center gap-1.5">
                                    <FaLock className="text-xs text-gray-400" />
                                    You need to{' '}
                                    <button onClick={() => navigate('/login')} className="text-primary-600 font-medium hover:underline">sign in</button>
                                    {' '}to apply
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
