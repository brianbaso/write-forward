import NextAuth from "next-auth";

import { authConfig } from "@/app/(auth)/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    '/',
    '/chat',
    '/new',
    '/entry/:path*',
    '/:id',
    '/api/:path*',
    '/login',
    '/register'
  ]
};
