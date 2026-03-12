import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import * as argon2 from "argon2";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            roles: {
              where: { isActive: true },
              include: { role: true },
            },
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const validPassword = await argon2.verify(user.passwordHash, password);

        if (!validPassword) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          roles: user.roles.map((r) => r.role.code),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = (user as { roles?: string[] }).roles ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.roles = (token.roles as string[]) ?? [];
      }
      return session;
    },
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      const isLoggedIn = !!auth?.user;
      const roles = auth?.user?.roles ?? [];

      const isAdmin = roles.includes("SUPER_ADMIN");
      const isStudent = roles.includes("STUDENT");
      const isStaff = roles.some((role) =>
        ["DEAN", "HOD", "COURSE_ADVISER", "LECTURER"].includes(role),
      );

      if (pathname.startsWith("/admin")) return isLoggedIn && isAdmin;
      if (pathname.startsWith("/student")) return isLoggedIn && isStudent;
      if (pathname.startsWith("/staff")) return isLoggedIn && isStaff;

      return true;
    },
  },
});