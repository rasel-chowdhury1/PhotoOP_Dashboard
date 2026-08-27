import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const fareApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFares: builder.query<
      IFareListResponse,
      { page: number; limit: number; searchTerm?: string; status?: string }
    >({
      query: ({ page, limit, searchTerm, status }) => ({
        url: "/fare",
        method: "GET",
        params: { page, limit, searchTerm, status },
      }),
      providesTags: [tagTypes.fare],
    }),
    createFare: builder.mutation({
      query: (req) => ({
        url: "/fare/create",
        method: "POST",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.fare],
    }),
    updateFare: builder.mutation({
      query: (req) => ({
        url: `/fare/update/${req.params.id}`,
        method: "PATCH",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.fare],
    }),
    deleteFare: builder.mutation({
      query: (req) => ({
        url: `/fare/delete/${req.params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.fare],
    }),
  }),
});

export const {
  useGetFaresQuery,
  useCreateFareMutation,
  useUpdateFareMutation,
  useDeleteFareMutation,
} = fareApi;
