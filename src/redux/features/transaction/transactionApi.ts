import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const transactionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        GetTransactions: builder.query<
            IApiListResponse<ITransaction>,
            { page: number; limit: number; searchTerm?: string }
        >({
            query: ({ page, limit, searchTerm }) => ({
                url: `/payment/all`,
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

export const { useGetTransactionsQuery } = transactionApi;
