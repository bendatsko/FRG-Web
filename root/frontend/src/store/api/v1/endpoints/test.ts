import { api } from "..";

const testApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTests: builder.query({
      query: (userId) => ({
        url: `http://localhost:3001/tests?username=${userId}`,
        method: "GET",
      }),
      providesTags: ["Test"],
    }),
  }),
});

export const { useGetTestsQuery } = testApi;