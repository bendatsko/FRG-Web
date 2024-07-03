import {api} from "..";

const productApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: "https://api.escuelajs.co/api/v1/products",
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
        getProduct: builder.query({
            query: (id) => ({
                url: `https://api.escuelajs.co/api/v1/products/${id}`,
                method: "GET",
            }),
            providesTags: ["Product"],
        }),
    }),
});

export const {useGetProductsQuery, useGetProductQuery} = productApi;
