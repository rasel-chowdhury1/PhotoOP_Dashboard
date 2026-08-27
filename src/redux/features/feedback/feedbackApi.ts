import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const feedbackApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeedbacks: builder.query<IFeedbackResponse, { page: number; limit: number }>({
      query: ({ page, limit }) => ({
        url: `/feedback/admin`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: [tagTypes.feedback],
    }),
  }),
});

export const { useGetFeedbacksQuery } = feedbackApi;
