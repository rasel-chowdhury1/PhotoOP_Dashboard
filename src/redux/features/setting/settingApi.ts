import { baseApi } from "../../api/baseApi";
import { tagTypes } from "../../tagTypes";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSetting: builder.query<IApiSingleResponse<ISettingDocument>, string>({
      query: (path) => ({
        url: `/settings/${path}`,
        method: "GET",
      }),
      providesTags: [tagTypes.setting],
    }),
    updateSetting: builder.mutation<
      IApiSingleResponse<ISettingDocument>,
      { body: IUpdateSettingPayload }
    >({
      query: ({ body }) => ({
        url: `/settings`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [tagTypes.setting],
    }),
  }),
});

export const { useGetSettingQuery, useUpdateSettingMutation } = settingApi;
