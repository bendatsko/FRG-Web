import { api } from "..";

const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: "https://api.escuelajs.co/api/v1/categories",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
    getCategory: builder.query({
      query: (id) => ({
        url: `https://api.escuelajs.co/api/v1/categories/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),
  }),
});

export const { useGetCategoriesQuery, useGetCategoryQuery } = categoryApi;
