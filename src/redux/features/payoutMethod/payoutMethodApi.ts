import { baseApi } from "@/redux/api/baseApi";

const payoutMethodApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ── Snapper ──────────────────────────────────────────────────────────

        getAllPayoutMethods: builder.query({
            query: (params?) => ({
                url: "/payout-methods/all",
                method: "GET",
                params,
            }),
            providesTags: ["PayoutMethod"],
        }),

        createPayoutMethod: builder.mutation({
            query: (body) => ({
                url: "/payout-methods",
                method: "POST",
                body,
            }),
            invalidatesTags: ["PayoutMethod"],
        }),

        updatePayoutMethod: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/payout-methods/${id}`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["PayoutMethod"],
        }),

        deletePayoutMethod: builder.mutation({
            query: ({ id }) => ({
                url: `/payout-methods/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["PayoutMethod"],
        }),

        setDefaultPayoutMethod: builder.mutation({
            query: ({ id }) => ({
                url: `/payout-methods/${id}/default`,
                method: "PATCH",
            }),
            invalidatesTags: ["PayoutMethod"],
        }),

        // ── Admin ─────────────────────────────────────────────────────────────

        verifyPayoutMethod: builder.mutation({
            query: ({ id }) => ({
                url: `/payout-methods/${id}/verify`,
                method: "PATCH",
            }),
            invalidatesTags: ["PayoutMethod"],
        }),
    }),
});

export const {
    useGetAllPayoutMethodsQuery,
    useCreatePayoutMethodMutation,
    useUpdatePayoutMethodMutation,
    useDeletePayoutMethodMutation,
    useSetDefaultPayoutMethodMutation,
    useVerifyPayoutMethodMutation,
} = payoutMethodApi;