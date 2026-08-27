import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const snapperApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getApprovedSnappers: builder.query<
      IApiListResponse<ISnapper>,
      { page: number; limit: number; searchTerm?: string; status?: string }
    >({
      query: ({ page, limit, searchTerm, status }) => ({
        url: `/users/all-snappers`,
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
          ...(status && status !== "All"
            ? { status: status.toLowerCase() }
            : {}),
        },
      }),
      providesTags: [tagTypes.snapper],
    }),

    getRequestSnappers: builder.query<
      IApiListResponse<ISnapper>,
      { page: number; limit: number; searchTerm?: string }
    >({
      query: ({ page, limit, searchTerm }) => ({
        url: `/users/pending-snappers`,
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
        },
      }),
      providesTags: [tagTypes.snapper],
    }),

    approveSnapper: builder.mutation<void, {
    snapperId: string;
    status: "approved" | "rejected";
    reason: string;
  }>({
      query: ({ snapperId, status, reason }) => ({
        url: `/users/approval/${snapperId}`,
        method: "PATCH",
        body: {
          status,
          reason,
        },
      }),
      invalidatesTags: [tagTypes.snapper],
    }),

    rejectSnapper: builder.mutation<void, { snapperId: string; status: string; reason: string }>({
      query: ({ snapperId, status, reason }) => ({
        url: `/users/approval/${snapperId}`,
        method: "PATCH",
        body: { status, reason },
      }),
      invalidatesTags: [tagTypes.snapper],
    }),
  }),
});

export const {
  useGetApprovedSnappersQuery,
  useGetRequestSnappersQuery,
  useApproveSnapperMutation,
  useRejectSnapperMutation,
} = snapperApi;
