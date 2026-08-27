import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPayments: builder.query<
            IPaymentsResponse,
            { page: number; limit: number; searchTerm?: string }
        >({
            query: ({ page, limit, searchTerm }) => ({
                url: `analytics/earnings/lifetime`,
                method: "GET",
                params: {
                    page,
                    limit,
                    ...(searchTerm ? { searchTerm } : {}),
                },
            }),
            providesTags: [tagTypes.payment],
        }),
    }),
});

export const { useGetPaymentsQuery } = paymentApi;
