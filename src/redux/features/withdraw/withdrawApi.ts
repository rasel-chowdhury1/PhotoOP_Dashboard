import { baseApi } from "@/redux/api/baseApi";

const withdrawApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ── Snapper ──────────────────────────────────────────────────────────

        createWithdrawRequest: builder.mutation({
            query: (body) => ({
                url: "/withdrawals",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Withdraw"],
        }),

        getMyWithdrawRequests: builder.query({
            query: (params) => ({
                url: "/withdrawals/my-requests",
                method: "GET",
                params,
            }),
            providesTags: ["Withdraw"],
        }),

        cancelWithdrawRequest: builder.mutation({
            query: ({ id }) => ({
                url: `/withdrawals/${id}/cancel`,
                method: "PATCH",
            }),
            invalidatesTags: ["Withdraw"],
        }),

        // ── Admin ─────────────────────────────────────────────────────────────

        getAllWithdrawRequests: builder.query({
            query: (params) => ({
                url: "/withdrawals/all",
                method: "GET",
                params,
            }),
            providesTags: ["Withdraw"],
        }),

        getWithdrawRequestById: builder.query({
            query: (id) => ({
                url: `/withdrawals/${id}`,
                method: "GET",
            }),
            providesTags: ["Withdraw"],
        }),

        processWithdrawRequest: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/withdrawals/${id}/process`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Withdraw"],
        }),

        rejectWithdrawRequest: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/withdrawals/${id}/reject`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Withdraw"],
        }),
    }),
});

export const {
    useCreateWithdrawRequestMutation,
    useGetMyWithdrawRequestsQuery,
    useCancelWithdrawRequestMutation,
    useGetAllWithdrawRequestsQuery,
    useGetWithdrawRequestByIdQuery,
    useProcessWithdrawRequestMutation,
    useRejectWithdrawRequestMutation,
} = withdrawApi;