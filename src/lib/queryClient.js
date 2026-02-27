import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is considered fresh for 30 seconds by default.
            // Individual hooks can override this.
            staleTime: 30 * 1000,
            // Keep unused (unmounted) query data in cache for 5 minutes
            // so back-navigation is instant.
            gcTime: 5 * 60 * 1000,
            // Don't hammer the server on transient errors
            retry: 1,
            // Refetch when the user returns to the tab
            refetchOnWindowFocus: true,
        },
        mutations: {
            retry: 0,
        },
    },
});

export default queryClient;
