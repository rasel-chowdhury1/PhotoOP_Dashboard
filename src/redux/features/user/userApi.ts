import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<
      IApiListResponse<IUser>,
      { page: number; limit: number; searchTerm?: string; status?: string }
    >({
      query: ({ page, limit, searchTerm, status }) => ({
        url: `/users/all-customers`,
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
      providesTags: [tagTypes.customer],
    }),

    banUser: builder.mutation<void, { userId: string; reason: string }>({
      query: ({ userId, reason }) => ({
        url: `/users/ban/${userId}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: [tagTypes.customer, tagTypes.user, tagTypes.snapper],
    }),

    unbanUser: builder.mutation<void, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/unban/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.customer, tagTypes.user, tagTypes.snapper],
    }),

    warnUser: builder.mutation<void, { userId: string; reason: string }>({
      query: ({ userId, reason }) => ({
        url: `/users/warn/${userId}`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: [tagTypes.customer, tagTypes.user, tagTypes.snapper],
    }),
  }),
});


export const {
  useGetCustomersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  useWarnUserMutation,
} = userApi;
