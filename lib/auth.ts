import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { Role } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email } = parsedCredentials.data;
          
          // In a real production app, we would verify the password hash here
          // For now, we find the user by email as defined in the Prisma schema
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) return null;
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            brandId: user.brandId,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.brandId = user.brandId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as Role;
        session.user.brandId = token.brandId as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
