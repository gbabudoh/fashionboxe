import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      brandId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    brandId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    brandId?: string | null;
  }
}
