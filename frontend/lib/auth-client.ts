import { createAuthClient } from "better-auth/react";
import { oneTapClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;