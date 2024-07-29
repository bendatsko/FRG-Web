import {api} from "../index.ts";
import {SignInType} from "@/types";

const authEndPoint = api.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (body: SignInType) => ({
                url: "http://10.1.10.248:3001/login",
                method: "POST",
                body,
            }),
        }),
        fetchUserByUUID: builder.query({
            query: (uuid: string) => ({
                url: `http://10.1.10.248:3001/user/uuid/${uuid}`,
                method: "GET",
            }),
        }),
    }),
    overrideExisting: false,
});

export const {useSignInMutation, useFetchUserByUUIDQuery} = authEndPoint;
