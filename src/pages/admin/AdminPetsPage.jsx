import { useState, useEffect } from 'react';
import { PageLoader } from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import Pagination from '../../components/Pagination';
import PetSpeciesIcon from '../../components/PetSpeciesIcon';
import { usePets } from '../../hooks/useQueries';
import { useCreatePet, useUpdatePet, useDeletePet } from '../../hooks/useMutations';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrashAlt, FaTimes, FaSpinner, FaSearch, FaImage } from 'react-icons/fa';

const EMPTY_FORM = { name: '', species: '', breed: '', age: '', description: '', photoUrl: '', status: 'AVAILABLE' };

function PetFormModal({ pet, onClose }) {
    const isEdit = !!pet;
    const [form, setForm] = useState(
        isEdit
            ? { name: pet.name, species: pet.species, breed: pet.breed, age: String(pet.age), description: pet.description, photoUrl: pet.photoUrl || '', status: pet.status }
            : { ...EMPTY_FORM }
    );
    const [errors, setErrors] = useState({});

    const createMutation = useCreatePet();
    const updateMutation = useUpdatePet();
    const saving = createMutation.isPending || updateMutation.isPending;

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const payload = { ...form, age: parseInt(form.age, 10), photoUrl: form.photoUrl || null };
        if (!isEdit) delete payload.status;

        const mutation = isEdit ? updateMutation : createMutation;
        const args = isEdit ? { id: pet.id, data: payload } : payload;

        mutation.mutate(args, {
            onSuccess: () => {
                toast.success(isEdit ? 'Pet updated successfully!' : 'Pet created successfully!');
                onClose();
            },
            onError: (err) => {
                const data = err.response?.data;
                if (err.response?.status === 400 && data?.errors) {
                    const fieldErrors = {};
                    data.errors.forEach(({ field, message }) => { fieldErrors[field] = message; });
                    setErrors(fieldErrors);
                } else {
                    toast.error(data?.message || 'Failed to save pet.');
                }
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto fade-in">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">{isEdit ? `Edit ${pet.name}` : 'Add New Pet'}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"><FaTimes /></button>
                </div>

                <form id="pet-form" onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} className={`input ${errors.name ? 'border-red-400' : ''}`} placeholder="Buddy" required />
                            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="label">Species *</label>
                            <input name="species" value={form.species} onChange={handleChange} className={`input ${errors.species ? 'border-red-400' : ''}`} placeholder="Dog" required />
                            {errors.species && <p className="mt-1 text-xs text-red-600">{errors.species}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Breed *</label>
                            <input name="breed" value={form.breed} onChange={handleChange} className={`input ${errors.breed ? 'border-red-400' : ''}`} placeholder="Golden Retriever" required />
                            {errors.breed && <p className="mt-1 text-xs text-red-600">{errors.breed}</p>}
                        </div>
                        <div>
                            <label className="label">Age (years) *</label>
                            <input name="age" type="number" min="0" value={form.age} onChange={handleChange} className={`input ${errors.age ? 'border-red-400' : ''}`} placeholder="3" required />
                            {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
                        </div>
                    </div>

                    {isEdit && (
                        <div>
                            <label className="label">Status</label>
                            <select name="status" value={form.status} onChange={handleChange} className="input">
                                <option value="AVAILABLE">Available</option>
                                <option value="PENDING">Pending</option>
                                <option value="ADOPTED">Adopted</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="label">Photo URL</label>
                        <input name="photoUrl" type="url" value={form.photoUrl} onChange={handleChange} className={`input ${errors.photoUrl ? 'border-red-400' : ''}`} placeholder="https://example.com/pet.jpg (optional)" />
                        {errors.photoUrl && <p className="mt-1 text-xs text-red-600">{errors.photoUrl}</p>}
                        {form.photoUrl && (
                            <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                                <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                <FaImage className="text-gray-300 text-2xl hidden" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="label">Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                            className={`input resize-none ${errors.description ? 'border-red-400' : ''}`} placeholder="Tell us about this pet..." required />
                        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
                        <button type="submit" disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                            {saving ? <><FaSpinner className="animate-spin" /> Saving...</> : isEdit ? 'Save Changes' : 'Create Pet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeleteConfirmModal({ pet, onClose }) {
    const deleteMutation = useDeletePet();
    const deleting = deleteMutation.isPending;

    const handleDelete = () => {
        deleteMutation.mutate(pet.id, {
            onSuccess: () => { toast.success(`${pet.name} has been deleted.`); onClose(); },
            onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete pet.'),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 fade-in text-center">
                <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <FaTrashAlt className="text-red-500 text-xl" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Delete {pet.name}?</h2>
                <p className="text-gray-500 mb-6 text-sm">This action cannot be undone. The pet will be permanently removed.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
                    <button onClick={handleDelete} disabled={deleting} className="flex-1 btn-danger flex items-center justify-center gap-2">
                        {deleting ? <><FaSpinner className="animate-spin" /> Deleting...</> : <><FaTrashAlt /> Delete</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminPetsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [modalPet, setModalPet] = useState(undefined); // undefined=closed, null=new, Pet=edit
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        const t = setTimeout(() => setSearch(searchInput), 400);
        return () => clearTimeout(t);
    }, [searchInput]);

    useEffect(() => { setPage(1); }, [search]);

    // ── Cached query ─────────────────────────────────────────────────────────────
    const params = { page, limit: 10, ...(search ? { search } : {}) };
    const { data, isLoading } = usePets(params);
    const pets = data?.data ?? [];
    const pagination = data?.pagination ?? null;
    // ─────────────────────────────────────────────────────────────────────────────

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="page-title">Manage Pets</h1>
                    <p className="text-gray-500 mt-1">Add, edit, or remove pets from the system</p>
                </div>
                <button id="add-pet-btn" onClick={() => setModalPet(null)} className="btn-primary flex items-center gap-2">
                    <FaPlus /> Add Pet
                </button>
            </div>

            <div className="mb-4 relative max-w-sm">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input id="admin-pet-search" type="text" placeholder="Search pets..." value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)} className="input pl-9" />
            </div>

            {isLoading ? <PageLoader /> : (
                <>
                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Pet</th><th>Species</th><th>Breed</th><th>Age</th><th>Status</th><th>Added</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pets.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">
                                        No pets found. {search ? 'Try a different search.' : 'Create your first pet!'}
                                    </td></tr>
                                ) : pets.map((pet) => (
                                    <tr key={pet.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary-50 flex-shrink-0 flex items-center justify-center">
                                                    {pet.photoUrl
                                                        ? <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                                                        : <PetSpeciesIcon species={pet.species} className="text-primary-400 text-xl" />}
                                                </div>
                                                <span className="font-semibold text-gray-900">{pet.name}</span>
                                            </div>
                                        </td>
                                        <td><span className="flex items-center gap-1.5"><PetSpeciesIcon species={pet.species} className="text-primary-400" />{pet.species}</span></td>
                                        <td>{pet.breed}</td>
                                        <td>{pet.age} yr{pet.age !== 1 ? 's' : ''}</td>
                                        <td><StatusBadge status={pet.status} /></td>
                                        <td className="text-gray-400 text-xs">{new Date(pet.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="flex items-center justify-end gap-2">
                                                <button id={`edit-pet-${pet.id}`} onClick={() => setModalPet(pet)} className="btn-secondary btn-sm flex items-center gap-1.5">
                                                    <FaEdit /> Edit
                                                </button>
                                                <button id={`delete-pet-${pet.id}`} onClick={() => setDeleteTarget(pet)} className="btn-danger btn-sm flex items-center gap-1.5">
                                                    <FaTrashAlt /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination pagination={pagination} onPageChange={setPage} />
                </>
            )}

            {modalPet !== undefined && <PetFormModal pet={modalPet} onClose={() => setModalPet(undefined)} />}
            {deleteTarget && <DeleteConfirmModal pet={deleteTarget} onClose={() => setDeleteTarget(null)} />}
        </div>
    );
}
