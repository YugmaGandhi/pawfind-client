import { useQuery } from '@tanstack/react-query';
import {
    getPets,
    getPet,
    getMyApplications,
    getAllApplications,
} from '../api/services';

// ─── Query Keys ────────────────────────────────────────────────────────────────
// Centralised key factory keeps invalidation consistent across hooks + mutations.
export const queryKeys = {
    filterOptions: ['filter-options'],
    pets: (params) => ['pets', params],
    pet: (id) => ['pet', id],
    myApplications: ['my-applications'],
    allApplications: (params) => ['applications', params],
};

// ─── Filter Options ─────────────────────────────────────────────────────────────
/**
 * Fetches all pets (limit=100) once and derives unique species + age arrays.
 * Cached for 5 minutes — species/ages are admin-managed and rarely change.
 */
export function useFilterOptions() {
    return useQuery({
        queryKey: queryKeys.filterOptions,
        queryFn: async () => {
            const res = await getPets({ limit: 100 });
            const allPets = res.data.data;

            const speciesOptions = [...new Set(allPets.map((p) => p.species))]
                .filter(Boolean)
                .sort();

            const ageOptions = [...new Set(allPets.map((p) => p.age))]
                .filter((a) => a !== null && a !== undefined)
                .sort((a, b) => a - b);

            return { speciesOptions, ageOptions };
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// ─── Pet Listing ────────────────────────────────────────────────────────────────
/**
 * Paginated, filterable pet list.
 * Each unique combination of params gets its own cache entry.
 */
export function usePets(params) {
    return useQuery({
        queryKey: queryKeys.pets(params),
        queryFn: () => getPets(params).then((res) => res.data),
        // Keep previous page data visible while the next page loads (no flicker)
        placeholderData: (prev) => prev,
    });
}

// ─── Single Pet ─────────────────────────────────────────────────────────────────
/**
 * Detail view for a single pet by ID.
 */
export function usePet(id) {
    return useQuery({
        queryKey: queryKeys.pet(id),
        queryFn: () => getPet(id).then((res) => res.data.data),
        enabled: !!id,
    });
}

// ─── My Applications ────────────────────────────────────────────────────────────
/**
 * Logged-in user's own adoption applications.
 */
export function useMyApplications() {
    return useQuery({
        queryKey: queryKeys.myApplications,
        queryFn: () => getMyApplications().then((res) => res.data.data),
    });
}

// ─── All Applications (Admin) ───────────────────────────────────────────────────
/**
 * Full applications list for admin review. Slightly shorter stale time
 * so admins see reasonably fresh data.
 */
export function useAllApplications(params) {
    return useQuery({
        queryKey: queryKeys.allApplications(params),
        queryFn: () => getAllApplications(params).then((res) => res.data),
        staleTime: 20 * 1000, // 20 seconds
        placeholderData: (prev) => prev,
    });
}
