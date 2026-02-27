import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PetCardSkeleton } from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import PetSpeciesIcon from '../components/PetSpeciesIcon';
import { useFilterOptions, usePets } from '../hooks/useQueries';
import { FaSearch, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

function PetCard({ pet }) {
    const navigate = useNavigate();

    return (
        <div
            className="card group cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 fade-in"
            onClick={() => navigate(`/pets/${pet.id}`)}
        >
            <div className="relative h-52 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
                {pet.photoUrl ? (
                    <img
                        src={pet.photoUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                <div className="absolute inset-0 items-center justify-center text-primary-300" style={{ display: pet.photoUrl ? 'none' : 'flex' }}>
                    <PetSpeciesIcon species={pet.species} className="text-7xl" />
                </div>
                <div className="absolute top-3 right-3">
                    <StatusBadge status={pet.status} />
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{pet.name}</h3>
                    <span className="text-primary-400 flex-shrink-0 text-xl">
                        <PetSpeciesIcon species={pet.species} />
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    {pet.breed} · {pet.age} {pet.age === 1 ? 'year' : 'years'} old
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">{pet.description}</p>
                <div className="mt-4">
                    <button
                        className="w-full btn-primary btn-sm"
                        onClick={(e) => { e.stopPropagation(); navigate(`/pets/${pet.id}`); }}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function HomePage() {
    // Filter state
    const [search, setSearch] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');

    // Debounce search input → committed search
    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    // Reset to page 1 when any filter changes
    useEffect(() => { setPage(1); }, [search, species, breed, age]);

    // ── Cached queries ─────────────────────────────────────────────────────────
    // Filter options: cached 5 minutes, shared with any other component using this key
    const { data: filterData, isLoading: filtersLoading } = useFilterOptions();
    const speciesOptions = filterData?.speciesOptions ?? [];
    const ageOptions = filterData?.ageOptions ?? [];

    // Build the params object for the paginated list query
    const petParams = { page, limit: 9 };
    if (search) petParams.search = search;
    if (species) petParams.species = species;
    if (!search && breed) petParams.breed = breed;
    if (age !== '') petParams.age = Number(age);

    // Pet listing: each unique params combo has its own cache entry.
    // placeholderData keeps previous results visible while the next page loads.
    const {
        data: petsData,
        isLoading: petsLoading,
        isError,
    } = usePets(petParams);

    useEffect(() => {
        if (isError) toast.error('Failed to load pets. Please try again.');
    }, [isError]);

    const pets = petsData?.data ?? [];
    const pagination = petsData?.pagination ?? null;
    // ───────────────────────────────────────────────────────────────────────────

    const handleClearFilters = () => {
        setSearchInput(''); setSearch(''); setSpecies(''); setBreed(''); setAge(''); setPage(1);
    };

    const hasFilters = searchInput || species || breed || age !== '';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-10">
                <h1 className="page-title mb-3">
                    Find Your Perfect <span className="text-primary-600">Companion</span>
                </h1>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Browse our available pets and give a loving animal a forever home.
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="sm:col-span-2 lg:col-span-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Search by name or breed..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="input pl-9"
                        />
                    </div>

                    <select id="species-filter" value={species} onChange={(e) => setSpecies(e.target.value)} className="input" disabled={filtersLoading}>
                        <option value="">{filtersLoading ? 'Loading...' : 'All Species'}</option>
                        {speciesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <input
                        id="breed-filter"
                        type="text"
                        placeholder="Filter by breed..."
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        disabled={!!search}
                        className="input disabled:bg-gray-50 disabled:text-gray-400"
                        title={search ? 'Breed filter is disabled when search is active' : ''}
                    />

                    <select id="age-filter" value={age} onChange={(e) => setAge(e.target.value)} className="input" disabled={filtersLoading}>
                        <option value="">{filtersLoading ? 'Loading...' : 'Any Age'}</option>
                        {ageOptions.map((a) => <option key={a} value={String(a)}>{a} {a === 1 ? 'year' : 'years'}</option>)}
                    </select>
                </div>

                {hasFilters && (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-500">Active filters:</span>
                        {search && <span className="badge bg-primary-100 text-primary-700">Search: {search}</span>}
                        {species && <span className="badge bg-blue-100 text-blue-700">{species}</span>}
                        {breed && <span className="badge bg-purple-100 text-purple-700">Breed: {breed}</span>}
                        {age !== '' && <span className="badge bg-orange-100 text-orange-700">Age: {age}yr</span>}
                        <button onClick={handleClearFilters} className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 ml-2 transition-colors">
                            <FaTimes className="text-xs" /> Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results */}
            {petsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <PetCardSkeleton key={i} />)}
                </div>
            ) : pets.length === 0 ? (
                <div className="text-center py-20">
                    <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No pets found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search filters or clear them to see all available pets.</p>
                    {hasFilters && <button onClick={handleClearFilters} className="btn-primary">Clear Filters</button>}
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-gray-600">
                            Found <span className="font-semibold text-gray-900">{pagination?.totalItems}</span> pet{pagination?.totalItems !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
                    </div>
                    <Pagination pagination={pagination} onPageChange={setPage} />
                </>
            )}
        </div>
    );
}
