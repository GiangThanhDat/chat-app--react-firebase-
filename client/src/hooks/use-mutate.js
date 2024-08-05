// import notification from '@/lib/notifications';

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "components/ui/use-toast"

// import { ResponseFailure } from '@/types';
// import { MutationFunction, MutationKey, QueryKey, useMutation, useQueryClient } from 'react-query';

/**
 * Custom React Query hook for handling mutations.
 *
 * @remarks This hook abstracts the logic for handling mutations using `react-query`.
 * @param options - The options to configure the mutation behavior.
 * @returns The mutation function with `react-query` functionality.
 */
export const useMutate = ({ invalidateKey, mutationFn, mutationKey }) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const mutation = useMutation({
    mutationKey,
    mutationFn,
    onSuccess: () => {
      if (invalidateKey) {
        queryClient
          .invalidateQueries({ queryKey: invalidateKey })
          .catch((error) => {
            console.log("error:", error)
          })
      }
    },
    onError: (errors) => {
      console.error("errors:", errors)
      toast({ title: errors.message })
    },
  })

  return mutation
}
