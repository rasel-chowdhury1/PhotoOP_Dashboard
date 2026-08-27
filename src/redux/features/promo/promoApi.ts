import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const promoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPromos: builder.query<IPromoListResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/promo`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: [tagTypes.promo],
    }),
    createPromo: builder.mutation({
      query: (req) => ({
        url: `/promo/create`,
        method: "POST",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.promo],
    }),
    updatePromo: builder.mutation({
      query: (req) => ({
        url: `/promo/update/${req.params.id}`,
        method: "PATCH",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.promo],
    }),
    deletePromo: builder.mutation({
      query: (req) => ({
        url: `/promo/${req.params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.promo],
    }),
  }),
});

export const {
  useGetPromosQuery,
  useCreatePromoMutation,
  useUpdatePromoMutation,
  useDeletePromoMutation,
} = promoApi;
