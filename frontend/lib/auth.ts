import { betterAuth } from "better-auth";
import { oneTap } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // Plugins
  plugins: [oneTap()],
  // Database
  database: new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT as number | undefined,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    // Bancos gerenciados externos (ex.: Neon) exigem SSL; localmente não é necessário.
    ssl:
      process.env.POSTGRES_HOST && process.env.POSTGRES_HOST !== "localhost"
        ? { rejectUnauthorized: false }
        : undefined,
  }),
  user: {
    modelName: "users",
    additionalFields: {
      // A coluna `admin` é NOT NULL sem default no banco (o default=False do Django
      // existe só em Python) e o better-auth insere direto via SQL. `input: false`
      // impede que o cliente se cadastre já como administrador.
      // O default é uma função porque o better-auth ignora `defaultValue: false`
      // (falsy) e deixaria o campo de fora do INSERT.
      admin: {
        type: "boolean",
        required: false,
        defaultValue: () => false,
        input: false,
      },
    },
    fields: {
      name: "name",
      email: "email",
      emailVerified: "email_verified",
      image: "image",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  session: {
    modelName: "sessions",
    fields: {
      userId: "user_id",
      expiresAt: "expires_at",
      ipAddress: "ip_address",
      userAgent: "user_agent",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  account: {
    modelName: "accounts",
    fields: {
      userId: "user_id",
      accountId: "account_id",
      providerId: "provider_id",
      accessToken: "access_token",
      refreshToken: "refresh_token",
      accessTokenExpiresAt: "access_token_expires_at",
      refreshTokenExpiresAt: "refresh_token_expires_at",
      idToken: "id_token",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
  verification: {
    modelName: "verifications",
    fields: {
      expiresAt: "expires_at",
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
});