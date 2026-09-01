import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  }
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/campaigns/:path*",
    "/analytics/:path*",
    "/kols/:path*",
    "/settings/:path*"
  ]
};
