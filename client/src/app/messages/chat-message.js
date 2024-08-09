import { cn } from "lib/utils"

const ChatMessage = ({
  message,
  senderName,
  sentAt,
  isUser,
  avatar,
  showSenderInfo,
}) => {
  const time = new Date(sentAt.seconds * 1000)
  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time
    .getMinutes()
    .toString()
    .padStart(2, "0")}`

  return (
    <div
      className={cn(
        `flex w-full items-start`,
        isUser && "justify-end",
        isUser ? "pl-24" : "pr-14",
        !showSenderInfo && !isUser && "pl-10"
      )}
    >
      {!isUser && showSenderInfo && (
        <div className="flex">
          <div className="h-10 w-10 min-w-[40px] rounded-full bg-gray-200">
            <img
              alt=""
              src={avatar}
              className="h-full w-full min-w-[40px] rounded-full object-cover"
            />
          </div>
        </div>
      )}
      <div className="pl-3 space-y-1">
        {showSenderInfo && (
          <p
            className={cn(
              "text-xs text-muted-foreground",
              isUser && "text-right"
            )}
          >
            {`${isUser ? "" : senderName + ", "}${formattedTime}`}
          </p>
        )}
        <p
          className={cn(
            `px-3 py-2 gap-x-2 rounded-lg`,
            isUser ? "bg-blue-500/80 text-white" : "bg-gray-200"
          )}
          style={{ overflowWrap: "anywhere" }}
        >
          {message}
        </p>
      </div>
    </div>
  )
}

export default ChatMessage
