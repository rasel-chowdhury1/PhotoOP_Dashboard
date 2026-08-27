import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<
      IReportListResponse,
      { page: number; limit: number; searchTerm?: string; status?: string }
    >({
      query: ({ page, limit, searchTerm, status }) => ({
        url: `/report`,
        method: "GET",
        params: { page, limit, searchTerm, status },
      }),
      providesTags: [tagTypes.report],
    }),
    resolveReport: builder.mutation({
      query: (req) => ({
        url: `/report/status/${req.params.id}`,
        method: "PATCH",
        body: req.body,
      }),
      invalidatesTags: [tagTypes.report],
    }),
  }),
});

export const { useGetReportsQuery, useResolveReportMutation } = reportApi;
