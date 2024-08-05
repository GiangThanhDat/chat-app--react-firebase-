import { useAuth } from "context/auth-provider"
import { cn } from "lib/utils"

const Conversation = ({
  name,
  lastMessage,
  senderId,
  avatar,
  onClick,
  selected,
}) => {
  const { user } = useAuth()
  return (
    <div
      className={cn(
        "conversation hover:cursor-pointer rounded-lg hover:bg-slate-200 p-2 space-y-2",
        selected ? "bg-blue-100" : ""
      )}
      onClick={onClick}
    >
      <div className="flex gap-x-2 items-start">
        <div className="h-14 w-14 rounded-full bg-gray-300">
          <img
            className="h-full w-full rounded-full object-cover"
            src={avatar}
            alt=""
          />
        </div>
        <div className="space-y-2">
          <p className="font-bold text-base">{name}</p>
          <p className="text-muted-foreground text-sm">{`${
            senderId === user?.userId ? "You :" : ""
          }${lastMessage}`}</p>
        </div>
      </div>
    </div>
  )
}

export default Conversation
