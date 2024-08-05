import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog"
import { Button } from "./ui/button"

const DeleteConfirmDialog = ({
  open,
  toggle,
  onConfirm,
  title,
  description,
}) => {
  return (
    <Dialog open={open} onOpenChange={toggle}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title || `Are you sure!`}</DialogTitle>
          <DialogDescription>
            {description || `This action cannot be undone`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start w-full col-span-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
          <Button
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteConfirmDialog
