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
        isUser ? "pl-24" : "pr-14"
      )}
    >
      {!isUser && showSenderInfo ? (
        <div className="flex">
          <div className="h-10 w-10 min-w-[40px] rounded-full bg-gray-200">
            <img
              className="h-full w-full min-w-[40px] rounded-full object-cover"
              src={avatar}
              alt=""
            />
          </div>
        </div>
      ) : (
        <div className="w-[46px] h-[40px]"></div>
      )}
      <div className="w-full pl-3 space-y-1">
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
        <div
          className={cn(
            `px-3 py-2 flex gap-x-2 rounded-lg w-full flex-2`,
            isUser ? "bg-blue-500/80 text-white" : "bg-gray-200"
          )}
        >
          <p>{message}</p>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
