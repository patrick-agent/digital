export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnLogin = nextUrl.pathname === "/admin/login"

      if (isOnLogin) {
        return true
      }

      if (isOnAdmin && !isLoggedIn) {
        return false
      }

      return true
    },
  },
  providers: [],
}
