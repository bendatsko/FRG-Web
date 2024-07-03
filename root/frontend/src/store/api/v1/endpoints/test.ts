import { api } from "..";

const testApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTests: builder.query({
      query: () => ({
        url: "http://localhost:3001/tests",
        method: "GET",
      }),
      providesTags: ["Test"],
    }),
  }),
});

export const { useGetTestsQuery } = testApi;
