import { Button } from "components/ui/button"
import { MoveLeft } from "lucide-react"

const MessageHeader = ({ name, avatar, onBack }) => {
  return (
    <div className="flex items-center p-4 border-b gap-x-2">
      <Button
        variant="ghost"
        className="lg:hidden block w-fit"
        onClick={onBack}
      >
        <MoveLeft className="text-mute-foreground" />
      </Button>
      <div className="h-10 w-10 rounded-full bg-gray-300">
        <img
          className="h-full w-full rounded-full object-cover"
          src={avatar}
          alt=""
        />
      </div>
      <p className="ml-4 font-bold text-lg">{name}</p>
    </div>
  )
}

export default MessageHeader
