import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import type { Adapter } from "next-auth/adapters";
import sql from "./db";

const adapter: Adapter = {
  async createUser(user) {
    const rows = await sql`
      INSERT INTO users (email) VALUES (${user.email})
      ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
      RETURNING id, email, created_at
    `;
    const u = rows[0];
    return { id: u.id, email: u.email, emailVerified: null };
  },
  async getUser(id) {
    const rows = await sql`SELECT id, email FROM users WHERE id = ${id} LIMIT 1`;
    if (!rows[0]) return null;
    return { id: rows[0].id, email: rows[0].email, emailVerified: null };
  },
  async getUserByEmail(email) {
    const rows = await sql`SELECT id, email FROM users WHERE email = ${email} LIMIT 1`;
    if (!rows[0]) return null;
    return { id: rows[0].id, email: rows[0].email, emailVerified: null };
  },
  async getUserByAccount({ providerAccountId }) {
    const rows = await sql`SELECT id, email FROM users WHERE email = ${providerAccountId} LIMIT 1`;
    if (!rows[0]) return null;
    return { id: rows[0].id, email: rows[0].email, emailVerified: null };
  },
  async updateUser(user) {
    return { id: user.id!, email: user.email!, emailVerified: null };
  },
  async linkAccount() { return; },
  async createSession(session) { return session as never; },
  async getSessionAndUser() { return null; },
  async updateSession(session) { return session as never; },
  async deleteSession() { return; },
  async createVerificationToken(token) {
    await sql`
      INSERT INTO verification_tokens (identifier, token, expires)
      VALUES (${token.identifier}, ${token.token}, ${token.expires})
    `;
    return token;
  },
  async useVerificationToken({ identifier, token }) {
    const rows = await sql`
      DELETE FROM verification_tokens
      WHERE identifier = ${identifier} AND token = ${token}
      RETURNING *
    `;
    if (!rows[0]) return null;
    return { identifier: rows[0].identifier, token: rows[0].token, expires: new Date(rows[0].expires) };
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "AISeen <noreply@aiseen.io>",
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/verify",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId as string;
      return session;
    },
  },
});
