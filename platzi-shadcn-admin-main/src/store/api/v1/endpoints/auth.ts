import { api } from "../index.ts";
import { SignInType } from "@/types";

const authEndPoint = api.injectEndpoints({
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (body: SignInType) => ({
        url: "http://127.0.0.1:3001/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSignInMutation } = authEndPoint;
