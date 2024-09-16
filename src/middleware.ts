import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/payment/")) {
    const orderId = pathname.split("/").pop();

    if (!orderId) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }

    try {
      const response = await fetch(
        `http://localhost:8001/v1/transaction/link/${orderId}`
      );

      if (!response.ok) {
        return NextResponse.rewrite(new URL("/not-found", request.url));
      }
    } catch (error) {
      console.error("Error checking order:", error);
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
