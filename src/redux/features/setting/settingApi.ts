import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSetting: builder.query({
      query: (path) => ({
        url: `/settings/${path}`,
        method: "GET",
      }),
      providesTags: [tagTypes.setting],
    }),
    updateSetting: builder.mutation({
      query: (data) => {
        return {
          url: `/settings`,
          method: "PUT",
          body: data, // Passing the body from the request
        };
      },
      invalidatesTags: [tagTypes.setting],
    }),
  }),
});

export const { useGetSettingQuery, useUpdateSettingMutation } = settingApi;
