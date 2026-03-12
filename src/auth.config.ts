import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize() {
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
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
} satisfies NextAuthConfig;