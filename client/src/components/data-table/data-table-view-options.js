"use client"

import { MixerHorizontalIcon } from "@radix-ui/react-icons"

import { Button } from "components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu"

export function DataTableViewOptions({ table }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
    // <Popover>
    //   <PopoverTrigger asChild>
    //     <Button variant="outline" className="hidden p-2 sm:block">
    //       <MixerHorizontalIcon className="h-4 w-4" />
    //     </Button>
    //   </PopoverTrigger>
    //   <PopoverContent className="w-auto max-w-md p-0" align="end">
    //     <Command>
    //       <CommandEmpty></CommandEmpty>
    //       <CommandGroup>
    //         <CommandInput placeholder={"enter columns name"} className="h-9" />
    //       </CommandGroup>
    //       {table
    //         ?.getAllColumns()
    //         ?.filter(
    //           (column) =>
    //             typeof column.accessorFn !== "undefined" && column.getCanHide()
    //         )
    //         ?.map((column) => {
    //           console.log("column:", column)
    //           return (
    //             <CommandItem
    //               key={column.id}
    //               className="capitalize"
    //               // checked={column.getIsVisible()}
    //               // onCheckedChange={(value) => column.toggleVisibility(!!value)}
    //             >
    //               <div
    //                 className="flex items-center hover:cursor-pointer"
    //                 onClick={() =>
    //                   column.toggleVisibility(!column.getIsVisible())
    //                 }
    //               >
    //                 {/* <Checkbox
    //                   checked={column.getIsVisible()}
    //                   aria-label="Select column"
    //                   className="mr-3 "
    //                 /> */}
    //                 <span>{String(column.columnDef.header)}</span>
    //               </div>
    //             </CommandItem>
    //           )
    //         })}
    //     </Command>
    //   </PopoverContent>
    // </Popover>
  )
}
