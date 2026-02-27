import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    createPet,
    updatePet,
    deletePet,
    submitApplication,
    updateApplicationStatus,
} from '../api/services';
import { queryKeys } from './useQueries';

// ─── Pet Mutations ──────────────────────────────────────────────────────────────

export function useCreatePet() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => createPet(data),
        onSuccess: () => {
            // Invalidate all pet lists and filter options (new species/age may appear)
            qc.invalidateQueries({ queryKey: ['pets'] });
            qc.invalidateQueries({ queryKey: queryKeys.filterOptions });
        },
    });
}

export function useUpdatePet() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updatePet(id, data),
        onSuccess: (_data, { id }) => {
            qc.invalidateQueries({ queryKey: ['pets'] });
            qc.invalidateQueries({ queryKey: queryKeys.pet(id) });
            qc.invalidateQueries({ queryKey: queryKeys.filterOptions });
        },
    });
}

export function useDeletePet() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id) => deletePet(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['pets'] });
            qc.invalidateQueries({ queryKey: queryKeys.filterOptions });
        },
    });
}

// ─── Application Mutations ──────────────────────────────────────────────────────

export function useSubmitApplication() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (petId) => submitApplication(petId),
        onSuccess: (_data, petId) => {
            // Pet status changes from AVAILABLE → PENDING after submission
            qc.invalidateQueries({ queryKey: queryKeys.pet(petId) });
            // Also invalidate listings so status badge updates
            qc.invalidateQueries({ queryKey: ['pets'] });
            // Update user's own application list
            qc.invalidateQueries({ queryKey: queryKeys.myApplications });
        },
    });
}

export function useUpdateApplicationStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
        onSuccess: () => {
            // Admin list needs refresh
            qc.invalidateQueries({ queryKey: ['applications'] });
            // User-facing list may also need updating
            qc.invalidateQueries({ queryKey: queryKeys.myApplications });
            // Pet status changes (ADOPTED on approve) — invalidate listings and details
            qc.invalidateQueries({ queryKey: ['pets'] });
        },
    });
}
