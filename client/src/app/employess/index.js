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
import EmployeeDialog from "./dialog"

const EmployeesPage = () => {
  const [openDialog, setOpenDialog] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState()

  const {
    data = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.EMPLOYEES],
    queryFn: async () => await createQueryList("employees")(),
  })

  const { mutate } = useMutate({
    invalidateKey: [],
    mutationKey: [MUTATE_KEYS.DELETE_EMPLOYEE],
    mutationFn: async (id) => {
      return await createDeleteMutateFn("employees")(id)
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
            setSelectedEmployee(row.original)
            setOpenDialog(true)
          }}
          onDelete={() => {
            setSelectedEmployee(row.original)
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
          <FilterInputs table={table} searchColumns={["name", "email"]} />
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
              <EmployeeDialog
                open={openDialog}
                toggle={() => setOpenDialog((prev) => !prev)}
                employeeId={selectedEmployee?.id}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={() => {
                      setSelectedEmployee({})
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
          if (selectedEmployee.id) {
            mutate(selectedEmployee.id, {
              onSuccess() {
                setSelectedEmployee({})
              },
            })
          }
          setOpenConfirm(false)
        }}
      />
    </>
  )
}

export default EmployeesPage
