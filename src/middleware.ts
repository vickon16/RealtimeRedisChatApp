import { getToken } from "next-auth/jwt";
import {withAuth} from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    // get the current pathname
    const pathname = req.nextUrl.pathname

    // manage the route protection
    // check if the user is authenticated
    const isAuth = await getToken({req})

    // check if user is trying to navigate to the login page
    const isLoginPage = pathname.startsWith("/login");

    const sensitiveRoutes = ["/dashboard"];
    const isAccessingSensitiveRoutes = sensitiveRoutes.some(route => pathname.startsWith(route));

    // if user is trying to access the login page
    if (isLoginPage) {
      // and the user is logged in
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
        // req.url is a base url e.g localhost:3000
      } 

      return NextResponse.next();
    }


    // if user is not authenticated and trying to access a sensitive route
    if (!isAuth && isAccessingSensitiveRoutes) {
      return NextResponse.redirect(new URL("/login", req.url))
      // req.url is a base url e.g localhost:3000
    }


    // if pathname is homepage
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
      // req.url is a base url e.g localhost:3000
    }
  }, {
    callbacks : {
      async authorized() {
        return true
      }
    }
  }
)

export const config = {
  matcher : ["/", "/login", "/dashboard/:path*"]
}