import { useQueryClient } from "@tanstack/react-query"
import { useToast } from "components/ui/use-toast"
import { useMutate } from "hooks/use-mutate"
import { LOCAL_STORE_KEYS, MUTATE_KEYS, TOKEN_KEY } from "lib/const"
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "lib/localStorage"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useNavigate } from "react-router-dom"
import { postRequest } from "services/utils"

export const AuthContext = createContext({})

/**
 * Authentication provider component that manages user authentication and permissions.
 */
export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient()

  const { toast } = useToast()

  const navigate = useNavigate()
  const [user, setUser] = useState()
  // const [permissionHash, setPermissionHash] = useState()

  const token = getLocalStorage(TOKEN_KEY)

  const isAuthenticated = Boolean(token)

  const signInMutation = useMutate({
    mutationKey: MUTATE_KEYS.LOGIN,
    mutationFn: async ({ userName, password }) => {
      return await postRequest("/auth/login", { userName, password })
    },
  })

  const clearAuth = useCallback(() => {
    setUser(undefined)
    // removeCookie(TOKEN_KEY)
    removeLocalStorage(TOKEN_KEY)
    // removeLocalStorage(LOCAL_STORE_KEYS.ROLES)
    removeLocalStorage(LOCAL_STORE_KEYS.USER)
    queryClient.removeQueries()
  }, [queryClient])

  /**
   * Sign in function to authenticate the user.
   * @param params - The sign-in credentials.
   */
  const signIn = (params) => {
    signInMutation.mutate(params, {
      onSuccess: (data) => {
        const user = {
          name: data.name,
          email: data.email,
          userId: data.userId,
        }

        // const permissions = parseRoles(data.role)
        // const permissionHash = hash(permissions, "permissionId")

        // if (permissionHash) {
        //   setPermissionHash(permissionHash)
        // }

        setUser(user)

        setLocalStorage(LOCAL_STORE_KEYS.USER, user)
        setLocalStorage(LOCAL_STORE_KEYS.ROLES, data.role)
        setLocalStorage(TOKEN_KEY, data.token)

        // setCookie(TOKEN_KEY, data.token, 30)

        // notification.success(t('signInSuccess'));
        // window.location.href = '/';

        toast({ title: "Login successfully" })

        navigate("/employees")
      },
      onError: (errors) => {
        const { fieldName } = errors
        if (fieldName === "password") {
          // notification.error(t('incorrectPassword'));
        } else if (fieldName === "code") {
          // notification.error(t('userNotExist'));
        }
      },
    })
  }

  /**
   * Sign out function to log the user out.
   */
  const signOut = () => {
    clearAuth()
    // window.location.href = '/sign-in';
    navigate("/auth/sign-in")
  }

  useEffect(() => {
    if (!token) clearAuth()
  }, [clearAuth, token])

  useEffect(() => {
    const localUser = getLocalStorage(LOCAL_STORE_KEYS.USER)
    // const localRoles = getLocalStorage(LOCAL_STORE_KEYS.ROLES);

    if (token && localUser) {
      setUser(localUser)
    }

    // if (localRoles) {
    //   const permissions = parseRoles(localRoles);
    //   const permissionHash = hash(permissions, 'permissionId');

    //   if (permissionHash) {
    //     setPermissionHash(permissionHash);
    //   }
    // }
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signIn,
        signOut,
        // permissionHash,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook for accessing authentication context values.
 * @returns Authentication context containing user information and authentication state.
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
