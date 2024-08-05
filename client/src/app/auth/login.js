import { Button } from "components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "components/ui/form"
import { Input } from "components/ui/input"
import { useAuth } from "context/auth-provider"
import { cn } from "lib/utils"
import { useForm } from "react-hook-form"

// const FormSchema = z.object({
//   username: z.string().min(2, {
//     message: "Username must be at least 2 characters.",
//   }),
// })

const LogIn = () => {
  const form = useForm({
    // resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      accessCode: "",
    },
  })

  const { signIn } = useAuth()

  const onSubmit = (values) => {
    // console.log(signIn)
    signIn(values)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Form {...form}>
        <form
          className={cn(
            "relative max-w-md w-[448px] overflow-x-hidden h-[400px]"
          )}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div
            className={cn(
              "absolute transition-transform duration-500 bg-white p-8 rounded-lg shadow-lg w-full max-w-md top-0 left-0"
            )}
          >
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-2">
              Login
            </h2>
            <p className="mb-6 text-center">
              Please enter your account credentials to login
            </p>

            <div className="space-y-5">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Your password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                // type="submit"
              >
                Login
              </Button>
            </div>
            <div className="text-muted-foreground mt-6">
              <a href="/auth/sign-in" className="text-blue-400">
                Login with passwordless method
              </a>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LogIn
