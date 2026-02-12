import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.next({ request });
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const path = request.nextUrl.pathname;
    const isLogin = path === "/login" || path.startsWith("/login");
    const isSignup = path === "/signup" || path.startsWith("/signup");
    const isDashboard = path.startsWith("/dashboard") || path === "/";

    if (isDashboard && !isLogin && !isSignup) {
      if (!session) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }

    if ((isLogin && path === "/login") || (isSignup && path === "/signup")) {
      if (session) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next({ request });
  } catch {
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/signup"],
};
