import { Button } from "components/ui/button"
import { useAuth } from "context/auth-provider"
import React from "react"

const NavBar = () => {
  const { signOut } = useAuth()
  return (
    <div className="hidden sm:sticky p-2  h-14 sm:flex justify-end items-center">
      <Button onClick={signOut}>Log out</Button>
    </div>
  )
}

export default NavBar
