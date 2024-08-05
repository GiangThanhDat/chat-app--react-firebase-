import { Button } from "components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "components/ui/form"
import { Input } from "components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select"
import { toast } from "components/ui/use-toast"
import { useMutate } from "hooks/use-mutate"
import { MUTATE_KEYS } from "lib/const"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { createPutMutateFn, postRequest } from "services/utils"

const SetupCredentials = () => {
  const form = useForm()
  const params = useParams()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutate({
    invalidateKey: [],
    mutationKey: MUTATE_KEYS.SETUP_CREDENTIALS,
    mutationFn: async (data) => {
      return await postRequest("auth/register", {
        id: params.userId,
        userName: data.userName,
        password: data.password,
      })
    },
  })

  const onSubmit = async (values) => {
    mutate(values, {
      onSuccess(response) {
        if (response.success) {
          toast({
            title: "Setup credentials successfully",
            description: "Your credentials info are setting up",
          })
          navigate("/auth/login")
        }
      },
    })
    const { password, ...rest } = values
    await createPutMutateFn("employees")({ ...rest, id: params.userId })
  }

  return (
    <Form {...form}>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Set Up Your Credentials
          </h2>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">User name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your user name" {...field} />
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
                  <FormLabel className="font-bold">password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your user name"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Department</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="manager">manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">
              {isPending ? "Setting Up..." : "Set Up"}
            </Button>
          </form>
        </div>
      </div>
    </Form>
  )
}

export default SetupCredentials
