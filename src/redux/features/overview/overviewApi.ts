import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStatistics: builder.query<IStatisticsResponse, void>({
      query: () => ({
        url: "/analytics/admin-overview",
        method: "GET",
      }),
      providesTags: [tagTypes.overview],
    }),
    getMonthlyUsers: builder.query<
      IMonthlyUsersResponse,
      { role: string; year: number }
    >({
      query: ({ role, year }) => ({
        url: "/analytics/users/monthly",
        method: "GET",
        params: { role, year },
      }),
      providesTags: [tagTypes.overview],
    }),
    getYearlyEarnings: builder.query<IYearlyEarningsResponse, { year: number }>(
      {
        query: ({ year }) => ({
          url: "/analytics/earnings/yearly",
          method: "GET",
          params: { year },
        }),
        providesTags: [tagTypes.overview],
      }
    ),
    getYearlyBookings: builder.query<IYearlyBookingsResponse, { year: number }>(
      {
        query: ({ year }) => ({
          url: "/analytics/bookings/yearly",
          method: "GET",
          params: { year },
        }),
        providesTags: [tagTypes.overview],
      }
    ),
  }),
});

export const {
  useGetStatisticsQuery,
  useGetMonthlyUsersQuery,
  useGetYearlyEarningsQuery,
  useGetYearlyBookingsQuery,
} = overviewApi;
