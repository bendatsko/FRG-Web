import { api } from "..";

const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({
                url: "http://localhost:3001/users",
                method: "GET",
            }),
            providesTags: ["User"],
        }),
        getUser: builder.query({
            query: (id) => ({
                url: `http://localhost:3001/users/${id}`,
                method: "GET",
            }),
            providesTags: ["User"],
        }),
        addUser: builder.mutation({
            query: (newUser) => ({
                url: 'http://localhost:3001/register',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: ["User"],
        }),
        updateUser: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `http://localhost:3001/users/${id}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `http://localhost:3001/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["User"],
        }),
        resetPassword: builder.mutation({
            query: ({ userId, newPassword }) => ({
                url: 'http://localhost:3001/reset-password',
                method: 'POST',
                body: { userId, newPassword },
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useResetPasswordMutation,
} = userApi;