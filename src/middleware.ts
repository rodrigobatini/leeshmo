import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/dashboard(.*)",
  "/insights(.*)",
  "/library(.*)",
  "/calendar(.*)",
  "/personas(.*)",
  "/estrategias(.*)",
  "/nova-estrategia(.*)",
  "/automacao(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
