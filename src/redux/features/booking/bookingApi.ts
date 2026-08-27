import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAdminBookings: builder.query<
            IApiListResponse<IBooking>,
            { page: number; limit: number; searchTerm?: string; status?: string }
        >({
            query: ({ page, limit, searchTerm, status }) => ({
                url: `/bookings/all`,
                method: "GET",
                params: {
                    page,
                    limit,
                    ...(searchTerm ? { searchTerm } : {}),
                    ...(status && status !== "All" ? { status } : {}),
                },
            }),
            providesTags: [tagTypes.booking],
        }),
    }),
});

export const { useGetAdminBookingsQuery } = bookingApi;
