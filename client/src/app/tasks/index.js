import { ReloadIcon } from "@radix-ui/react-icons"
import { useQuery } from "@tanstack/react-query"
import { DataTable } from "components/data-table"
import { Button } from "components/ui/button"

import ActionDropdown from "components/action-dropdown"
import DeleteConfirmDialog from "components/delete-confirm-dialog"
import FilterInputs from "components/filter-inputs"
import Loading from "components/ui/loading"
import { useMutate } from "hooks/use-mutate"
import { MUTATE_KEYS, QUERY_KEYS } from "lib/const"
import { Plus } from "lucide-react"
import { useState } from "react"
import { createDeleteMutateFn, createQueryList } from "services/utils"
import { columns } from "./columns"
import TaskDialog from "./dialog"

const TasksPage = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedTask, setSelectedTask] = useState()

  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.TaskS],
    queryFn: async () => await createQueryList("tasks")(),
  })

  const { mutate } = useMutate({
    invalidateKey: [],
    mutationKey: [MUTATE_KEYS.DELETE_TASKS],
    mutationFn: async (id) => {
      return await createDeleteMutateFn("tasks")(id)
    },
  })

  if (isLoading) {
    return <Loading />
  }

  if (!data) {
    return "No data"
  }

  const actionColumn = {
    id: "actions",
    cell: ({ row }) => {
      return (
        <ActionDropdown
          onEdit={() => {
            setSelectedTask(row.original)
            setOpenDialog(true)
          }}
          onDelete={() => {
            setSelectedTask(row.original)
            setOpenConfirm(true)
          }}
        />
      )
    },
  }

  return (
    <>
      <DataTable
        columns={[...columns, actionColumn]}
        data={data}
        leftToolbar={(table) => (
          <FilterInputs table={table} searchColumns={["name", "description"]} />
        )}
        rightToolbar={() => {
          return (
            <>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  refetch()
                }}
              >
                <ReloadIcon className="h-4 w-4" />
              </Button>
              <TaskDialog
                open={openDialog}
                toggle={() => setOpenDialog((prev) => !prev)}
                taskId={selectedTask?.id}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => {
                      setSelectedTask({})
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                }
              />
            </>
          )
        }}
      />
      <DeleteConfirmDialog
        open={openConfirm}
        toggle={() => setOpenConfirm((prev) => !prev)}
        onConfirm={() => {
          if (selectedTask.id) {
            mutate(selectedTask.id, {
              onSuccess() {
                setSelectedTask({})
              },
            })
          }
          setOpenConfirm(false)
        }}
      />
    </>
  )
}

export default TasksPage
