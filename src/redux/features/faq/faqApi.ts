import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqsByRole: builder.query<
      IApiListResponse<IFaq>,
      { role: FaqRole; page: number; limit: number; searchTerm?: string; sort?: string }
    >({
      query: ({ role, page, limit, searchTerm, sort }) => ({
        url: `/faq/admin/role/${role}`,
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
          ...(sort ? { sort } : {}),
        },
      }),
      providesTags: [tagTypes.faq],
    }),
    createFaq: builder.mutation<
      IApiSingleResponse<IFaq>,
      { body: ICreateFaqPayload }
    >({
      query: ({ body }) => ({
        url: "/faq/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.faq],
    }),
    updateFaq: builder.mutation<
      IApiSingleResponse<IFaq>,
      { params: { id: string }; body: Partial<ICreateFaqPayload> }
    >({
      query: ({ params, body }) => ({
        url: `/faq/${params.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [tagTypes.faq],
    }),
    deleteFaq: builder.mutation<
      IApiSingleResponse<null>,
      { params: { id: string } }
    >({
      query: ({ params }) => ({
        url: `/faq/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.faq],
    }),
  }),
});

export const {
  useGetFaqsByRoleQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;
