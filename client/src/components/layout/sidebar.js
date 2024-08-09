import { buttonVariants } from "components/ui/button"
import { cn } from "lib/utils"
import { Link, useLocation } from "react-router-dom"

const menus = [
  { link: "/employees", name: "Manage Employees" },
  { link: "/tasks", name: "Manage Tasks" },
  { link: "/messages", name: "Messages" },
]

const Sidebar = () => {
  const { pathname } = useLocation()

  const linkClass = (selected) =>
    cn(
      buttonVariants({ variant: "ghost" }),
      selected ? "bg-gray-200 text-primary-600" : "",
      "flex w-full items-center justify-between p-2 hover:bg-slate-100 active:bg-slate-300"
    )

  return (
    <aside className="bg-white absolute h-auto w-full bottom-0 lg:relative lg:w-[180px] overflow-y-auto p-1 sm:pt-4 px-2">
      <div className="hidden sm:block py-2 items-center justify-center">
        <p
          className={cn(
            "font-semibold text-xl ml-2 text-black font-sans hidden lg:block"
          )}
        >
          Untitled App
        </p>
      </div>
      <div className="flex lg:flex-col space-y-1">
        {menus.map((menu) => {
          return (
            <Link
              className={linkClass(pathname.includes(menu.link))}
              to={menu.link}
            >
              {menu.name}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}

export default Sidebar
