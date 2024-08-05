import { Button } from "components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form"
import { Input } from "components/ui/input"
import { useMutate } from "hooks/use-mutate"
import { MUTATE_KEYS } from "lib/const"
import { cn } from "lib/utils"
import { MoveLeft } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { postRequest } from "services/utils"

// const FormSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
// })

const SignIn = () => {
  const [step, setStep] = useState(1)

  const navigate = useNavigate()

  const form = useForm({
    // resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      accessCode: "",
    },
  })

  const { mutate, isLoading: sentEmailLoading } = useMutate({
    invalidateKey: [],
    mutationFn: async (email) =>
      await postRequest("/employees/login-email", { email }),
    mutationKey: MUTATE_KEYS.LOGIN_EMAIL,
  })

  const { mutate: validateEmail, isLoading: sentCodeLoading } = useMutate({
    invalidateKey: [],
    mutationFn: async ({ email, accessCode }) =>
      await postRequest("/employees/validate-access-code", {
        email,
        accessCode,
      }),
    mutationKey: MUTATE_KEYS.VALIDATE_EMAIL_ACCESS_CODE,
  })

  const handleSubmitEmail = (e) => {
    e.preventDefault()
    mutate(form.getValues("email"), {
      onSuccess(response) {
        if (response.accessCode) {
          setStep(2)
        }
      },
    })
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    validateEmail(form.getValues(), {
      onSuccess(response) {
        if (!response.success) {
          return
        }

        if (response.credential) {
          navigate("/auth/login")
        } else {
          navigate(`/auth/setup-credentials/${response.id}`)
        }
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form {...form}>
        <form
          className={cn(
            "relative max-w-md w-[448px] overflow-x-hidden h-[400px]"
          )}
        >
          <div
            className={cn(
              "absolute transition-transform duration-500 bg-white p-8 rounded-lg shadow-lg w-full max-w-md top-0 left-0",
              step === 1 ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-2">
              Sign In
            </h2>
            <p className="mb-6 text-center">
              Please enter your email to sign in
            </p>

            <div className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                // type="submit"
                disabled={sentEmailLoading}
                onClick={handleSubmitEmail}
              >
                {sentEmailLoading ? "Signing in..." : "Next"}
              </Button>
            </div>

            <div className="text-muted-foreground mt-6">
              Passwordless authentication methods
            </div>
            <div className="text-muted-foreground mt-6">
              <a href="/auth/login" className="text-blue-400">
                Login with credentials
              </a>
            </div>
          </div>
          <div
            className={cn(
              "absolute transition-transform duration-500 bg-white p-8 rounded-lg shadow-lg w-full max-w-md top-0 left-0",
              step === 2 ? "translate-x-0" : "translate-x-full"
            )}
          >
            <Button
              className="absolute top-2 left-2"
              variant="ghost"
              type="button"
              onClick={() => setStep(1)}
            >
              <MoveLeft />
            </Button>
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-2">
              Email verification
            </h2>
            <p className="mb-6 text-center">
              Please enter your code that send to your email address
            </p>

            <div className="space-y-5">
              <FormField
                control={form.control}
                name="accessCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter your code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                // type="submit"
                disabled={sentCodeLoading}
                onClick={handleSignIn}
              >
                {sentCodeLoading ? "Signing in..." : "Submit"}
              </Button>
            </div>
            <div className="text-muted-foreground mt-6">
              Code not receive?{" "}
              <a href="/" className="">
                Send again
              </a>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SignIn
