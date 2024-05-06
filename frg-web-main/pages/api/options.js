import GithubProvider from "next-auth/providers/github"

export const options = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            profile(profile) {
                console.log("Profile Google", profile);
                return {
                    ...profile,
                    id: profile.sub,
                    role: userRole,
                };
            },
            clientId: process.env.GOOGLE_CLIENT_ID
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async jwt({token, user}){
            if(user) token.role = user.role;
            return token;
        },
        async session({session, token}){
            if(session?.user) session.user.role = token.role;
            return session;
        },
    },

};

export default NextAuth(authOptions)