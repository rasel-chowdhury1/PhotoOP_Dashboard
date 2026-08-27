// redux/features/serviceCharge/serviceChargeApi.ts
import { baseApi } from "@/redux/api/baseApi"; // adjust to your actual baseApi import


const serviceChargeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServiceCharges: builder.query({
      query: (params) => ({
        url: "/service-charge",
        method: "GET",
        params,
      }),
      providesTags: ["ServiceCharge"],
    }),

    createServiceCharge: builder.mutation({
      query: ({ body }) => ({
        url: "/service-charge",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ServiceCharge"],
    }),

    updateServiceCharge: builder.mutation({
      query: ({ params, body }) => ({
        url: `/service-charge/${params.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["ServiceCharge"],
    }),

    deleteServiceCharge: builder.mutation({
      query: ({ params }) => ({
        url: `/service-charge/${params.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceCharge"],
    }),
  }),
});

export const {
  useGetServiceChargesQuery,
  useCreateServiceChargeMutation,
  useUpdateServiceChargeMutation,
  useDeleteServiceChargeMutation,
} = serviceChargeApi;