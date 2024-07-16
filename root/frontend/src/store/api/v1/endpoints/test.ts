import {api} from "..";

const testApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTests: builder.query({
            query: (userId) => ({
                url: `http://localhost:3001/tests?username=${userId}`,
                method: "GET",
            }),
            providesTags: ["Test"],
        }),
        getTestById: builder.query({
            query: (id) => ({
                url: `http://localhost:3001/tests/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{type: "Test", id}],
        }),
        updateThreshold: builder.mutation({
            query: ({id, threshold}) => ({
                url: `http://localhost:3001/tests/${id}/threshold`,
                method: "PUT",
                body: {threshold},
            }),
            invalidatesTags: (result, error, {id}) => [{type: "Test", id}],
        }),
        rerunTest: builder.mutation({
            query: (id) => ({
                url: `http://localhost:3001/tests/${id}/rerun`,
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [{type: "Test", id}],
        }),
        downloadResults: builder.query({
            query: (id) => ({
                url: `http://localhost:3001/tests/${id}/download`,
                method: "GET",
                responseHandler: (response) => response.blob(),
            }),
        }),
        deleteTest: builder.mutation({
            query: (id) => ({
                url: `http://localhost:3001/tests/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Test"],
        }),
    }),
});

export const {
    useGetTestsQuery,
    useGetTestByIdQuery,
    useUpdateThresholdMutation,
    useRerunTestMutation,
    useLazyDownloadResultsQuery,
    useDeleteTestMutation
} = testApi;