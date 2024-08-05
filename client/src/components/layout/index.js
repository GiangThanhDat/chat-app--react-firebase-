import { useAuth } from "context/auth-provider"
import { Navigate, Outlet } from "react-router-dom"
import NavBar from "./navbar"
import Sidebar from "./sidebar"

const Layout = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={"/auth/sign-in"} />
  }

  return (
    <main className="flex gap-x-3 h-full ">
      <Sidebar />
      <div className="flex-1 h-full">
        <NavBar />
        <div id="app-content" className="p-2">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

export default Layout
