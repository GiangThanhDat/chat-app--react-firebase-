import { useQuery } from "@tanstack/react-query"
import { useToast } from "components/ui/use-toast"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import {
  createPostMutateFn,
  createPutMutateFn,
  createQueryByIdFn,
} from "services/utils"
import { useMutate } from "./use-mutate"

export const useFormHandler = ({
  querySingleKey,
  mutateKey,
  queryId,
  model,
  defaultValues,
}) => {
  const form = useForm()
  const { toast } = useToast()

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: [querySingleKey, queryId],
    queryFn: async () => {
      return await createQueryByIdFn(model)(queryId)
    },
    enabled: Boolean(queryId),
  })
  const { mutate, isPending } = useMutate({
    invalidateKey: [],
    mutationKey: [mutateKey],
    mutationFn: async (data) => {
      let mutateFn = createPostMutateFn

      if (queryId) {
        mutateFn = createPutMutateFn
      }

      await mutateFn(model)({ ...data, id: queryId })
    },
  })

  useEffect(() => {
    form.reset(defaultValues)
    if (queryId && isSuccess && data) {
      form.reset(data)
    }
  }, [data, queryId, form, isSuccess, defaultValues])

  const onSubmit = (values) => {
    mutate(values, {
      onSuccess() {
        const action = queryId ? "Update" : "Create"
        toast({
          title: `${action} ${model} successfully`,
          description: `Saved ${model} information`,
        })
      },
    })
  }

  return { form, onSubmit, isLoading, isPending }
}
